package atu.moodle.question.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public record Answer(
		@JacksonXmlProperty(localName = "partindex") Text<Integer> partIndex,
		@JacksonXmlProperty(localName = "placeholder") Text<String> placeHolder,
		@JacksonXmlProperty(localName = "answermark") Text<Double> answerMark,
		@JacksonXmlProperty(localName = "answertype") Text<Integer> answerType,
		@JacksonXmlProperty(localName = "numbox") Text<Integer> numberOfBox,
		@JacksonXmlProperty(localName = "vars1") @JacksonXmlCData Text<String> variable1,
		@JacksonXmlProperty(localName = "answer")Text<String> answer,
		@JacksonXmlProperty(localName = "vars2") @JacksonXmlCData Text<String> variable2,
		@JacksonXmlProperty(localName = "correctness") @JacksonXmlCData Text<String> correctness,
		@JacksonXmlProperty(localName = "unitpenalty") Text<Double> unitPenalty,
		@JacksonXmlProperty(localName = "postunit") Text<String> postUnit,
		@JacksonXmlProperty(localName = "ruleid") Text<Integer> ruleId,
		@JacksonXmlProperty(localName = "otherrule") Text<String> otherRule,
		@JacksonXmlProperty(localName = "subqtext") @JacksonXmlCData Text<String> subQuestionText,
		@JacksonXmlProperty(localName = "feedback") @JacksonXmlCData Text<String> feedback,
		@JacksonXmlProperty(localName = "correctfeedback") @JacksonXmlCData Text<String> correctFeedback,
		@JacksonXmlProperty(localName = "partiallycorrectfeedback") @JacksonXmlCData Text<String> partiallyCorrectFeedback,
		@JacksonXmlProperty(localName = "incorrectfeedback") @JacksonXmlCData Text<String> incorrectFeedback) {
	
	public Answer(Integer partIndex, String placeHolder, Double answerMark, Integer answerType, Integer numberOfBox,
			String variable1, String answer, String variable2, String correctness, Double unitPenalty, String postUnit,
			Integer ruleId, String otherRule, String subQuestionText, String feedback, String correctFeedback,
			String partiallyCorrectFeedback, String incorrectFeedback) {
		this(Text.of(partIndex), Text.of(placeHolder), Text.of(answerMark), Text.of(answerType), Text.of(numberOfBox),
				Text.of(variable1), Text.of(answer), Text.of(variable2), Text.of(correctness), Text.of(unitPenalty), Text.of(postUnit),
				Text.of(ruleId), Text.of(otherRule), Text.of(subQuestionText, "html"), Text.of(feedback, "html"),
				Text.of(correctFeedback, "html"), Text.of(partiallyCorrectFeedback, "html"), Text.of(incorrectFeedback, "html"));
	}
	
	
	public AnswerEntity asEntity() {
		return new AnswerEntity(partIndex.value(), placeHolder.value(), answerMark.value(), answerType.value(),
				numberOfBox.value(), variable1.value(), answer.value(), variable2.value(), correctness.value(), unitPenalty.value(),
				postUnit.value(), ruleId.value(), otherRule.value(), subQuestionText.value(), feedback.value(),
				correctFeedback.value(), partiallyCorrectFeedback.value(), incorrectFeedback.value());
	}
}
