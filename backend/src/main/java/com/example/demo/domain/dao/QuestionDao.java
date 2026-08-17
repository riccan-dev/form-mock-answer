package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Delete;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.Question;

@Dao
@ConfigAutowireable
public interface QuestionDao {

	@Select
	List<Question> selectByEnqueteId(Integer enqueteId);

	@Select
	List<Question> selectByEnqueteIds(List<Integer> enqueteIds);

	@Select
	Question selectById(Integer questionId);

	@Insert
	int insert(Question question);

	@Delete(sqlFile = true)
	int deleteByEnqueteId(Integer enqueteId);
}
