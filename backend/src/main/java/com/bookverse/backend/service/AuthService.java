package com.bookverse.backend.service;

import com.bookverse.backend.dto.*;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
    MessageResponse signup(SignupRequest signupRequest);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    MessageResponse resetPassword(ResetPasswordRequest request);
}
