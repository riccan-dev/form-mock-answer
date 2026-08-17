package com.example.demo.domain.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.domain.dao.ChoiceDao;
import com.example.demo.domain.dao.DeptDao;
import com.example.demo.domain.dao.EnqueteAnswerDao;
import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.EnqueteDeptDao;
import com.example.demo.domain.dao.EnqueteStateDao;
import com.example.demo.domain.dao.QuestionDao;
import com.example.demo.domain.dao.QuestionTypeDao;
import com.example.demo.domain.dto.QuestionResponse;
import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.entity.Choice;
import com.example.demo.domain.entity.Dept;
import com.example.demo.domain.entity.Enquete;
import com.example.demo.domain.entity.EnqueteState;
import com.example.demo.domain.entity.Question;
import com.example.demo.domain.entity.QuestionType;

@Service
public class SurveyApiListServiceImpl implements SurveyApiListService {

	private static final String ALL_COMPANY = "全社";

	private static final Map<String, String> STATE_NAME_TO_STATUS = Map.of(
			"下書き", "draft",
			"配信中", "published",
			"回収終了", "closed");

	private final EnqueteDao enqueteDao;
	private final EnqueteStateDao enqueteStateDao;
	private final QuestionDao questionDao;
	private final QuestionTypeDao questionTypeDao;
	private final ChoiceDao choiceDao;
	private final EnqueteDeptDao enqueteDeptDao;
	private final EnqueteAnswerDao enqueteAnswerDao;
	private final DeptDao deptDao;

	public SurveyApiListServiceImpl(EnqueteDao enqueteDao, EnqueteStateDao enqueteStateDao, QuestionDao questionDao,
			QuestionTypeDao questionTypeDao, ChoiceDao choiceDao, EnqueteDeptDao enqueteDeptDao,
			EnqueteAnswerDao enqueteAnswerDao, DeptDao deptDao) {
		this.enqueteDao = enqueteDao;
		this.enqueteStateDao = enqueteStateDao;
		this.questionDao = questionDao;
		this.questionTypeDao = questionTypeDao;
		this.choiceDao = choiceDao;
		this.enqueteDeptDao = enqueteDeptDao;
		this.enqueteAnswerDao = enqueteAnswerDao;
		this.deptDao = deptDao;
	}

