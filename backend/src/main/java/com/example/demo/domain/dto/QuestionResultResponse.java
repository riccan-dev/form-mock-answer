package com.example.demo.domain.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResultResponse {
	private Integer questionId;
	private String type;
	private String label;
	private List<OptionCountResponse> counts;
	private List<String> freeTextAnswers;
}
