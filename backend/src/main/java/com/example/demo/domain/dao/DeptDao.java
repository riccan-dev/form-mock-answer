package com.example.demo.domain.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.example.demo.domain.entity.Dept;

@Dao
@ConfigAutowireable
public interface DeptDao {

	@Select
	List<Dept> selectAll();
}
