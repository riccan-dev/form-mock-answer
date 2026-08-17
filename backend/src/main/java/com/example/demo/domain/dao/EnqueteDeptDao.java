package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Delete;
import org.seasar.doma.Insert;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.EnqueteDept;

@Dao
@ConfigAutowireable
public interface EnqueteDeptDao {

	@Select
	List<String> selectDeptNamesByEnqueteId(Integer enqueteId);

	@Insert
	int insert(EnqueteDept enqueteDept);

	@Delete(sqlFile = true)
	int deleteByEnqueteId(Integer enqueteId);
}
