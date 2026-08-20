package com.example.demo.domain.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.dao.ChoiceAnswerDao;
import com.example.demo.domain.dao.ChoiceDao;
import com.example.demo.domain.dao.EnqueteAnswerDao;
import com.example.demo.domain.dao.EsqUserDao;
import com.example.demo.domain.dao.QuestionAnswerDao;
import com.example.demo.domain.dao.QuestionDao;
import com.example.demo.domain.dao.QuestionTypeDao;
import com.example.demo.domain.dto.AnswerSubmitRequest;
import com.example.demo.domain.dto.AnswerSubmitResponse;
import com.example.demo.domain.entity.Choice;
import com.example.demo.domain.entity.ChoiceAnswer;
import com.example.demo.domain.entity.EnqueteAnswer;
import com.example.demo.domain.entity.EsqUser;
import com.example.demo.domain.entity.Question;
import com.example.demo.domain.entity.QuestionAnswer;
import com.example.demo.domain.entity.QuestionType;

@Service
public class SurveyAnswerServiceImpl implements SurveyAnswerService {

	private static final Set<String> FREE_TEXT_TYPES = Set.of("text", "textarea", "number", "date");

	private final EnqueteAnswerDao enqueteAnswerDao;
	private final EsqUserDao esqUserDao;
	private final QuestionDao questionDao;
	private final QuestionTypeDao questionTypeDao;
	private final ChoiceDao choiceDao;
	private final QuestionAnswerDao questionAnswerDao;
	private final ChoiceAnswerDao choiceAnswerDao;

	public SurveyAnswerServiceImpl(EnqueteAnswerDao enqueteAnswerDao, EsqUserDao esqUserDao, QuestionDao questionDao,
			QuestionTypeDao questionTypeDao, ChoiceDao choiceDao, QuestionAnswerDao questionAnswerDao,
			ChoiceAnswerDao choiceAnswerDao) {
		this.enqueteAnswerDao = enqueteAnswerDao;
		this.esqUserDao = esqUserDao;
		this.questionDao = questionDao;
		this.questionTypeDao = questionTypeDao;
		this.choiceDao = choiceDao;
		this.questionAnswerDao = questionAnswerDao;
		this.choiceAnswerDao = choiceAnswerDao;
	}

	@Override
	@Transactional
	public AnswerSubmitResponse submit(Integer enqueteId, String esqId, AnswerSubmitRequest request) {
		Map<Integer, String> typeCodeById = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionTypeId, QuestionType::getQuestionType));

		EsqUser esqUser = esqUserDao.selectById(esqId);

		EnqueteAnswer enqueteAnswer = new EnqueteAnswer();
		enqueteAnswer.setEnqueteId(enqueteId);
		enqueteAnswer.setEsqId(esqId);
		enqueteAnswer.setRespondentName(esqUser.getUserName());
		enqueteAnswerDao.insert(enqueteAnswer);

		Map<String, Object> answers = request.getAnswers();
		if (answers != null) {
			for (Map.Entry<String, Object> entry : answers.entrySet()) {
				saveOneAnswer(enqueteAnswer.getEnqueteAnswerId(), enqueteId, entry.getKey(), entry.getValue(),
						typeCodeById);
			}
		}

		EnqueteAnswer created = enqueteAnswerDao.selectById(enqueteAnswer.getEnqueteAnswerId());
		return AnswerSubmitResponse.builder()
				.enqueteAnswerId(created.getEnqueteAnswerId())
				.submittedAt(created.getAnswerDate())
				.build();
	}

	private void saveOneAnswer(Integer enqueteAnswerId, Integer enqueteId, String questionIdText, Object value,
			Map<Integer, String> typeCodeById) {
		Integer questionId;
		try {
			questionId = Integer.valueOf(questionIdText);
		} catch (NumberFormatException e) {
			return;
		}

		Question question = questionDao.selectById(questionId);
		if (question == null || !enqueteId.equals(question.getEnqueteId())) {
			return;
		}

		String type = typeCodeById.get(question.getQuestionTypeId());
		if (type == null || value == null) {
			return;
		}

		if (FREE_TEXT_TYPES.contains(type)) {
			QuestionAnswer questionAnswer = new QuestionAnswer();
			questionAnswer.setEnqueteAnswerId(enqueteAnswerId);
			questionAnswer.setQuestionId(questionId);
			questionAnswer.setAnswerText(value.toString());
			questionAnswerDao.insert(questionAnswer);
			return;
		}

		List<Choice> choices = choiceDao.selectByQuestionId(questionId);

		QuestionAnswer questionAnswer = new QuestionAnswer();
		questionAnswer.setEnqueteAnswerId(enqueteAnswerId);
		questionAnswer.setQuestionId(questionId);
		questionAnswerDao.insert(questionAnswer);

		if ("scale".equals(type)) {
			try {
				int number = Integer.parseInt(value.toString());
				choices.stream()
						.filter(c -> number == c.getChoiceNumber())
						.findFirst()
						.ifPresent(c -> insertChoiceAnswer(questionAnswer.getQuestionAnswerId(), c.getChoiceId()));
			} catch (NumberFormatException e) {
				// 不正な値はスキップ
			}
			return;
		}

		if ("multiple".equals(type) && value instanceof List<?> selectedTexts) {
			for (Object selected : selectedTexts) {
				choices.stream()
						.filter(c -> c.getChoiceText().equals(String.valueOf(selected)))
						.findFirst()
						.ifPresent(c -> insertChoiceAnswer(questionAnswer.getQuestionAnswerId(), c.getChoiceId()));
			}
			return;
		}

		if ("single".equals(type)) {
			choices.stream()
					.filter(c -> c.getChoiceText().equals(value.toString()))
					.findFirst()
					.ifPresent(c -> insertChoiceAnswer(questionAnswer.getQuestionAnswerId(), c.getChoiceId()));
		}
	}

	private void insertChoiceAnswer(Integer questionAnswerId, Integer choiceId) {
		ChoiceAnswer choiceAnswer = new ChoiceAnswer();
		choiceAnswer.setQuestionAnswerId(questionAnswerId);
		choiceAnswer.setChoiceId(choiceId);
		choiceAnswerDao.insert(choiceAnswer);
	}
}
