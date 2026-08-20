package com.example.demo.domain.service;

import com.example.demo.domain.dto.LoginResponse;

public interface AuthService {

	LoginResponse login(String esqId, String rawPassword);

	LoginResponse currentUser(String esqId);
}
