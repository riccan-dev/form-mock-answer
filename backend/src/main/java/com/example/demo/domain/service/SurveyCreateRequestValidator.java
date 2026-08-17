package com.example.demo.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.example.demo.domain.dto.FieldError;
import com.example.demo.domain.dto.QuestionRequest;
import com.example.demo.domain.dto.SurveyCreateRequest;
import com.example.demo.domain.dto.SurveyUpdateRequest;

@Component
public class SurveyCreateRequestValidator {

	private static final Set<String> VALID_TYPES = Set.of(
			"single", "multiple", "scale", "text", "textarea", "number", "date");

	private static final Set<String> VALID_STATUSES = Set.of("draft", "published");

	public List<FieldError> validate(SurveyCreateRequest request) {
		List<FieldError> errors = validateTitleAndQuestions(request.getTitle(), request.getQuestions());

		if (!StringUtils.hasText(request.getStatus()) || !VALID_STATUSES.contains(request.getStatus())) {
			errors.add(new FieldError("status", "statusはdraftまたはpublishedを指定してください"));
		}

		return errors;
	}

	public List<FieldError> validateForUpdate(SurveyUpdateRequest request) {
		return validateTitleAndQuestions(request.getTitle(), request.getQuestions());
	}

	private List<FieldError> validateTitleAndQuestions(String title, List<QuestionRequest> questions) {
		List<FieldError> errors = new ArrayList<>();

		if (!StringUtils.hasText(title)) {
			errors.add(new FieldError("title", "タイトルは必須です"));
		} else if (title.length() > 200) {
			errors.add(new FieldError("title", "タイトルは200文字以内で入力してください"));
		}

		if (questions != null) {
			for (int i = 0; i < questions.size(); i++) {
				validateQuestion(questions.get(i), i, errors);
			}
		}

		return errors;
	}

	private void validateQuestion(QuestionRequest question, int index, List<FieldError> errors) {
		String prefix = "questions[" + index + "]";

		if (!StringUtils.hasText(question.getType()) || !VALID_TYPES.contains(question.getType())) {
			errors.add(new FieldError(prefix + ".type", "typeが不正です"));
			return;
		}

		if (!StringUtils.hasText(question.getLabel())) {
			errors.add(new FieldError(prefix + ".label", "labelは必須です"));
		}

		switch (question.getType()) {
			case "single", "multiple" -> {
				if (question.getOptions() == null || question.getOptions().size() < 2) {
					errors.add(new FieldError(prefix + ".options", "選択肢は2個以上必要です"));
				}
			}
			case "scale" -> {
				Integer scaleMax = question.getScaleMax();
				if (scaleMax == null || scaleMax < 2 || scaleMax > 10) {
					errors.add(new FieldError(prefix + ".scaleMax", "scaleMaxは2〜10の範囲で指定してください"));
				}
			}
			default -> {
				// text, textarea, number, date は追加項目なし
			}
		}
	}
}
