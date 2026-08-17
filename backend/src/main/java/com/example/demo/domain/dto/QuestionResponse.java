package com.example.demo.domain.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponse {
	private Integer id;
	private String type;
	private String label;
	private List<String> options;
	private List<String> matrixRows;
	private Integer scaleMax;
	private String scaleMinLabel;
	private String scaleMaxLabel;
	private Boolean allowOther;
}
