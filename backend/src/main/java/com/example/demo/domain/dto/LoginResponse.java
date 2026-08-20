package com.example.demo.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
	private String esqId;
	private String userName;
	private Integer deptId;
}