	@Override
	public List<SurveyResponse> listSurveys(String respondentName) {
		List<Dept> departments = deptDao.selectAll();
		Set<String> allDeptNames = departments.stream().map(Dept::getDeptName).collect(Collectors.toSet());
		Map<Integer, String> stateNameById = enqueteStateDao.selectAll().stream()
				.collect(Collectors.toMap(EnqueteState::getEnqueteStateId, EnqueteState::getEnqueteState));
		Map<Integer, String> typeCodeById = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionTypeId, QuestionType::getQuestionType));

		List<SurveyResponse> result = new ArrayList<>();
		for (Enquete enquete : enqueteDao.selectAll()) {
			result.add(buildSurveyResponse(enquete, departments, allDeptNames, stateNameById, typeCodeById,
					respondentName));
		}
		return result;
	}

	@Override
	public SurveyResponse getById(Integer enqueteId) {
		Enquete enquete = enqueteDao.selectById(enqueteId);
		if (enquete == null) {
			return null;
		}

		List<Dept> departments = deptDao.selectAll();
		Set<String> allDeptNames = departments.stream().map(Dept::getDeptName).collect(Collectors.toSet());
		Map<Integer, String> stateNameById = enqueteStateDao.selectAll().stream()
				.collect(Collectors.toMap(EnqueteState::getEnqueteStateId, EnqueteState::getEnqueteState));
		Map<Integer, String> typeCodeById = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionTypeId, QuestionType::getQuestionType));

		return buildSurveyResponse(enquete, departments, allDeptNames, stateNameById, typeCodeById, null);
	}

	private SurveyResponse buildSurveyResponse(Enquete enquete, List<Dept> departments, Set<String> allDeptNames,
			Map<Integer, String> stateNameById, Map<Integer, String> typeCodeById, String respondentName) {
		List<String> targetDepartments = resolveTargetDepartments(enquete.getEnqueteId(), allDeptNames);

		Boolean answeredByRespondent = respondentName == null ? null
				: enqueteAnswerDao.countByEnqueteIdAndRespondentName(enquete.getEnqueteId(), respondentName) > 0;

		return SurveyResponse.builder()
				.id(enquete.getEnqueteId())
				.title(enquete.getEnqueteName())
				.description(enquete.getEnqueteSubtext())
				.status(effectiveStatus(enquete, stateNameById))
				.targetDepartments(targetDepartments)
				.dueDate(enquete.getFinishDate())
				.distributionStartedAt(enquete.getStartDate())
				.createdAt(enquete.getCreateDate())
				.responseCount(enqueteAnswerDao.countByEnqueteId(enquete.getEnqueteId()))
				.totalCount(totalHeadcount(targetDepartments, departments))
				.answeredByRespondent(answeredByRespondent)
				.questions(listQuestions(enquete.getEnqueteId(), typeCodeById))
				.build();
	}

	private List<String> resolveTargetDepartments(Integer enqueteId, Set<String> allDeptNames) {
		List<String> names = enqueteDeptDao.selectDeptNamesByEnqueteId(enqueteId);
		if (!names.isEmpty() && new HashSet<>(names).equals(allDeptNames)) {
			return List.of(ALL_COMPANY);
		}
		return names;
	}

	private String effectiveStatus(Enquete enquete, Map<Integer, String> stateNameById) {
		String stateName = stateNameById.get(enquete.getEnqueteStateId());
		if ("配信中".equals(stateName) && enquete.getFinishDate() != null
				&& enquete.getFinishDate().isBefore(LocalDate.now())) {
			return "closed";
		}
		return STATE_NAME_TO_STATUS.get(stateName);
	}

	private int totalHeadcount(List<String> targetDepartments, List<Dept> departments) {
		if (targetDepartments.contains(ALL_COMPANY)) {
			return departments.stream().mapToInt(Dept::getHeadcount).sum();
		}
		return departments.stream()
				.filter(d -> targetDepartments.contains(d.getDeptName()))
				.mapToInt(Dept::getHeadcount)
				.sum();
	}

	private List<QuestionResponse> listQuestions(Integer enqueteId, Map<Integer, String> typeCodeById) {
		List<Question> questions = questionDao.selectByEnqueteId(enqueteId);
		List<Integer> questionIds = questions.stream().map(Question::getQuestionId).toList();
		Map<Integer, List<String>> choiceTextsByQuestionId = choiceDao.selectByQuestionIds(questionIds).stream()
				.collect(Collectors.groupingBy(Choice::getQuestionId,
						Collectors.mapping(Choice::getChoiceText, Collectors.toList())));

		List<QuestionResponse> questionResponses = new ArrayList<>();
		for (Question question : questions) {
			String type = typeCodeById.get(question.getQuestionTypeId());
			List<String> choiceTexts = choiceTextsByQuestionId.getOrDefault(question.getQuestionId(), List.of());

			QuestionResponse.QuestionResponseBuilder builder = QuestionResponse.builder()
					.id(question.getQuestionId())
					.type(type)
					.label(question.getQuestionText())
					.matrixRows(List.of())
					.allowOther(false);

			if ("scale".equals(type)) {
				builder.scaleMax(choiceTexts.size())
						.scaleMinLabel(choiceTexts.isEmpty() ? "" : choiceTexts.get(0))
						.scaleMaxLabel(choiceTexts.isEmpty() ? "" : choiceTexts.get(choiceTexts.size() - 1))
						.options(null);
			} else {
				builder.options(choiceTexts);
			}

			questionResponses.add(builder.build());
		}
		return questionResponses;
	}
}
