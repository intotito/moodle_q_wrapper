package atu.moodle.question.services;

import java.util.List;

import org.springframework.stereotype.Service;

import atu.moodle.question.QuestionFactory;
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
		List<FormulaQuestion> qs = questionRepository.findAllQuestions();
		qs.forEach(q -> questionRepository.findAllAnswers(q.idNumber()).forEach(q.answers()::add));
		return new QuestionListWrapper(qs);
	}
	
	public QuestionListWrapper getQuestionsByNfqLevel(Integer level) {
		List<QuestionEntity> qs = questionRepository.findByNfqLevel(level);
		List<FormulaQuestion> questions = qs.stream().map(QuestionEntity::toFormulaQuestion).toList();
		return new QuestionListWrapper(questions);
	}
	
	public FormulaQuestion getQuestionById(String id) {
		System.out.println("id: " + id);
		FormulaQuestion qs = questionRepository.findQuestionById(id).orElseThrow();
		questionRepository.findAllAnswers(id).forEach(qs.answers()::add);
		return qs;
	}
	
	public FormulaQuestion updateQuestion(String id, FormulaQuestion question) {
//		System.out.println("Formula Question: " + question);
		QuestionEntity q = questionRepository.findById(id).orElseThrow();
		System.out.println("Update Question -------------------------------------------- " + q.getAnswers().size());

		QuestionFactory.updateQuestion(q, question);
		System.out.println("Update Question -------------------------------------------- " + q.getAnswers().size());
//		q.setGeneralFeedback("Gwo gwo gwo gwo!");
		questionRepository.save(q);
		return question;
	}
}
