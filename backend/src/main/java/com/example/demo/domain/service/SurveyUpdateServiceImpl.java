package com.example.demo.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.QuestionDao;
import com.example.demo.domain.dao.QuestionTypeDao;
import com.example.demo.domain.dto.QuestionRequest;
import com.example.demo.domain.dto.QuestionResponse;
import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.dto.SurveyUpdateRequest;
import com.example.demo.domain.entity.Enquete;
import com.example.demo.domain.entity.QuestionType;

@Service
public class SurveyUpdateServiceImpl implements SurveyUpdateService {

	private final EnqueteDao enqueteDao;
	private final QuestionDao questionDao;
	private final QuestionTypeDao questionTypeDao;
	private final QuestionWriter questionWriter;
	private final SurveyApiListService surveyApiListService;

	public SurveyUpdateServiceImpl(EnqueteDao enqueteDao, QuestionDao questionDao, QuestionTypeDao questionTypeDao,
			QuestionWriter questionWriter, SurveyApiListService surveyApiListService) {
		this.enqueteDao = enqueteDao;
		this.questionDao = questionDao;
		this.questionTypeDao = questionTypeDao;
		this.questionWriter = questionWriter;
		this.surveyApiListService = surveyApiListService;
	}

	@Override
	@Transactional
	public SurveyResponse update(Integer enqueteId, SurveyUpdateRequest request) {
		Enquete enquete = enqueteDao.selectById(enqueteId);
		enquete.setEnqueteName(request.getTitle());
		enquete.setEnqueteSubtext(request.getDescription());
		enqueteDao.update(enquete);

		// 質問はいったん全削除して作り直す(ON DELETE CASCADEでchoice/question_answer/choice_answerも連鎖削除される)
		questionDao.deleteByEnqueteId(enqueteId);

		Map<String, Integer> typeIdByCode = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionType, QuestionType::getQuestionTypeId));

		List<QuestionResponse> questionResponses = new ArrayList<>();
		List<QuestionRequest> questionRequests = request.getQuestions();
		if (questionRequests != null) {
			for (int i = 0; i < questionRequests.size(); i++) {
				questionResponses.add(questionWriter.write(enqueteId, questionRequests.get(i), i, typeIdByCode));
			}
		}

		return surveyApiListService.getById(enqueteId);
	}
}
