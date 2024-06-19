package atu.moodle.question;

import java.util.List;
import java.util.regex.Pattern;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;

public abstract class Answer implements Node {
	protected List<Node> children;
	protected Element xml;
	protected TreeItem<String> treeGUI;
	protected Control pane;
	protected Node parent;

//	public abstract void addChild(Element child);

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
	
	public String getText(String placeholder) {
//		System.out.println("PLaceholder;:: " + placeholder);
		for(int i = 0; i < children.size(); i++) {
			AnswerBot an = (AnswerBot)children.get(i);
			String botPlaceH = an.getPlaceHolder();
	//		System.out.println("Bot Place Holder::: " + botPlaceH);
			if(botPlaceH.matches(Pattern.quote(placeholder))){
	//			System.out.println(botPlaceH + "\tMAtch+++++++++++++++++++++++++++++++ " + Pattern.quote(placeholder) + "\n" + an.getSubqText());
				return an.getSubqText();
			}
		}
		return null;
	}
	
	public Node getParent() {
		return parent;
	}
	
}
