package com.example.demo.domain.entity;

import java.time.LocalDateTime;

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
@Table(name = "enquete_answer")
@Getter
@Setter
@NoArgsConstructor
public class EnqueteAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "enquete_answer_id")
	private Integer enqueteAnswerId;

	@Column(name = "enquete_id")
	private Integer enqueteId;

	@Column(name = "respondent_name")
	private String respondentName;

	@Column(name = "esq_id")
	private String esqId;

	@Column(name = "answer_date", insertable = false)
	private LocalDateTime answerDate;
}
