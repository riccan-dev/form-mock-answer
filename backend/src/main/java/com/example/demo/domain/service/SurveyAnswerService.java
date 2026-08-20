package com.example.demo.domain.service;

import com.example.demo.domain.dto.AnswerSubmitRequest;
import com.example.demo.domain.dto.AnswerSubmitResponse;

public interface SurveyAnswerService {
	AnswerSubmitResponse submit(Integer enqueteId, String esqId, AnswerSubmitRequest request);
}
