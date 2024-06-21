package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TextField;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

public class AnswerBot implements Node{
	private Element xml;
	protected Control pane;
	private TreeItem<String> treeGUI;
	private int part_index, answer_type, num_box, rule_id;
	private float answer_mark, unit_penalty;
	private String placeholder, vars_1, vars_2, answer, correctness, post_unit, subq_text, feedback,
	correct_feedback, partial_correct_feedback, incorrect_feedback, other_rule;
	protected Node parent;
	
	public AnswerBot(Node parent, Element element) {
		this.parent = parent;
		this.xml = element;
		for (int i = 0; i < xml.getChildNodes().getLength(); i++) {
			org.w3c.dom.Node node = xml.getChildNodes().item(i);
			if(node.getNodeType() == org.w3c.dom.Node.ELEMENT_NODE) {
				if(node.getNodeName().equals("partindex")) {
					part_index = Integer.parseInt(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("placeholder")) {
					placeholder = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("answermark")) {
					answer_mark = Float.parseFloat(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("answertype")) {
					answer_type = Integer.parseInt(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("numbox")) {
					num_box = Integer.parseInt(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("vars1")) {
					vars_1 = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("vars2")) {
					vars_2 = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("answer")) {
					answer = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("correctness")) {
					correctness = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("unitpenalty")) {
					unit_penalty = Float.parseFloat(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("postunit")) {
					post_unit = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("ruleid")) {
					rule_id = Integer.parseInt(getTextElement((Element)node, true));
				}else if(node.getNodeName().equals("otherrule")) {
					other_rule = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("subqtext")) {
					subq_text = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("feedback")) {
					feedback = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("correctfeedback")) {
					correct_feedback = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("partiallycorrectfeedback")) {
					partial_correct_feedback = getTextElement((Element)node, true);
				}else if(node.getNodeName().equals("incorrectfeedback")) {
					incorrect_feedback = getTextElement((Element)node, true);
				}
			}
		}
		treeGUI = new TreeItem<String>("Answer (" + (part_index + 1) + ")");
	}

	@Override
	public TreeItem<String> getGUI() {
		return treeGUI;
	}

	@Override
	public Element getXML() {
		return xml;
	}
	
	public String getPlaceHolder() {
		return "{" + placeholder + "}";
	}
	
	public String getSubqText() {
		return subq_text;
	}

	@Override
	public Region getControl() {
		
		VBox vbox = new VBox();
		TextField field = new TextField(getSubqText());
		field.setPrefWidth(480);
		field.textProperty().addListener((observable, oldValue, newValue) -> {
		 //   System.out.println("textfield changed from " + oldValue + " to " + newValue);
		  //  setTextElement(xml, newValue, isNested);
		});
		vbox.getChildren().add(field);
		return vbox;
	}

	@Override
	public boolean isLeaf() {
		return true;
	}

	@Override
	public List<Node> getChildren() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addChild(Node child) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Node getParent() {
		return parent;
	}

}
