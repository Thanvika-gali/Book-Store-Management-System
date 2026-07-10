package com.bookverse.backend.mapper;

import com.bookverse.backend.dto.AddressDto;
import com.bookverse.backend.dto.AddressRequest;
import com.bookverse.backend.entity.Address;
import com.bookverse.backend.entity.User;

public class AddressMapper {

    public static AddressDto toDto(Address address) {
        if (address == null) {
            return null;
        }

        return AddressDto.builder()
                .id(address.getId())
                .userId(address.getUser().getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .country(address.getCountry())
                .zipCode(address.getZipCode())
                .phone(address.getPhone())
                .isDefault(address.getIsDefault())
                .build();
    }

    public static Address toEntity(AddressRequest request, User user) {
        if (request == null) {
            return null;
        }

        return Address.builder()
                .user(user)
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .zipCode(request.getZipCode())
                .phone(request.getPhone())
                .isDefault(request.getIsDefault() != null && request.getIsDefault())
                .build();
    }

    public static void updateEntityFromRequest(AddressRequest request, Address address) {
        if (request == null || address == null) {
            return;
        }

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setZipCode(request.getZipCode());
        address.setPhone(request.getPhone());
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }
    }
}
