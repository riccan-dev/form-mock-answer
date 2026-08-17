package com.example.demo.domain.dto;

import java.util.List;

import lombok.Data;

@Data
public class SurveyUpdateRequest {
	private String title;
	private String description;
	private List<QuestionRequest> questions;
}
