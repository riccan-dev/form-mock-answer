package com.example.demo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OptionCountResponse {
	private String label;
	private long count;
}
