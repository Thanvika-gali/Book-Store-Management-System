package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;
import com.bookverse.backend.entity.Notification;
import com.bookverse.backend.entity.Role;
import com.bookverse.backend.entity.User;
import com.bookverse.backend.entity.UserStatus;
import com.bookverse.backend.exception.BadRequestException;
import com.bookverse.backend.exception.UserBlockedException;
import com.bookverse.backend.repository.NotificationRepository;
import com.bookverse.backend.repository.UserRepository;
import com.bookverse.backend.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final NotificationRepository notificationRepository;

    // Thread-safe maps for password reset tokens (Mock Recovery Storage)
    private final ConcurrentHashMap<String, String> tokenEmailMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> tokenExpiryMap = new ConcurrentHashMap<>();

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           PasswordEncoder encoder,
                           JwtUtils jwtUtils,
                           NotificationRepository notificationRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        // First check if user is blocked before authenticating
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with email: " + loginRequest.getEmail()));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new UserBlockedException("Your account is blocked. Please contact support.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getProfilePicture()
        );
    }

    @Override
    @Transactional
    public MessageResponse signup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(encoder.encode(signupRequest.getPassword()))
                .role(Role.CUSTOMER) // Default role
                .status(UserStatus.ACTIVE)
                .profilePicture("https://api.dicebear.com/7.x/adventurer/svg?seed=" + signupRequest.getName().replaceAll("\\s+", ""))
                .build();

        User savedUser = userRepository.save(user);

        // Seed initial Welcome Notification
        Notification welcomeNotif = Notification.builder()
                .user(savedUser)
                .title("Welcome to BookVerse!")
                .message("Hello " + savedUser.getName() + ", thank you for joining BookVerse. We hope you enjoy browsing and shopping with us!")
                .isRead(false)
                .build();
        notificationRepository.save(welcomeNotif);

        logger.info("New user registered successfully: {}", savedUser.getEmail());
        return new MessageResponse("User registered successfully!");
    }

    @Override
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with email: " + request.getEmail()));

        // Generate temporary 15-minute token
        String token = UUID.randomUUID().toString();
        tokenEmailMap.put(token, user.getEmail());
        tokenExpiryMap.put(token, LocalDateTime.now().plusMinutes(15));
        
        // Correct is plusMinutes
        // Let's print/log the reset token locally. This is the simulated reset email.
        logger.info("****************************************************************");
        logger.info("PASSWORD RESET LINK FOR {}: http://localhost:5173/reset-password?token={}", user.getEmail(), token);
        logger.info("****************************************************************");

        return new MessageResponse("Password reset link has been generated. Check console logs for link!");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        String token = request.getToken();
        if (!tokenEmailMap.containsKey(token)) {
            throw new BadRequestException("Invalid or expired password reset token.");
        }

        LocalDateTime expiry = tokenExpiryMap.get(token);
        if (expiry == null || expiry.isBefore(LocalDateTime.now())) {
            // Clean up
            tokenEmailMap.remove(token);
            tokenExpiryMap.remove(token);
            throw new BadRequestException("Password reset token has expired.");
        }

        String email = tokenEmailMap.get(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found during password reset."));

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Clean up token
        tokenEmailMap.remove(token);
        tokenExpiryMap.remove(token);

        logger.info("Password successfully reset for user: {}", email);
        return new MessageResponse("Password has been reset successfully.");
    }
}
