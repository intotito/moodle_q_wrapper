package atu.moodle.question.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlCData;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public record FormulaQuestion(@JacksonXmlProperty(localName = "name") Text<String> name,
		@JacksonXmlProperty(localName = "questiontext") @JacksonXmlCData Text<String> questionText,
		@JacksonXmlProperty(localName = "generalfeedback") Text<String> generalFeedback,
		@JacksonXmlProperty(localName = "defaultgrade") Double defaultGrade,
		@JacksonXmlProperty(localName = "penalty") Double penalty,
		@JacksonXmlProperty(localName = "hidden") Integer hidden,
		@JacksonXmlProperty(localName = "idnumber") String idNumber,
		@JacksonXmlProperty(localName = "correctfeedback") @JacksonXmlCData Text<String> correctFeedback,
		@JacksonXmlProperty(localName = "partiallycorrectfeedback") @JacksonXmlCData Text<String> partiallyCorrectFeedback,
		@JacksonXmlProperty(localName = "incorrectfeedback") @JacksonXmlCData Text<String> incorrectFeedback,
		@JacksonXmlProperty(localName = "varsrandom") @JacksonXmlCData Text<String> randomVariables,
		@JacksonXmlProperty(localName = "varsglobal") @JacksonXmlCData Text<String> globalVariables,
		@JacksonXmlProperty(localName = "answernumbering") Text<String> answerNumbering,
		@JacksonXmlProperty(localName = "answers") @JacksonXmlElementWrapper(useWrapping = false) List<Answer> answers,
		@JacksonXmlProperty(localName = "shownumcorrect") String showNumcorrect,
		@JacksonXmlProperty(localName = "type", isAttribute = true) String type,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) Integer nfqLevel,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) String tags){
	
	
	public FormulaQuestion(
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
			List<Answer> answers, 
	        Integer nfqLevel, 
	        String tags){
		this(
				Text.of(name), 
				Text.of(questionText), 
				Text.of(generalFeedback), 
				defaultGrade, 
				penalty, 
				hidden, 
				idNumber,
				Text.of(correctFeedback), 
				Text.of(partiallyCorrectFeedback), 
				Text.of(incorrectFeedback),
				Text.of(randomVariables), 
				Text.of(globalVariables), 
				Text.of(answerNumbering), 
				answers, 
				null, 
				"formulas",
				nfqLevel,
				tags
			);
	}
	
	public FormulaQuestion(String name, 
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
			Integer nfqLevel,	
			String tags) {
		this(
			Text.of(name), 
			Text.of(questionText), 
			Text.of(generalFeedback), 
			defaultGrade, 
			penalty, 
			hidden, 
			idNumber,
			Text.of(correctFeedback), 
			Text.of(partiallyCorrectFeedback), 
			Text.of(incorrectFeedback),
			Text.of(randomVariables), 
			Text.of(globalVariables), 
			Text.of(answerNumbering)
			, new ArrayList<Answer>(),
			null,
			"formulas",
			nfqLevel,
			tags
		);
	}
	
	
	public QuestionEntity asEntity() {
		return new QuestionEntity(name.value(), questionText.value(), generalFeedback.value(), defaultGrade, penalty,
				hidden, idNumber, correctFeedback.value(), partiallyCorrectFeedback.value(), incorrectFeedback.value(),
				randomVariables.value(), globalVariables.value(), answerNumbering.value(),
				answers.stream().map(Answer::asEntity).toList(), nfqLevel, tags);
	}
}
