package com.example.demo.domain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.domain.dao.EnqueteDao;
import com.example.demo.domain.entity.Enquete;

@Service
public class SurveyListServiceImpl implements SurveyListService {

	private final EnqueteDao enqueteDao;

	public SurveyListServiceImpl(EnqueteDao enqueteDao) {
		this.enqueteDao = enqueteDao;
	}

	@Override
	public List<Enquete> listSurveys() {
		return enqueteDao.selectAll();
	}
}
