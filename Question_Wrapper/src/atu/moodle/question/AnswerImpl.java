package atu.moodle.question;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Element;

import javafx.scene.control.TitledPane;
import javafx.scene.control.Control;
import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

public class AnswerImpl extends Answer{
	public AnswerImpl(Node parent) {//, Element element) {
		this.parent = parent;
//		pane = new TitledPane("Mugu", new VBox());
		children = new ArrayList<Node>();
		treeGUI = new TreeItem<String>("Answers");
//		addChild(new AnswerBot(this, element)); // Danger!! Danger!!! Danger!!!
	}

	@Override
	public Region getControl() {
		VBox vbox = new VBox();
		for(int i = 0; i < getChildren().size(); i++) {
			vbox.getChildren().add(getChildren().get(i).getControl());
		}
		return new TitledPane("Answers", vbox);
	}
	

	@Override
	public void addChild(Node child) {
		children.add(child);
//		TreeItem<String> tree = new TreeItem<String>("Answer");
		treeGUI.getChildren().add(child.getGUI());
//		((VBox)((TitledPane)pane).getContent()).getChildren().add(child.getControl());
	}
}
