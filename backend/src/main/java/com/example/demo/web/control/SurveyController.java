package com.example.demo.web.control;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.demo.domain.service.SurveyCreateService;
import com.example.demo.web.form.SurveyForm;

import jakarta.validation.Valid;

@Controller
public class SurveyController {

	private final SurveyCreateService surveyCreateService;

	public SurveyController(SurveyCreateService surveyCreateService) {
		this.surveyCreateService = surveyCreateService;
	}

	@GetMapping("/surveys/new")
	public String newForm(Model model) {
		model.addAttribute("surveyForm", new SurveyForm());
		return "survey-form";
	}

	@PostMapping("/surveys")
	public String create(@Valid @ModelAttribute SurveyForm surveyForm, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return "survey-form";
		}
		surveyCreateService.createSurvey(surveyForm.getTitle(), surveyForm.getDescription());
		return "redirect:/";
	}
}
