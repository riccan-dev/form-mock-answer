package com.example.demo.domain.dto;

import java.util.List;

import lombok.Data;

@Data
public class QuestionRequest {
	private String type;
	private String label;
	private List<String> options;
	private List<String> matrixRows;
	private Integer scaleMax;
	private String scaleMinLabel;
	private String scaleMaxLabel;
	private Boolean allowOther;
}
