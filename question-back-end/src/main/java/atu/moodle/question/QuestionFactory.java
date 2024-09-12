package atu.moodle.question;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import atu.moodle.question.model.Answer;
import atu.moodle.question.model.AnswerEntity;
import atu.moodle.question.model.FormulaQuestion;
import atu.moodle.question.model.QuestionEntity;
import atu.moodle.question.model.Text;

public class QuestionFactory {
	
	public QuestionFactory() {
	}
	
	String name = "New Question";
	String questionText; 
	String generalFeedback; 
	Double defaultGrade = 1.0;
	Double penalty; 
	Integer hidden;
	String idNumber = Long.toHexString(System.currentTimeMillis());
	String correctFeedback;
	String partiallyCorrectFeedback;
	String incorrectFeedback; 
	String randomVariables; 
	String globalVariables; 
	String answerNumbering;
	List<Answer> answers;
	
	public QuestionFactory withName(String name) {
		this.name = name;
		return this;
	}
	
	public QuestionFactory withQuestionText(String questionText) {
		this.questionText = questionText;
		return this;
	}
	
	public QuestionFactory withGeneralFeedback(String generalFeedback) {
		this.generalFeedback = generalFeedback;
		return this;
	}
	
	public QuestionFactory withDefaultGrade(Double defaultGrade) {
		this.defaultGrade = defaultGrade;
		return this;
	}
	
	public QuestionFactory withPenalty(Double penalty) {
		this.penalty = penalty;
		return this;
	}
	
	public QuestionFactory withHidden(Integer hidden) {
		this.hidden = hidden;
		return this;
	}
	
	public QuestionFactory withIdNumber(String idNumber) {
		this.idNumber = idNumber;
		return this;
	}
	
	public QuestionFactory withCorrectFeedback(String correctFeedback) {
		this.correctFeedback = correctFeedback;
		return this;
	}
	
	public QuestionFactory withPartiallyCorrectFeedback(String partiallyCorrectFeedback) {
		this.partiallyCorrectFeedback = partiallyCorrectFeedback;
		return this;
	}
	
	public QuestionFactory withIncorrectFeedback(String incorrectFeedback) {
		this.incorrectFeedback = incorrectFeedback;
		return this;
	}
	
	public QuestionFactory withRandomVariables(String randomVariables) {
		this.randomVariables = randomVariables;
		return this;
	}
	
	public QuestionFactory withGlobalVariables(String globalVariables) {
		this.globalVariables = globalVariables;
		return this;
	}
	
	public QuestionFactory withAnswerNumbering(String answerNumbering) {
		this.answerNumbering = answerNumbering;
		return this;
	}
	
	public QuestionFactory withAnswers(List<Answer> answers) {
		this.answers = answers;
		return this;
	}

	
	public FormulaQuestion build() {
		List<Answer> answers = new ArrayList<>();
		Answer a = new Answer(answers.size(), "", 1.0, 0, 0, "", "", "", "", 0.0, "", 0, "", "", "", "", "", "");
		answers.add(a);
		return new FormulaQuestion(name, questionText, generalFeedback, defaultGrade, penalty, 
				hidden, idNumber, correctFeedback, partiallyCorrectFeedback, incorrectFeedback, 
				randomVariables, globalVariables, answerNumbering, answers);
	}

	public static AnswerEntity updateAnswer(AnswerEntity a, Answer ans) {
		a.setPartIndex(ans.partIndex().value());
		a.setPlaceHolder(ans.placeHolder().value());
		a.setAnswerMark(ans.answerMark().value());
		a.setAnswerType(ans.answerType().value());
		a.setNumberOfBox(ans.numberOfBox().value());
		a.setVariable1(ans.variable1().value());
		a.setAnswer(ans.answer().value());
		a.setVariable2(ans.variable2().value());
		a.setCorrectness(ans.correctness().value());
		a.setUnitPenalty(ans.unitPenalty().value());
		a.setPostUnit(ans.postUnit().value());
		a.setRuleId(ans.ruleId().value());
		a.setOtherRule(ans.otherRule().value());
		a.setSubQuestionText(ans.subQuestionText().value());
		a.setFeedback(ans.feedback().value());
		a.setCorrectFeedback(ans.correctFeedback().value());
		a.setPartiallyCorrectFeedback(ans.partiallyCorrectFeedback().value());
		a.setIncorrectFeedback(ans.incorrectFeedback().value());		
		return a;
	}
	
	public static QuestionEntity updateQuestion(QuestionEntity q, FormulaQuestion fq) {
		System.out.println("Name: " + fq.name().value());
		q.setName(fq.name().value());
		System.out.println("Question: " + fq.questionText().value());
		q.setQuestionText(fq.questionText().value());
		System.out.println("General Feedback: " + fq.generalFeedback().value());
		q.setGeneralFeedback(fq.generalFeedback().value());
		System.out.println("Default Grade: " + fq.defaultGrade());
		q.setDefaultGrade(fq.defaultGrade());
		System.out.println("Penalty: " + fq.penalty());
		q.setPenalty(fq.penalty());
		System.out.println("Hidden: " + fq.hidden());
		q.setHidden(fq.hidden());
		System.out.println("Correct Feedback: " + fq.correctFeedback().value());
		q.setCorrectFeedback(fq.correctFeedback().value());
		System.out.println("Partially Correct Feedback: " + fq.partiallyCorrectFeedback().value());
		q.setPartiallyCorrectFeedback(fq.partiallyCorrectFeedback().value());
		System.out.println("Incorrect Feedback: " + fq.incorrectFeedback().value());
		q.setIncorrectFeedback(fq.incorrectFeedback().value());
		System.out.println("Answer Numbering: " + fq.answerNumbering().value());
		q.setRandomVariables(fq.randomVariables().value());
		System.out.println("Random Variables: " + fq.randomVariables().value());
		q.setGlobalVariables(fq.globalVariables().value());
		System.out.println("Global Variables: " + fq.globalVariables().value());
		q.setAnswerNumbering(fq.answerNumbering().value());
		System.out.println("Answers: " + fq.answers().size());
		IntStream.range(0,  q.getAnswers().size()).forEach(i -> updateAnswer(q.getAnswers().get(i), fq.answers().get(i)));
		return q;
	}

}
