package com.example.demo.domain.entity;

import org.seasar.doma.Column;
import org.seasar.doma.Entity;
import org.seasar.doma.GeneratedValue;
import org.seasar.doma.GenerationType;
import org.seasar.doma.Id;
import org.seasar.doma.Metamodel;
import org.seasar.doma.Table;
import org.seasar.doma.Version;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(metamodel = @Metamodel)
@Table(name = "choice")
@Getter
@Setter
@NoArgsConstructor
public class Choice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "choice_id")
	private Integer choiceId;

	@Column(name = "question_id")
	private Integer questionId;

	@Column(name = "choice_number")
	private Integer choiceNumber;

	@Column(name = "choice_text")
	private String choiceText;

	@Version
	@Column(name = "version")
	private Integer version;
}
