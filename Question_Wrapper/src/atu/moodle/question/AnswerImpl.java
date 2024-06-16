package atu.moodle.question;

import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.Control;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

public class AnswerImpl extends Answer{
	private int count;
	public AnswerImpl(Element element) {
		treeGUI = new TreeItem<String>("Answers");
		addChild(element);
		pane = new javafx.scene.control.TitledPane("Mugu", new VBox());
	}

	@Override
	public Region getControl() {
		return pane;
	}
	

	@Override
	public void addChild(Node child) {
		children.add(child);
		TreeItem<String> item = child.getGUI();
		treeGUI.getChildren().add(item);
	}

	@Override
	public void addChild(Element child) {
		children.add(new AnswerBot(child));
		TreeItem<String> tree = new TreeItem<String>("Answer");
		treeGUI.getChildren().add(tree);
		count++;
	}


}
