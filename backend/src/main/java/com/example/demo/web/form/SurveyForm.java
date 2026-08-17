package com.example.demo.web.form;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SurveyForm {

	@NotBlank(message = "タイトルは必須です")
	private String title;

	private String description;
}
