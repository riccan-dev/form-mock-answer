package com.example.demo.domain.dto;

import java.util.List;

import lombok.Data;

@Data
public class SurveyCreateRequest {
	private String title;
	private String description;
	private String status;
	private List<QuestionRequest> questions;
}
