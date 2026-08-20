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
@Table(name = "esq_user")
@Getter
@Setter
@NoArgsConstructor
public class EsqUser {

	@Id
	@Column(name = "esq_id")
	private String esqId;

	@Column(name = "dept_id")
	private Integer deptId;

	@Column(name = "user_name")
	private String userName;

	@Column(name = "password")
	private String password;
}
