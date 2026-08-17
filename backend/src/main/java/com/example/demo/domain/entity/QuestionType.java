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
@Table(name = "question_type")
@Getter
@Setter
@NoArgsConstructor
public class QuestionType {

	@Id
	@Column(name = "question_type_id")
	private Integer questionTypeId;

	@Column(name = "question_type")
	private String questionType;
}
