package com.example.demo.domain.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SurveyResponse {
	private Integer id;
	private String title;
	private String description;
	private String status;
	private List<String> targetDepartments;
	private LocalDate dueDate;
	private LocalDate distributionStartedAt;
	private LocalDateTime createdAt;
	private Long responseCount;
	private Integer totalCount;
	private Boolean answeredByRespondent;
	private List<QuestionResponse> questions;
}
