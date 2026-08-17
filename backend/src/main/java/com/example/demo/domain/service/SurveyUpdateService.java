package com.example.demo.domain.service;

import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.dto.SurveyUpdateRequest;

public interface SurveyUpdateService {
	SurveyResponse update(Integer enqueteId, SurveyUpdateRequest request);
}
