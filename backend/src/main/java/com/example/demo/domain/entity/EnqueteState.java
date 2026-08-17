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
@Table(name = "enquete_state")
@Getter
@Setter
@NoArgsConstructor
public class EnqueteState {

	@Id
	@Column(name = "enquete_state_id")
	private Integer enqueteStateId;

	@Column(name = "enquete_state")
	private String enqueteState;
}
