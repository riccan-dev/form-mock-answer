package com.example.demo.domain.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class DistributionUpdateRequest {
	private List<String> targetDepartments;
	private LocalDate distributionStartAt;
	private LocalDate dueDate;
}
