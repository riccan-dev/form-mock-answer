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
@Table(name = "question_answer")
@Getter
@Setter
@NoArgsConstructor
public class QuestionAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_answer_id")
	private Integer questionAnswerId;

	@Column(name = "enquete_answer_id")
	private Integer enqueteAnswerId;

	@Column(name = "question_id")
	private Integer questionId;

	@Column(name = "answer_text")
	private String answerText;
}
