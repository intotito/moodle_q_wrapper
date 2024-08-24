package atu.moodle.question.model;

public enum AnswerNumbering {
	none("none"), alphabet("abc"), number("123");
	private final String string;
	AnswerNumbering(String string) {
		this.string = string;
	}
	@Override
	public String toString() {
		return string;
	}
}
