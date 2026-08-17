package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.Choice;

@Dao
@ConfigAutowireable
public interface ChoiceDao {

	@Select
	List<Choice> selectByQuestionId(Integer questionId);

	@Select
	List<Choice> selectByQuestionIds(List<Integer> questionIds);

	@Insert
	int insert(Choice choice);
}
