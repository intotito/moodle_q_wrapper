package atu.moodle.question.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class AnswerEntity {
	@Id @GeneratedValue(strategy = GenerationType.AUTO) private Integer id;
	private Integer partIndex;
	private String placeHolder;
	private Double answerMark;
	private Integer answerType;
	private Integer numberOfBox;
	private String variable1;
	private String answer;
	private String variable2;
	private String correctness;
	private Double unitPenalty;
	private String postUnit;
	private Integer ruleId;
	private String otherRule;
	@Column(length = 2048)
	private String subQuestionText;
	private String feedback;
	private String correctFeedback;
	private String partiallyCorrectFeedback;
	private String incorrectFeedback;
	private String questionId;
	
	public AnswerEntity() {}
	
	public AnswerEntity(Integer partIndex, String placeHolder, Double answerMark, Integer answerType,
			Integer numberOfBox, String variable1, String answer, String variable2, String correctness, Double unitPenalty,
			String postUnit, Integer ruleId, String otherRule, String subQuestionText, String feedback,
			String correctFeedback, String partiallyCorrectFeedback, String incorrectFeedback) {
		this.partIndex = partIndex;
		this.placeHolder = placeHolder;
		this.answerMark = answerMark;
		this.answerType = answerType;
		this.numberOfBox = numberOfBox;
		this.variable1 = variable1;
		this.setAnswer(answer);
		this.variable2 = variable2;
		this.correctness = correctness;
		this.unitPenalty = unitPenalty;
		this.postUnit = postUnit;
		this.ruleId = ruleId;
		this.otherRule = otherRule;
		this.subQuestionText = subQuestionText;
		this.feedback = feedback;
		this.correctFeedback = correctFeedback;
		this.partiallyCorrectFeedback = partiallyCorrectFeedback;
		this.incorrectFeedback = incorrectFeedback;
	}
	
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getPartIndex() {
		return partIndex;
	}

	public void setPartIndex(Integer partIndex) {
		this.partIndex = partIndex;
	}

	public String getPlaceHolder() {
		return placeHolder;
	}

	public void setPlaceHolder(String placeHolder) {
		this.placeHolder = placeHolder;
	}

	public Double getAnswerMark() {
		return answerMark;
	}

	public void setAnswerMark(Double answerMark) {
		this.answerMark = answerMark;
	}

	public Integer getAnswerType() {
		return answerType;
	}

	public void setAnswerType(Integer answerType) {
		this.answerType = answerType;
	}

	public Integer getNumberOfBox() {
		return numberOfBox;
	}

	public void setNumberOfBox(Integer numberOfBox) {
		this.numberOfBox = numberOfBox;
	}

	public String getVariable1() {
		return variable1;
	}

	public void setVariable1(String variable1) {
		this.variable1 = variable1;
	}

	public String getVariable2() {
		return variable2;
	}

	public void setVariable2(String variable2) {
		this.variable2 = variable2;
	}

	public String getCorrectness() {
		return correctness;
	}

	public void setCorrectness(String correctness) {
		this.correctness = correctness;
	}

	public Double getUnitPenalty() {
		return unitPenalty;
	}

	public void setUnitPenalty(Double unitPenalty) {
		this.unitPenalty = unitPenalty;
	}

	public String getPostUnit() {
		return postUnit;
	}

	public void setPostUnit(String postUnit) {
		this.postUnit = postUnit;
	}

	public Integer getRuleId() {
		return ruleId;
	}

	public void setRuleId(Integer ruleId) {
		this.ruleId = ruleId;
	}

	public String getOtherRule() {
		return otherRule;
	}

	public void setOtherRule(String otherRule) {
		this.otherRule = otherRule;
	}

	public String getSubQuestionText() {
		return subQuestionText;
	}

	public void setSubQuestionText(String subQuestionText) {
		this.subQuestionText = subQuestionText;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
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

	public String getQuestionId() {
		return questionId;
	}

	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public Answer toAnswer() {
		return new Answer(partIndex, placeHolder, answerMark, answerType, numberOfBox, variable1, answer, variable2,
				correctness, unitPenalty, postUnit, ruleId, otherRule, subQuestionText, feedback, correctFeedback,
				partiallyCorrectFeedback, incorrectFeedback);
	}

}
