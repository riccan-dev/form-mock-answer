package com.example.demo.domain.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.dao.EnqueteDao;

@Service
public class SurveyDeleteServiceImpl implements SurveyDeleteService {

	private final EnqueteDao enqueteDao;

	public SurveyDeleteServiceImpl(EnqueteDao enqueteDao) {
		this.enqueteDao = enqueteDao;
	}

	@Override
	@Transactional
	public boolean delete(Integer enqueteId) {
		if (enqueteDao.selectById(enqueteId) == null) {
			return false;
		}
		// question/choice/enquete_dept/enquete_answer等はDBのON DELETE CASCADEで連鎖削除される
		enqueteDao.deleteById(enqueteId);
		return true;
	}
}
