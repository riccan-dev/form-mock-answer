package com.example.demo.domain.entity;

import org.seasar.doma.Column;
import org.seasar.doma.Entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * enquete_answerをenquete_idごとに集計した件数。特定のテーブル行と対応しないため@Tableは付けない(SELECT専用)。
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
public class EnqueteAnswerCount {

	@Column(name = "enquete_id")
	private Integer enqueteId;

	@Column(name = "answer_count")
	private Long answerCount;
}
