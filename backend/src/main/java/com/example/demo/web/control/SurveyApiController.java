package com.example.demo.web.control;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import com.example.demo.domain.dto.AnswerSubmitRequest;
import com.example.demo.domain.dto.AnswerSubmitResponse;
import com.example.demo.domain.dto.DistributionUpdateRequest;
import com.example.demo.domain.dto.ErrorResponse;
import com.example.demo.domain.dto.FieldError;
import com.example.demo.domain.dto.SurveyCreateRequest;
import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.dto.SurveyResultsResponse;
import com.example.demo.domain.dto.SurveyUpdateRequest;
import com.example.demo.domain.service.SurveyAnswerService;
import com.example.demo.domain.service.SurveyApiCreateService;
import com.example.demo.domain.service.SurveyApiListService;
import com.example.demo.domain.service.SurveyCreateRequestValidator;
import com.example.demo.domain.service.SurveyDeleteService;
import com.example.demo.domain.service.SurveyDistributionService;
import com.example.demo.domain.service.SurveyResultsService;
import com.example.demo.domain.service.SurveyUpdateService;

@RestController
@RequestMapping("/api/surveys")
public class SurveyApiController {

	private final SurveyApiCreateService surveyApiCreateService;
	private final SurveyApiListService surveyApiListService;
	private final SurveyAnswerService surveyAnswerService;
	private final SurveyResultsService surveyResultsService;
	private final SurveyDeleteService surveyDeleteService;
	private final SurveyDistributionService surveyDistributionService;
	private final SurveyUpdateService surveyUpdateService;
	private final SurveyCreateRequestValidator validator;

	public SurveyApiController(SurveyApiCreateService surveyApiCreateService,
			SurveyApiListService surveyApiListService, SurveyAnswerService surveyAnswerService,
			SurveyResultsService surveyResultsService, SurveyDeleteService surveyDeleteService,
			SurveyDistributionService surveyDistributionService, SurveyUpdateService surveyUpdateService,
			SurveyCreateRequestValidator validator) {
		this.surveyApiCreateService = surveyApiCreateService;
		this.surveyApiListService = surveyApiListService;
		this.surveyAnswerService = surveyAnswerService;
		this.surveyResultsService = surveyResultsService;
		this.surveyDeleteService = surveyDeleteService;
		this.surveyDistributionService = surveyDistributionService;
		this.surveyUpdateService = surveyUpdateService;
		this.validator = validator;
	}

	@GetMapping
	public List<SurveyResponse> list(HttpServletRequest httpRequest) {
		return surveyApiListService.listSurveys(AuthApiController.currentEsqId(httpRequest));
	}

	@GetMapping("/{id}")
	public ResponseEntity<SurveyResponse> getById(@PathVariable Integer id) {
		SurveyResponse response = surveyApiListService.getById(id);
		if (response == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(response);
	}

	@PostMapping
	public ResponseEntity<?> create(@RequestBody SurveyCreateRequest request) {
		List<FieldError> errors = validator.validate(request);
		if (!errors.isEmpty()) {
			return ResponseEntity.badRequest().body(new ErrorResponse(errors));
		}

		SurveyResponse response = surveyApiCreateService.create(request);
		return ResponseEntity.created(URI.create("/api/surveys/" + response.getId())).body(response);
	}

	@PostMapping("/{id}/answers")
	public ResponseEntity<AnswerSubmitResponse> submitAnswer(@PathVariable Integer id,
			@RequestBody AnswerSubmitRequest request, HttpServletRequest httpRequest) {
		String esqId = AuthApiController.currentEsqId(httpRequest);
		if (esqId == null) {
			return ResponseEntity.status(401).build();
		}
		AnswerSubmitResponse response = surveyAnswerService.submit(id, esqId, request);
		return ResponseEntity.status(201).body(response);
	}

	@GetMapping("/{id}/results")
	public ResponseEntity<SurveyResultsResponse> getResults(@PathVariable Integer id) {
		SurveyResultsResponse response = surveyResultsService.getResults(id);
		if (response == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Integer id) {
		if (!surveyDeleteService.delete(id)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/distribution")
	public ResponseEntity<SurveyResponse> updateDistribution(@PathVariable Integer id,
			@RequestBody DistributionUpdateRequest request) {
		SurveyResponse response = surveyDistributionService.updateDistribution(id, request);
		if (response == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody SurveyUpdateRequest request) {
		SurveyResponse existing = surveyApiListService.getById(id);
		if (existing == null) {
			return ResponseEntity.notFound().build();
		}
		if (!"draft".equals(existing.getStatus())) {
			return ResponseEntity.badRequest()
					.body(new ErrorResponse(List.of(new FieldError("status", "配信中または回収終了のアンケートは編集できません"))));
		}

		List<FieldError> errors = validator.validateForUpdate(request);
		if (!errors.isEmpty()) {
			return ResponseEntity.badRequest().body(new ErrorResponse(errors));
		}

		SurveyResponse response = surveyUpdateService.update(id, request);
		return ResponseEntity.ok(response);
	}
}
