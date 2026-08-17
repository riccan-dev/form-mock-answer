package com.example.demo.domain.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AnswerSubmitRequest {
	private String respondentName;
	private Map<String, Object> answers;
}
