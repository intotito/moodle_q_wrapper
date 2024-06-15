package atu.moodle.question;

import org.w3c.dom.Element;

import javafx.scene.control.TextField;
import javafx.scene.control.TitledPane;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.scene.control.TextArea;


public class HtmlNodeItem extends NodeItem{

	public HtmlNodeItem(Element element, String title, boolean isNested) {
		super(element, title, isNested);
	}
	
	@Override
	public Region getControl() {
		WebView browser = new WebView();
		browser.setPrefHeight(120);
		WebEngine webEngine = browser.getEngine();
		String content = value;
		webEngine.loadContent(content);
		
		VBox box = new VBox();
		TextArea field = new TextArea(value);
		field.setPrefWidth(480);
		field.setPrefRowCount(2);
		field.textProperty().addListener((observable, oldValue, newValue) -> {
		    System.out.println("textfield changed from " + oldValue + " to " + newValue);
		    setTextElement(xml, newValue, isNested);
		    webEngine.loadContent(newValue);
		});

		VBox container = new VBox();
		box.getChildren().add(new TitledPane("Preview", browser));
		box.getChildren().add(field);

		container.getChildren().add(new TitledPane(title, box));

		
		return container;
	}
}
