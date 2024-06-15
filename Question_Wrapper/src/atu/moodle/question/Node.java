package atu.moodle.question;

import java.util.List;

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
	 * Get all the child nodes for this Node.
	 * @return list of children nodes.
	 */
	public List<Node> getChildren();
	
	/**
	 * Add a child Node to this Node.
	 * @param node The child to be added.
	 */
	public void addChild(Node child);
	
	/**
	 * Searches for Node with specified TreeItem.
	 * 
	 * Performs a recursive search for Node that owns the tree. The search is passed
	 * from parent to children, until the owner is found by comparing the trees.
	 * @param tree The TreeItem to search for the owner.
	 * @return The owner (Node) of the specified TreeeItem. 
	 */
	public default Node searchTree(TreeItem<String> tree) {
		if(getGUI() == tree) {
			return this;
		}
		if(!isLeaf()){
			for(Node n : getChildren()) {
				if(n.searchTree(tree) != null) {
					return n;
				}
			}
		}	
		return null;
	}
	
	
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
