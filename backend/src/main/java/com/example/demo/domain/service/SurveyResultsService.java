package com.example.demo.domain.service;

import com.example.demo.domain.dto.SurveyResultsResponse;

public interface SurveyResultsService {
	SurveyResultsResponse getResults(Integer enqueteId);
}
