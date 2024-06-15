package atu.moodle.question;

import java.io.File;
import java.io.IOException;
import java.lang.ProcessHandle.Info;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javafx.scene.control.TitledPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javafx.scene.control.TreeItem;
import javafx.scene.control.Control;
import javafx.scene.control.ScrollPane;

public class QuestionImpl extends Question{
	protected Element xml;
	protected TreeItem<String> treeGUI;
	protected String type;
//	protected String name;
	protected Control pane;
	public QuestionImpl() {
		Document document = readDocument("C:\\Users\\intot\\moodle_q_wrapper\\Question_Wrapper\\res\\chem-titration.xml");
		children = new ArrayList<Node>();
//		org.w3c.dom.Node node  = document.getDocumentElement().getChildNodes().item(0);
		pane = new TitledPane("Awumen", new HBox());
		NodeList list = document.getDocumentElement().getChildNodes();
		for(int i = 0; i < list.getLength(); i++) {
			if(list.item(i).getNodeType() == org.w3c.dom.Node.ELEMENT_NODE) {
				Element question = (Element)list.item(i);
				xml = question;
				type = question.getAttribute("type");
				treeGUI = new TreeItem<String>("Question");
				for (int j = 0; j < question.getChildNodes().getLength(); j++) {
					org.w3c.dom.Node node = question.getChildNodes().item(j);
					if(node.getNodeType() == org.w3c.dom.Node.ELEMENT_NODE) {
						if(node.getNodeName().equals("name")) {
							addChild(new NodeItem((Element)node, "Name", true));
						} else if(node.getNodeName().equals("questiontext")) {
							addChild(new HtmlNodeItem((Element)node, "Question Text", true));
						}else if(node.getNodeName().equals("generalfeedback")) {
							addChild(new NodeItem((Element)node, "Feedback (General)", true));
						} else if(node.getNodeName().equals("defaultgrade")) {
							addChild(new NodeItem((Element)node, "Default Grade", false));
						}else if(node.getNodeName().equals("penalty")) {
							addChild(new NodeItem((Element)node, "Penalty", false));
						}else if(node.getNodeName().equals("correctfeedback")) {
							addChild(new NodeItem((Element)node, "Feedback (Correct)", true));
						}else if(node.getNodeName().equals("partiallycorrectfeedback")) {
							addChild(new NodeItem((Element)node, "Feedback (Partially Correct)", true));
						}else if(node.getNodeName().equals("incorrectfeedback")) {
							addChild(new NodeItem((Element)node, "Feedback (Incorrect)", true));
						}else if(node.getNodeName().equals("varsrandom")) {
							addChild(new NodeItem((Element)node, "Random Variables", true));
						}else if(node.getNodeName().equals("varsglobal")) {
							addChild(new NodeItem((Element)node, "Global Variables", true));
						}else if(node.getNodeName().equals("answernumbering")) {
							addChild(new NodeItem((Element)node, "Answer Numbering", true));
						}
					}
				}
				break;
			}
		}
	}
	
	public static Document readDocument(String fileName){
		Document doc = null;
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		try {
			DocumentBuilder db = dbf.newDocumentBuilder();
			doc = db.parse(new File(fileName));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch(ParserConfigurationException  pce) {
			pce.printStackTrace();
		}
		return doc;
	}

	@Override
	public TreeItem<String> getGUI() {
		return treeGUI;
	}

	@Override
	public Element getXML() {
		return xml;
	}

	@Override
	public boolean isLeaf() {
		return false;
	}

	@Override
	public String getType() {
		return type;
	}

	@Override
	public Region getControl() {
		ScrollPane scroll = new ScrollPane();
		VBox vbox = new VBox();
		for(int i = 0; i < children.size(); i++) {
			vbox.getChildren().add(children.get(i).getControl());
		}
		scroll.setContent(vbox);
		return scroll;
	}

	@Override
	public void addChild(Node child) {
		children.add(child);
		TreeItem<String> item = child.getGUI();
		treeGUI.getChildren().add(item);
	}

	/*
	@Override
	public Node searchTree(TreeItem<String> tree) {
		for(Node n : children) {
			if(n.searchTree(tree) != null) {
				return n;
			}
		}
		return null;
	}
	*/
	@Override
	public List<Node> getChildren() {
		return children;
	}
}
