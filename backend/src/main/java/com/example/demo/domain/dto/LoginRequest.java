package com.example.demo.domain.dto;

import lombok.Data;

@Data
public class LoginRequest {
	private String esqId;
	private String password;
}
