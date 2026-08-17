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
@Table(name = "question")
@Getter
@Setter
@NoArgsConstructor
public class Question {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Integer questionId;

	@Column(name = "enquete_id")
	private Integer enqueteId;

	@Column(name = "question_number")
	private Integer questionNumber;

	@Column(name = "question_type_id")
	private Integer questionTypeId;

	@Column(name = "require_flag")
	private Boolean requireFlag;

	@Column(name = "question_text")
	private String questionText;

	@Column(name = "question_subtitle")
	private String questionSubtitle;

	@Version
	@Column(name = "version")
	private Integer version;
}
