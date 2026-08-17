package com.example.demo.domain.dao;

import org.seasar.doma.Dao;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.ChoiceAnswer;

@Dao
@ConfigAutowireable
public interface ChoiceAnswerDao {

	@Select
	long countByChoiceId(Integer choiceId);

	@Insert
	int insert(ChoiceAnswer choiceAnswer);
}
