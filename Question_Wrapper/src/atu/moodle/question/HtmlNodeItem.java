package atu.moodle.question;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.w3c.dom.Element;

import javafx.scene.control.TextField;
import javafx.scene.control.TitledPane;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.scene.control.TextArea;


public class HtmlNodeItem extends NodeItem{

	public HtmlNodeItem(Node parent, Element element, String title, boolean isNested) {
		super(parent, element, title, isNested);
	}
	
	public List<String> getPlaceHolders(String html){
	    Pattern pattern = Pattern.compile("\\{\s*?#\\w\s*?}");
	    Matcher matcher = pattern.matcher(getTextElement(xml, isNested));
	    List<String> matches = new ArrayList<String>();
	    while(matcher.find()) {
	    	String match = matcher.group();
	    	matches.add(match);
	    }
		return matches;
	}
	
	public String replace(String value, List<String> placeHolders) {
		String content = new String(value);
		for(int i = 0; i < placeHolders.size(); i++) {
			Question question = ((Question)getRoot());//.getAnswers()
			Answer answers = question.getAnswers();
			String text = answers.getText(placeHolders.get(i));
			if(text == null)continue;
			System.out.println("Text:: " + text);
			content = content.replace(placeHolders.get(i), text);
			System.out.println("Content:: " + content);
		}
		return content;
	}
	
	@Override
	public Region getControl() {
		WebView browser = new WebView();
		browser.setPrefHeight(120);
		WebEngine webEngine = browser.getEngine();
		List<String> placeHolders = getPlaceHolders(value);
/*		String content = value;
		for(int i = 0; i < placeHolders.size(); i++) {
			Question question = ((Question)getRoot());//.getAnswers()
			Answer answers = question.getAnswers();
			String text = answers.getText(placeHolders.get(i));
			System.out.println("Text:: " + text);
			content = content.replace(placeHolders.get(i), text);
			System.out.println("Content:: " + content);
		}
*/		
		webEngine.loadContent(replace(value, placeHolders));
		
		VBox box = new VBox();
		TextArea field = new TextArea(value);
		field.setPrefWidth(480);
		field.setPrefRowCount(2);
		field.textProperty().addListener((observable, oldValue, newValue) -> {
		    System.out.println("textfield changed from " + oldValue + " to " + newValue);
		    setTextElement(xml, newValue, isNested);
		    webEngine.loadContent(replace(newValue, getPlaceHolders(value)));
		});

		VBox container = new VBox();
		box.getChildren().add(new TitledPane("Preview", browser));
		box.getChildren().add(field);

		container.getChildren().add(new TitledPane(title, box));

		
		return container;
	}
}
