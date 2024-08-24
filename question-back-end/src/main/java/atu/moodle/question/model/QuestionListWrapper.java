package atu.moodle.question.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

@JacksonXmlRootElement(localName = "quiz")
public class QuestionListWrapper {
	private List<FormulaQuestion> questions;
	
	public QuestionListWrapper(List<FormulaQuestion> questions) {
		this.questions = questions;
	}
	
	public QuestionListWrapper(FormulaQuestion... questions) {
		this(List.of(questions));
	}
	@JsonProperty("questions")
	@JacksonXmlProperty(localName = "question")
	@JacksonXmlElementWrapper(useWrapping = false)
	public List<FormulaQuestion> getQuestions() {
		return questions;
	}

}
