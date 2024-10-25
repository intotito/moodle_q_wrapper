package atu.moodle.question.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import atu.moodle.question.model.Answer;
import atu.moodle.question.model.FormulaQuestion;
import atu.moodle.question.model.QuestionEntity;

@Repository
public interface QuestionRepository extends CrudRepository<QuestionEntity, String> {

	@Query("SELECT new atu.moodle.question.model.FormulaQuestion(q.name, q.questionText, q.generalFeedback, q.defaultGrade, " 	
			+ "q.penalty, q.hidden, q.idNumber, q.correctFeedback, q.partiallyCorrectFeedback, q.incorrectFeedback, q.randomVariables, "
			+ "q.globalVariables, q.answerNumbering, q.nfqLevel, q.tags) "
			+ "FROM QuestionEntity q ")
	public List<FormulaQuestion> findAllQuestions();
	
	@Query("SELECT new atu.moodle.question.model.FormulaQuestion(q.name, q.questionText, q.generalFeedback, q.defaultGrade, " 	
			+ "q.penalty, q.hidden, q.idNumber, q.correctFeedback, q.partiallyCorrectFeedback, q.incorrectFeedback, q.randomVariables, "
			+ "q.globalVariables, q.answerNumbering, q.nfqLevel, q.tags) "
			+ "FROM QuestionEntity q WHERE q.idNumber = :id")
	public Optional<FormulaQuestion> findQuestionById(String id);
	
	
	@Query("(SELECT new atu.moodle.question.model.Answer(a.partIndex, a.placeHolder, a.answerMark, a.answerType, "
			+ "a.numberOfBox, a.variable1, a.answer, a.variable2, a.correctness, a.unitPenalty, a.postUnit, a.ruleId, a.otherRule, "
			+ "a.subQuestionText, a.feedback, a.correctFeedback, a.partiallyCorrectFeedback, a.incorrectFeedback)"
			+ "FROM AnswerEntity a WHERE a.questionId = :questionId)")
	public List<Answer> findAllAnswers(String questionId);
	
	public List<QuestionEntity> findByNfqLevel(Integer level);
	
	public List<QuestionEntity> findByNfqLevelAndTagsContaining(Integer level, String tag);
	
	
}
