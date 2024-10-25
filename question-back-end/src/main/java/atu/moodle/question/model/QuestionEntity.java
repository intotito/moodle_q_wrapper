package atu.moodle.question.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;

@Entity
public class QuestionEntity {
	private String name;
	@Column(length = 2048)
	private String questionText;
	private String generalFeedback;
	private Double defaultGrade;
	private Double penalty;
	private Integer hidden;
	@Id 
	private String idNumber;
	private String correctFeedback;
	private String partiallyCorrectFeedback;
	private String incorrectFeedback;
	@Column(length = 2048)
	private String randomVariables;
	@Column(length = 2048)
	private String globalVariables;
	private String answerNumbering;
	@OneToMany(cascade = CascadeType.ALL) @JoinColumn(name = "questionId")	
	private List<AnswerEntity> answers; 
	@Column(columnDefinition = "integer default 7")
	private Integer nfqLevel;
	private String tags;
	
	public QuestionEntity() {}
	
	public QuestionEntity(
			String name, 
			String questionText, 
			String generalFeedback, 
			Double defaultGrade, 
			Double penalty, 
			Integer hidden,
			String idNumber, 
			String correctFeedback, 
			String partiallyCorrectFeedback, 
			String incorrectFeedback,
			String randomVariables, 
			String globalVariables, 
			String answerNumbering, 
			List<AnswerEntity> answers, 
			Integer nfqLevel,
			String tags) {
		this.name = name;
		this.questionText = questionText;
		this.generalFeedback = generalFeedback;
		this.defaultGrade = defaultGrade;
		this.penalty = penalty;
		this.hidden = hidden;
		this.idNumber = idNumber;
		this.correctFeedback = correctFeedback;
		this.partiallyCorrectFeedback = partiallyCorrectFeedback;
		this.incorrectFeedback = incorrectFeedback;
		this.randomVariables = randomVariables;
		this.globalVariables = globalVariables;
		this.answerNumbering = answerNumbering;
		this.answers = answers;
		this.nfqLevel = nfqLevel;
		this.tags = tags;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public String getGeneralFeedback() {
		return generalFeedback;
	}

	public void setGeneralFeedback(String generalFeedback) {
		this.generalFeedback = generalFeedback;
	}

	public Double getDefaultGrade() {
		return defaultGrade;
	}

	public void setDefaultGrade(Double defaultGrade) {
		this.defaultGrade = defaultGrade;
	}

	public Double getPenalty() {
		return penalty;
	}

	public void setPenalty(Double penalty) {
		this.penalty = penalty;
	}

	public Integer getHidden() {
		return hidden;
	}

	public void setHidden(Integer hidden) {
		this.hidden = hidden;
	}

	public String getIdNumber() {
		return idNumber;
	}

	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}

	public String getCorrectFeedback() {
		return correctFeedback;
	}

	public void setCorrectFeedback(String correctFeedback) {
		this.correctFeedback = correctFeedback;
	}

	public String getPartiallyCorrectFeedback() {
		return partiallyCorrectFeedback;
	}

	public void setPartiallyCorrectFeedback(String partiallyCorrectFeedback) {
		this.partiallyCorrectFeedback = partiallyCorrectFeedback;
	}

	public String getIncorrectFeedback() {
		return incorrectFeedback;
	}

	public void setIncorrectFeedback(String incorrectFeedback) {
		this.incorrectFeedback = incorrectFeedback;
	}

	public String getRandomVariables() {
		return randomVariables;
	}

	public void setRandomVariables(String randomVariables) {
		this.randomVariables = randomVariables;
	}

	public String getGlobalVariables() {
		return globalVariables;
	}

	public void setGlobalVariables(String globalVariables) {
		this.globalVariables = globalVariables;
	}
	
	public Integer getNfqLevel() {
		return nfqLevel;
	}
	
	public void setNfqLevel(Integer nfqLevel) {
		this.nfqLevel = nfqLevel;
	}
	
	public String getTags() {
		return tags;
	}
	
	public void setTags(String tags) {
		this.tags = tags;
	}

	public String getAnswerNumbering() {
		return answerNumbering;
	}

	public void setAnswerNumbering(String answerNumbering) {
		this.answerNumbering = answerNumbering;
	}

	public List<AnswerEntity> getAnswers() {
		return answers;
	}

	public void setAnswers(List<AnswerEntity> answers) {
		this.answers = answers;
	}
	
	public FormulaQuestion toFormulaQuestion() {
		List<Answer> tAnswers = this.answers.stream().map(AnswerEntity::toAnswer).toList();
		return new FormulaQuestion(name, questionText, generalFeedback, defaultGrade, penalty, hidden, idNumber,
				correctFeedback, partiallyCorrectFeedback, incorrectFeedback, randomVariables, globalVariables,
				answerNumbering, tAnswers, nfqLevel, tags);
	}
}
