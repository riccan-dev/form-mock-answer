package com.example.demo.domain.service;

import com.example.demo.domain.dto.SurveyCreateRequest;
import com.example.demo.domain.dto.SurveyResponse;

public interface SurveyApiCreateService {
	SurveyResponse create(SurveyCreateRequest request);
}
