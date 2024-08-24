package atu.moodle.question.model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public record Text<T>(T text, @JacksonXmlProperty(isAttribute = true)String format) {
	public Text(T text) {
		this(text, null);
	}
	
	public static Text<Integer> of(Integer text) {
		return new Text<Integer>(text);
	}
	
	public static Text<String> of(String text) {
		return new Text<String>(text);
	}
	
	public static Text<String> of(String text, String format) {
		return new Text<String>(text, format);
	}
	
	public static Text<Double> of(Double text) {
		return new Text<Double>(text);
	}
	
	public T value() {
		return text;
	}
}
