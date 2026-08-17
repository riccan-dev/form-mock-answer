package com.example.demo.domain.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerSubmitResponse {
	private Integer enqueteAnswerId;
	private LocalDateTime submittedAt;
}
