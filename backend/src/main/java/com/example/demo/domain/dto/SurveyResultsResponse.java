package com.example.demo.domain.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SurveyResultsResponse {
	private long responseCount;
	private List<QuestionResultResponse> questions;
}
