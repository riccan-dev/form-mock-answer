package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.QuestionAnswer;

@Dao
@ConfigAutowireable
public interface QuestionAnswerDao {

	@Select
	List<QuestionAnswer> selectByQuestionId(Integer questionId);

	@Insert
	int insert(QuestionAnswer questionAnswer);
}
