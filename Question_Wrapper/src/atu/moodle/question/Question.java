package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

public abstract class Question implements Node{
	protected List<Node> children;
	/**
	 * Type of question.
	 * @return the type of question.
	 */
	public abstract String getType();
	
	
}
