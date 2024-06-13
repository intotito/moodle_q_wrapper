package atu.moodle.question;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javafx.scene.control.TreeItem;
import javafx.scene.layout.Region;
import javafx.scene.control.Control;

public interface Node {
	/**
	 * Get Tree Graphical User Interface handle of this Node.
	 * @return Tree GUI representation of this Node.
	 */
	public TreeItem<String> getGUI();
	/**
	 * Get XML handle of this Node.
	 * @return XML representation this Node. 
	 */
	public Element getXML();
	
	/**
	 * Get Graphical User Interface handle for this Node.
	 * @return GUI representation of this Node.
	 */
	public Region getControl();
	
	/**
	 * Query the Node if it is a leaf Node.
	 * @return true if leaf node.
	 */
	public boolean isLeaf();
	
	/**
	 * Add a child Node to this Node.
	 * @param node The child to be added.
	 */
	public void addChild(Node child);
	
	public default String getTextElement(Element element, boolean isNested) {
		return isNested 
				?	element.getElementsByTagName("text").item(0).getTextContent().trim() 
				: 	element.getTextContent().trim();
	}

	
	public default void setTextElement(Element element, String value, boolean isNested) {
		if(isNested)
			element.getElementsByTagName("text").item(0).setTextContent(value);
		else
			element.setTextContent(value);
		
	}
}
