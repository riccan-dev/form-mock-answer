package com.example.demo.domain.service;

import org.springframework.stereotype.Service;

import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.dao.EnqueteStateDao;
import com.example.demo.domain.entity.Enquete;

@Service
public class SurveyCreateServiceImpl implements SurveyCreateService {

	private final EnqueteDao enqueteDao;
	private final EnqueteStateDao enqueteStateDao;

	public SurveyCreateServiceImpl(EnqueteDao enqueteDao, EnqueteStateDao enqueteStateDao) {
		this.enqueteDao = enqueteDao;
		this.enqueteStateDao = enqueteStateDao;
	}

	@Override
	public void createSurvey(String title, String description) {
		Integer draftStateId = enqueteStateDao.selectAll().stream()
				.filter(s -> "下書き".equals(s.getEnqueteState()))
				.findFirst()
				.orElseThrow()
				.getEnqueteStateId();

		Enquete enquete = new Enquete();
		enquete.setEnqueteName(title);
		enquete.setEnqueteSubtext(description);
		enquete.setEnqueteStateId(draftStateId);
		enquete.setVersion(1);
		enqueteDao.insert(enquete);
	}
}
