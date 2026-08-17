package com.example.demo.web.control;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.domain.service.SurveyListService;

@Controller
public class TopController {

	private final SurveyListService surveyListService;

	public TopController(SurveyListService surveyListService) {
		this.surveyListService = surveyListService;
	}

	@GetMapping("/")
	public String index(Model model) {
		model.addAttribute("surveys", surveyListService.listSurveys());
		return "index";
	}

	@GetMapping("/hello")
	@ResponseBody
	public String hello() {
		return "Hello, Survey App!";
	}

}
