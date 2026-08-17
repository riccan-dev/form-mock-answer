package com.example.demo.domain.dao;

import org.seasar.doma.Dao;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.EnqueteAnswer;

@Dao
@ConfigAutowireable
public interface EnqueteAnswerDao {

	@Select
	long countByEnqueteId(Integer enqueteId);

	@Select
	long countByEnqueteIdAndRespondentName(Integer enqueteId, String respondentName);

	@Select
	EnqueteAnswer selectById(Integer enqueteAnswerId);

	@Insert
	int insert(EnqueteAnswer enqueteAnswer);
}
