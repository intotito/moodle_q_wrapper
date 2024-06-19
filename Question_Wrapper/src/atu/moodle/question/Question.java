package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TreeItem;

public abstract class Question implements Node{
	protected Element xml;
	protected TreeItem<String> treeGUI;
	protected String type;
	protected Control pane;
	protected List<Node> children;
	protected Node parent;
	protected Answer answers;

	/**
	 * Type of question.
	 * @return the type of question.
	 */
	public abstract String getType();
	
	public Node getParent() {
		return parent;
	}
	
	public Answer getAnswers() {
		return answers;
	}
	
}
