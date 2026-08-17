package com.example.demo.domain.service;

import com.example.demo.domain.dto.DistributionUpdateRequest;
import com.example.demo.domain.dto.SurveyResponse;

public interface SurveyDistributionService {
	SurveyResponse updateDistribution(Integer enqueteId, DistributionUpdateRequest request);
}
