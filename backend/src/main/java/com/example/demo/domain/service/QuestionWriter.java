package com.example.demo.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.demo.domain.dao.ChoiceDao;
import com.example.demo.domain.dao.QuestionDao;
import com.example.demo.domain.dto.QuestionRequest;
import com.example.demo.domain.dto.QuestionResponse;
import com.example.demo.domain.entity.Choice;
import com.example.demo.domain.entity.Question;

@Component
public class QuestionWriter {

	private final QuestionDao questionDao;
	private final ChoiceDao choiceDao;

	public QuestionWriter(QuestionDao questionDao, ChoiceDao choiceDao) {
		this.questionDao = questionDao;
		this.choiceDao = choiceDao;
	}

	public QuestionResponse write(Integer enqueteId, QuestionRequest request, int questionNumber,
			Map<String, Integer> typeIdByCode) {
		Question question = new Question();
		question.setEnqueteId(enqueteId);
		question.setQuestionNumber(questionNumber + 1);
		question.setQuestionTypeId(typeIdByCode.get(request.getType()));
		question.setRequireFlag(false);
		question.setQuestionText(request.getLabel());
		question.setVersion(1);
		questionDao.insert(question);

		List<String> options = buildChoiceTexts(request);
		for (int i = 0; i < options.size(); i++) {
			Choice choice = new Choice();
			choice.setQuestionId(question.getQuestionId());
			choice.setChoiceNumber(i + 1);
			choice.setChoiceText(options.get(i));
			choice.setVersion(1);
			choiceDao.insert(choice);
		}

		return QuestionResponse.builder()
				.id(question.getQuestionId())
				.type(request.getType())
				.label(question.getQuestionText())
				.options("scale".equals(request.getType()) ? null : options)
				.matrixRows(List.of())
				.scaleMax(request.getScaleMax())
				.scaleMinLabel(request.getScaleMinLabel())
				.scaleMaxLabel(request.getScaleMaxLabel())
				.allowOther(false)
				.build();
	}

	private List<String> buildChoiceTexts(QuestionRequest request) {
		if ("scale".equals(request.getType())) {
			List<String> texts = new ArrayList<>();
			int max = request.getScaleMax();
			for (int i = 1; i <= max; i++) {
				if (i == 1) {
					texts.add(request.getScaleMinLabel() != null ? request.getScaleMinLabel() : "");
				} else if (i == max) {
					texts.add(request.getScaleMaxLabel() != null ? request.getScaleMaxLabel() : "");
				} else {
					texts.add("");
				}
			}
			return texts;
		}
		if (request.getOptions() != null) {
			return request.getOptions();
		}
		return List.of();
	}
}
