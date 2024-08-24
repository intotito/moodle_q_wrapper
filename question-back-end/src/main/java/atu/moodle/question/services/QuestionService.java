package atu.moodle.question.services;

import java.util.List;

import org.springframework.stereotype.Service;

import atu.moodle.question.model.FormulaQuestion;
import atu.moodle.question.model.QuestionEntity;
import atu.moodle.question.model.QuestionListWrapper;
import atu.moodle.question.repository.QuestionRepository;

@Service
public class QuestionService {
	
	private final QuestionRepository questionRepository;
	
	public QuestionService(QuestionRepository questionRepository) {
		this.questionRepository = questionRepository;
	}
	
	public void saveQuestion(QuestionEntity question) {
		questionRepository.save(question);
	}
	
	public QuestionListWrapper getAllQuestions() {
		var qs = questionRepository.findAllQuestions();
		qs.forEach(q -> questionRepository.findAllAnswers(q.idNumber()).forEach(q.answers()::add));
		return new QuestionListWrapper(qs);
	}
	
	public FormulaQuestion getQuestionById(String id) {
		var qs = questionRepository.findQuestionById(id).orElseThrow();
		questionRepository.findAllAnswers(id).forEach(qs.answers()::add);
		return qs;
	}
}
