package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;

public abstract class Answer implements Node {
	protected List<Node> children;
	protected Element xml;
	protected TreeItem<String> treeGUI;
	protected Control pane;

	public abstract void addChild(Element child);

	@Override
	public boolean isLeaf() {
		return false;
	}
	
	@Override 
	public List<Node> getChildren(){
		return children;
	}
	

	@Override
	public Element getXML() {
		return xml;
	}
	
	@Override
	public TreeItem<String> getGUI() {
		return treeGUI;
	}
	

}
