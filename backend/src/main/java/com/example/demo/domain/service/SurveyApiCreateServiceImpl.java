package com.example.demo.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.EnqueteStateDao;
import com.example.demo.domain.dao.QuestionTypeDao;
import com.example.demo.domain.dto.QuestionRequest;
import com.example.demo.domain.dto.QuestionResponse;
import com.example.demo.domain.dto.SurveyCreateRequest;
import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.entity.Enquete;
import com.example.demo.domain.entity.EnqueteState;
import com.example.demo.domain.entity.QuestionType;

@Service
public class SurveyApiCreateServiceImpl implements SurveyApiCreateService {

	private static final Map<String, String> STATUS_TO_STATE_NAME = Map.of(
			"draft", "下書き",
			"published", "配信中");

	private final EnqueteDao enqueteDao;
	private final EnqueteStateDao enqueteStateDao;
	private final QuestionTypeDao questionTypeDao;
	private final QuestionWriter questionWriter;

	public SurveyApiCreateServiceImpl(EnqueteDao enqueteDao, EnqueteStateDao enqueteStateDao,
			QuestionTypeDao questionTypeDao, QuestionWriter questionWriter) {
		this.enqueteDao = enqueteDao;
		this.enqueteStateDao = enqueteStateDao;
		this.questionTypeDao = questionTypeDao;
		this.questionWriter = questionWriter;
	}

	@Override
	@Transactional
	public SurveyResponse create(SurveyCreateRequest request) {
		Map<String, Integer> stateIdByName = enqueteStateDao.selectAll().stream()
				.collect(Collectors.toMap(EnqueteState::getEnqueteState, EnqueteState::getEnqueteStateId));
		Map<String, Integer> typeIdByCode = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionType, QuestionType::getQuestionTypeId));

		Enquete enquete = new Enquete();
		enquete.setEnqueteName(request.getTitle());
		enquete.setEnqueteSubtext(request.getDescription());
		enquete.setEnqueteStateId(stateIdByName.get(STATUS_TO_STATE_NAME.get(request.getStatus())));
		enquete.setVersion(1);
		enqueteDao.insert(enquete);

		List<QuestionResponse> questionResponses = new ArrayList<>();
		List<QuestionRequest> questionRequests = request.getQuestions();
		if (questionRequests != null) {
			for (int i = 0; i < questionRequests.size(); i++) {
				questionResponses.add(
						questionWriter.write(enquete.getEnqueteId(), questionRequests.get(i), i, typeIdByCode));
			}
		}

		// create_dateはDB側のnow()で決まるため、登録後に取り直して正確な値をレスポンスに含める
		Enquete created = enqueteDao.selectById(enquete.getEnqueteId());

		return SurveyResponse.builder()
				.id(created.getEnqueteId())
				.title(created.getEnqueteName())
				.description(created.getEnqueteSubtext())
				.status(request.getStatus())
				.targetDepartments(List.of())
				.dueDate(created.getFinishDate())
				.distributionStartedAt(created.getStartDate())
				.createdAt(created.getCreateDate())
				.responseCount(0L)
				.totalCount(0)
				.questions(questionResponses)
				.build();
	}
}
