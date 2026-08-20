package com.example.demo.domain.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
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
import com.example.demo.domain.entity.EnqueteAnswerCount;
import com.example.demo.domain.entity.EnqueteDept;
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
	public List<SurveyResponse> listSurveys(String esqId) {
		List<Enquete> enquetes = enqueteDao.selectAll();
		List<Integer> enqueteIds = enquetes.stream().map(Enquete::getEnqueteId).toList();

		List<Dept> departments = deptDao.selectAll();
		Map<Integer, String> deptNameById = departments.stream()
				.collect(Collectors.toMap(Dept::getDeptId, Dept::getDeptName));
		Set<String> allDeptNames = new HashSet<>(deptNameById.values());
		Map<Integer, String> stateNameById = enqueteStateDao.selectAll().stream()
				.collect(Collectors.toMap(EnqueteState::getEnqueteStateId, EnqueteState::getEnqueteState));
		Map<Integer, String> typeCodeById = questionTypeDao.selectAll().stream()
				.collect(Collectors.toMap(QuestionType::getQuestionTypeId, QuestionType::getQuestionType));

		Map<Integer, List<String>> deptNamesByEnqueteId = enqueteDeptDao.selectByEnqueteIds(enqueteIds).stream()
				.collect(Collectors.groupingBy(EnqueteDept::getEnqueteId,
						Collectors.mapping(ed -> deptNameById.get(ed.getDeptId()), Collectors.toList())));
		Map<Integer, Long> responseCountByEnqueteId = enqueteAnswerDao.countByEnqueteIds(enqueteIds).stream()
				.collect(Collectors.toMap(EnqueteAnswerCount::getEnqueteId, EnqueteAnswerCount::getAnswerCount));
		Set<Integer> answeredEnqueteIds = esqId == null ? Set.of()
				: new HashSet<>(enqueteAnswerDao.selectAnsweredEnqueteIds(esqId, enqueteIds));
		Map<Integer, List<QuestionResponse>> questionsByEnqueteId = listQuestionsByEnqueteIds(enqueteIds,
				typeCodeById);

		List<SurveyResponse> result = new ArrayList<>();
		for (Enquete enquete : enquetes) {
			Integer enqueteId = enquete.getEnqueteId();
			List<String> targetDepartments = resolveTargetDepartments(
					deptNamesByEnqueteId.getOrDefault(enqueteId, List.of()), allDeptNames);

			result.add(SurveyResponse.builder()
					.id(enqueteId)
					.title(enquete.getEnqueteName())
					.description(enquete.getEnqueteSubtext())
					.status(effectiveStatus(enquete, stateNameById))
					.targetDepartments(targetDepartments)
					.dueDate(enquete.getFinishDate())
					.distributionStartedAt(enquete.getStartDate())
					.createdAt(enquete.getCreateDate())
					.responseCount(responseCountByEnqueteId.getOrDefault(enqueteId, 0L))
					.totalCount(totalHeadcount(targetDepartments, departments))
					.answeredByRespondent(esqId == null ? null : answeredEnqueteIds.contains(enqueteId))
					.questions(questionsByEnqueteId.getOrDefault(enqueteId, List.of()))
					.build());
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
			Map<Integer, String> stateNameById, Map<Integer, String> typeCodeById, String esqId) {
		List<String> targetDepartments = resolveTargetDepartments(
				enqueteDeptDao.selectDeptNamesByEnqueteId(enquete.getEnqueteId()), allDeptNames);

		Boolean answeredByRespondent = esqId == null ? null
				: enqueteAnswerDao.countByEnqueteIdAndEsqId(enquete.getEnqueteId(), esqId) > 0;

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

	private List<String> resolveTargetDepartments(List<String> names, Set<String> allDeptNames) {
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

		return questions.stream()
				.map(q -> buildQuestionResponse(q, typeCodeById,
						choiceTextsByQuestionId.getOrDefault(q.getQuestionId(), List.of())))
				.toList();
	}

	private Map<Integer, List<QuestionResponse>> listQuestionsByEnqueteIds(List<Integer> enqueteIds,
			Map<Integer, String> typeCodeById) {
		List<Question> questions = questionDao.selectByEnqueteIds(enqueteIds);
		List<Integer> questionIds = questions.stream().map(Question::getQuestionId).toList();
		Map<Integer, List<String>> choiceTextsByQuestionId = choiceDao.selectByQuestionIds(questionIds).stream()
				.collect(Collectors.groupingBy(Choice::getQuestionId,
						Collectors.mapping(Choice::getChoiceText, Collectors.toList())));

		Map<Integer, List<QuestionResponse>> result = new HashMap<>();
		for (Question question : questions) {
			List<String> choiceTexts = choiceTextsByQuestionId.getOrDefault(question.getQuestionId(), List.of());
			result.computeIfAbsent(question.getEnqueteId(), k -> new ArrayList<>())
					.add(buildQuestionResponse(question, typeCodeById, choiceTexts));
		}
		return result;
	}

	private QuestionResponse buildQuestionResponse(Question question, Map<Integer, String> typeCodeById,
			List<String> choiceTexts) {
		String type = typeCodeById.get(question.getQuestionTypeId());

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

		return builder.build();
	}
}
