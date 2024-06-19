package atu.moodle;

import java.io.File;

import atu.moodle.question.Node;
import atu.moodle.question.Question;
import atu.moodle.question.QuestionImpl;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeView;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.VBox;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
public class Window extends Application{
	private Stage stage;
	private Question question;
	@Override
	public void start(Stage stage) throws Exception {
		stage.setTitle("Moodle - Formula Question Wrapper");
		stage.setHeight(600);
		stage.setWidth(860);
		
		question = new QuestionImpl();
		
		BorderPane borderPane = new BorderPane();
		borderPane.setTop(getMenu());
		borderPane.setLeft(new HBox());
		borderPane.setCenter(new HBox());
		
		
		Scene scene = new Scene(borderPane);
		stage.setScene(scene);
		stage.setOnCloseRequest((e) -> System.exit(0));
		stage.show();
		
		
		this.stage = stage;
		setupTree(question);
		setupMain(question);
	//	stage.getScene().getRoot();
		

	}
	
	private void setupTree(Question question) {
		Pane leftPane = (Pane)((BorderPane)stage.getScene().getRoot()).getLeft();
		TreeView<String> tView = new TreeView<String>(question.getGUI());
		tView.getSelectionModel().selectedItemProperty().addListener((observable, oldValue, newValue) -> {
			Node xnode = question.searchTree(newValue);
			Pane center = (Pane)((BorderPane)stage.getScene().getRoot()).getCenter();
			center.getChildren().set(0, xnode.getControl());
			System.out.println("Selected Text : " + newValue.getValue() + " - " + xnode);
		});

		leftPane.getChildren().add(tView);
	}
	
	private void setupMain(Question question) {
		Pane center = (Pane)((BorderPane)stage.getScene().getRoot()).getCenter();
		center.getChildren().add(question.getControl());
	}
	
	protected MenuBar getMenu() {
		Menu fileMenu = new Menu("_File");
		Menu helpMenu = new Menu("_Help");
		MenuBar menuBar = new MenuBar(fileMenu);
		menuBar.getMenus().add(helpMenu);
		return menuBar;
	}
	
	protected WebView getWebView() {
		WebView browser = new WebView();
		WebEngine webEngine = browser.getEngine();
		File file = new File("C:\\Users\\intot\\moodle_q_wrapper\\Question_Wrapper\\res\\test.html");
		System.out.println("--------------\t"+file);
		if(file.exists()) {
			System.out.println("Happy Days");
		} else {
			System.out.println("ouch");
			throw new IllegalStateException("Tears! Tears!! Tears!!!");
		}
		webEngine.load(file.toURI().toString());
		System.out.println(webEngine.getLocation());
		return browser;
	}

}
