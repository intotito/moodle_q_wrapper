package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TextField;
import javafx.scene.control.TitledPane;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

public class NodeItem implements Node{
	protected Element xml;
	protected String title, value;
	protected TreeItem<String> treeGUI;
	protected boolean isNested = false;
	public NodeItem(Element element, String title, boolean isNested) {
		this.xml = element;
		this.title = title;
		treeGUI = new TreeItem<String>(title);
		this.isNested = isNested;
		value = getTextElement(xml, isNested);
	}

	@Override
	public TreeItem<String> getGUI() {
//		TreeItem<String> item = new TreeItem<String>(title);
		return treeGUI;
	}

	@Override
	public Element getXML() {
		return xml;
	}

	@Override
	public Region getControl() {
		VBox box = new VBox();
		TextField field = new TextField(value);
		field.setPrefWidth(480);
		field.textProperty().addListener((observable, oldValue, newValue) -> {
		    System.out.println("textfield changed from " + oldValue + " to " + newValue);
		    setTextElement(xml, newValue, isNested);
		});
		box.getChildren().add(new TitledPane(title, field));
		return box;
	}

	@Override
	public boolean isLeaf() {
		return true;
	}

	@Override
	public void addChild(Node child) {
		
	}

	@Override
	public Node searchTree(TreeItem<String> tree) {
		return tree == treeGUI ? this : null;
	}

	@Override
	public List<Node> getChildren() {
		return null;
	}

}
