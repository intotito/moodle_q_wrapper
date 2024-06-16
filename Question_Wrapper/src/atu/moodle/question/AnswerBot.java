package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;

public class AnswerBot implements Node{
	private Element xml;
	
	public AnswerBot(Element element) {
		this.xml = element;
	}

	@Override
	public TreeItem<String> getGUI() {
		return null;
	}

	@Override
	public Element getXML() {
		return xml;
	}

	@Override
	public Region getControl() {
		
		return null;
	}

	@Override
	public boolean isLeaf() {
		// TODO Auto-generated method stub
		return false;
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

}
