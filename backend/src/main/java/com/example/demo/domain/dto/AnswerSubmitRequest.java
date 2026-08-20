package com.example.demo.domain.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AnswerSubmitRequest {
	private Map<String, Object> answers;
}
