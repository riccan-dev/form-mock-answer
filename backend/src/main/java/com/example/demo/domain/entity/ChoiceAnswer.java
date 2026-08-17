package com.example.demo.domain.entity;

import org.seasar.doma.Column;
import org.seasar.doma.Entity;
import org.seasar.doma.GeneratedValue;
import org.seasar.doma.GenerationType;
import org.seasar.doma.Id;
import org.seasar.doma.Metamodel;
import org.seasar.doma.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(metamodel = @Metamodel)
@Table(name = "choice_answer")
@Getter
@Setter
@NoArgsConstructor
public class ChoiceAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "choice_answer_id")
	private Integer choiceAnswerId;

	@Column(name = "question_answer_id")
	private Integer questionAnswerId;

	@Column(name = "choice_id")
	private Integer choiceId;
}
