package com.example.demo.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.domain.dao.ChoiceAnswerDao;
import com.example.demo.domain.dao.ChoiceDao;
import com.example.demo.domain.dao.EnqueteAnswerDao;
import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.QuestionAnswerDao;
import com.example.demo.domain.dao.QuestionDao;
import com.example.demo.domain.dao.QuestionTypeDao;
import com.example.demo.domain.dto.OptionCountResponse;
import com.example.demo.domain.dto.QuestionResultResponse;
import com.example.demo.domain.dto.SurveyResultsResponse;
import com.example.demo.domain.entity.Choice;
import com.example.demo.domain.entity.Question;
import com.example.demo.domain.entity.QuestionType;

@Service
public class SurveyResultsServiceImpl implements SurveyResultsService {

	private static final Set<String> FREE_TEXT_TYPES = Set.of("text", "textarea", "number", "date");

	private final EnqueteDao enqueteDao;
	private final EnqueteAnswerDao enqueteAnswerDao;
	private final QuestionDao questionDao;
	private final QuestionTypeDao questionTypeDao;
	private final ChoiceDao choiceDao;
	private final ChoiceAnswerDao choiceAnswerDao;
	private final QuestionAnswerDao questionAnswerDao;

	public SurveyResultsServiceImpl(EnqueteDao enqueteDao, EnqueteAnswerDao enqueteAnswerDao, QuestionDao questionDao,
			QuestionTypeDao questionTypeDao, ChoiceDao choiceDao, ChoiceAnswerDao choiceAnswerDao,
			QuestionAnswerDao questionAnswerDao) {
		this.enqueteDao = enqueteDao;
		this.enqueteAnswerDao = enqueteAnswerDao;
		this.questionDao = questionDao;
		this.questionTypeDao = questionTypeDao;
		this.choiceDao = choiceDao;
		this.choiceAnswerDao = choiceAnswerDao;
		this.questionAnswerDao = questionAnswerDao;
	}

	@Override
	public SurveyResultsResponse getResults(Integer enqueteId) {
		if (enqueteDao.selectById(enqueteId) == null) {
			return null;
		}

		Map<Integer, String> typeCodeById = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionTypeId, QuestionType::getQuestionType));

		List<QuestionResultResponse> questionResults = new ArrayList<>();
		for (Question question : questionDao.selectByEnqueteId(enqueteId)) {
			String type = typeCodeById.get(question.getQuestionTypeId());
			questionResults.add(buildQuestionResult(question, type));
		}

		return SurveyResultsResponse.builder()
				.responseCount(enqueteAnswerDao.countByEnqueteId(enqueteId))
				.questions(questionResults)
				.build();
	}

	private QuestionResultResponse buildQuestionResult(Question question, String type) {
		QuestionResultResponse.QuestionResultResponseBuilder builder = QuestionResultResponse.builder()
				.questionId(question.getQuestionId())
				.type(type)
				.label(question.getQuestionText());

		if (FREE_TEXT_TYPES.contains(type)) {
			List<String> freeTextAnswers = questionAnswerDao.selectByQuestionId(question.getQuestionId()).stream()
					.map(qa -> qa.getAnswerText())
					.filter(text -> text != null && !text.isBlank())
					.toList();
			return builder.freeTextAnswers(freeTextAnswers).build();
		}

		List<Choice> choices = choiceDao.selectByQuestionId(question.getQuestionId());
		List<OptionCountResponse> counts = choices.stream()
				.map(choice -> new OptionCountResponse(
						"scale".equals(type) ? String.valueOf(choice.getChoiceNumber()) : choice.getChoiceText(),
						choiceAnswerDao.countByChoiceId(choice.getChoiceId())))
				.toList();
		return builder.counts(counts).build();
	}
}
