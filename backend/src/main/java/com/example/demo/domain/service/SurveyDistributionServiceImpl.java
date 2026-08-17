package com.example.demo.domain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.dao.DeptDao;
import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.EnqueteDeptDao;
import com.example.demo.domain.dao.EnqueteStateDao;
import com.example.demo.domain.dto.DistributionUpdateRequest;
import com.example.demo.domain.dto.SurveyResponse;
import com.example.demo.domain.entity.Dept;
import com.example.demo.domain.entity.Enquete;
import com.example.demo.domain.entity.EnqueteDept;
import com.example.demo.domain.entity.EnqueteState;

@Service
public class SurveyDistributionServiceImpl implements SurveyDistributionService {

	private static final String ALL_COMPANY = "全社";
	private static final String PUBLISHED_STATE_NAME = "配信中";

	private final EnqueteDao enqueteDao;
	private final EnqueteStateDao enqueteStateDao;
	private final EnqueteDeptDao enqueteDeptDao;
	private final DeptDao deptDao;
	private final SurveyApiListService surveyApiListService;

	public SurveyDistributionServiceImpl(EnqueteDao enqueteDao, EnqueteStateDao enqueteStateDao,
			EnqueteDeptDao enqueteDeptDao, DeptDao deptDao, SurveyApiListService surveyApiListService) {
		this.enqueteDao = enqueteDao;
		this.enqueteStateDao = enqueteStateDao;
		this.enqueteDeptDao = enqueteDeptDao;
		this.deptDao = deptDao;
		this.surveyApiListService = surveyApiListService;
	}

	@Override
	@Transactional
	public SurveyResponse updateDistribution(Integer enqueteId, DistributionUpdateRequest request) {
		Enquete enquete = enqueteDao.selectById(enqueteId);
		if (enquete == null) {
			return null;
		}

		Integer publishedStateId = enqueteStateDao.selectAll().stream()
				.filter(s -> PUBLISHED_STATE_NAME.equals(s.getEnqueteState()))
				.findFirst()
				.map(EnqueteState::getEnqueteStateId)
				.orElseThrow();

		enquete.setEnqueteStateId(publishedStateId);
		enquete.setStartDate(request.getDistributionStartAt());
		enquete.setFinishDate(request.getDueDate());
		enqueteDao.update(enquete);

		enqueteDeptDao.deleteByEnqueteId(enqueteId);
		List<String> targetDepartments = request.getTargetDepartments();
		if (targetDepartments != null) {
			List<Dept> allDepts = deptDao.selectAll();
			List<String> namesToInsert = targetDepartments.contains(ALL_COMPANY)
					? allDepts.stream().map(Dept::getDeptName).toList()
					: targetDepartments;

			for (String name : namesToInsert) {
				allDepts.stream()
						.filter(d -> d.getDeptName().equals(name))
						.findFirst()
						.ifPresent(dept -> {
							EnqueteDept enqueteDept = new EnqueteDept();
							enqueteDept.setEnqueteId(enqueteId);
							enqueteDept.setDeptId(dept.getDeptId());
							enqueteDeptDao.insert(enqueteDept);
						});
			}
		}

		return surveyApiListService.getById(enqueteId);
	}
}
