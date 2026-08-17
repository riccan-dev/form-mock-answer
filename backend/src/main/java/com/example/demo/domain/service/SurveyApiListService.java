package com.example.demo.domain.service;

import java.util.List;

import com.example.demo.domain.dto.SurveyResponse;

public interface SurveyApiListService {
	List<SurveyResponse> listSurveys(String respondentName);

	SurveyResponse getById(Integer enqueteId);
}
