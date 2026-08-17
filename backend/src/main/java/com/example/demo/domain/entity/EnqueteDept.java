package com.example.demo.domain.entity;

import org.seasar.doma.Column;
import org.seasar.doma.Entity;
import org.seasar.doma.Id;
import org.seasar.doma.Metamodel;
import org.seasar.doma.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(metamodel = @Metamodel)
@Table(name = "enquete_dept")
@Getter
@Setter
@NoArgsConstructor
public class EnqueteDept {

	@Id
	@Column(name = "enquete_id")
	private Integer enqueteId;

	@Id
	@Column(name = "dept_id")
	private Integer deptId;
}
