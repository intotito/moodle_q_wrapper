package atu.moodle.question.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import atu.moodle.question.QuestionFactory;
import atu.moodle.question.model.FormulaQuestion;
import atu.moodle.question.model.QuestionListWrapper;
import atu.moodle.question.services.QuestionService;

@RestController
@RequestMapping(path = "/api", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
@CrossOrigin()
public class FormulaQuestionController {
	
	@Autowired
	private QuestionService questionService;
	
	@GetMapping("/questions")
	public QuestionListWrapper getQuestions() {
		return questionService.getAllQuestions();
	}
	
	@GetMapping(path = "/questions/search")
	public QuestionListWrapper getQuestionsByNfqLevelAndTag(@RequestParam("level") Integer level, 
			@RequestParam("tag") String tag) {
		return questionService.getQuestionsByNfqLevelAndTag(level, tag);
	}
	
	// endpoint to get nfq level for a given question id 
	@GetMapping(path = "/questions/nfq/{id}")
	public Integer getNfqLevelById(@PathVariable String id) {
		return questionService.getNfqLevelById(id);
	}
	
	
	@GetMapping(path = "/questions/{id}")
	public QuestionListWrapper getQuestionById(@PathVariable String id) {
		return new QuestionListWrapper(questionService.getQuestionById(id));
	}
	
	@GetMapping(path="/questions/blank")
	public QuestionListWrapper getBlankQuestion() {
        return new QuestionListWrapper(new QuestionFactory().build());
	}
	
	@PostMapping("/questions/create")
	public ResponseEntity<String> createQuestion(@RequestBody FormulaQuestion question) {
//		System.out.println(repository.getQuestions().getQuestions().get(0));
//		System.out.println("Create Question method is called " + question);
		questionService.saveQuestion(question.asEntity());
		 return ResponseEntity.status(HttpStatus.CREATED)
                 .body("{\"message\": \"Question created successfully\"}");
	}
	
	@PutMapping("/questions/update/{id}")
	public ResponseEntity<String> updateQuestion(@PathVariable String id, @RequestBody FormulaQuestion question,
			@RequestParam("level") String level, @RequestParam("tag") String tag) {
		System.out.println("Update Question method is called " + question);
		var qe = question.asEntity();
		qe.setNfqLevel(Integer.parseInt(level));
		qe.setTags(tag);
		FormulaQuestion q = qe.toFormulaQuestion();
		System.out.println("Checking question: " + q);
		questionService.updateQuestion(id, q);
		return ResponseEntity.status(HttpStatus.OK).body("{\"message\": \"Question updated successfully\"}");
	}
}
