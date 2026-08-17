package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Delete;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.Update;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.Enquete;

@Dao
@ConfigAutowireable
public interface EnqueteDao {

	@Select
	List<Enquete> selectAll();

	@Select
	Enquete selectById(Integer enqueteId);

	@Insert
	int insert(Enquete enquete);

	@Update
	int update(Enquete enquete);

	@Delete(sqlFile = true)
	int deleteById(Integer enqueteId);
}
