package com.example.demo.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "enquete")
@Getter
@Setter
@NoArgsConstructor
public class Enquete {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "enquete_id")
	private Integer enqueteId;

	@Column(name = "enquete_name")
	private String enqueteName;

	@Column(name = "enquete_state_id")
	private Integer enqueteStateId;

	@Column(name = "create_date", insertable = false)
	private LocalDateTime createDate;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "finish_date")
	private LocalDate finishDate;

	@Column(name = "enquete_subtext")
	private String enqueteSubtext;

	@Version
	@Column(name = "version")
	private Integer version;
}
