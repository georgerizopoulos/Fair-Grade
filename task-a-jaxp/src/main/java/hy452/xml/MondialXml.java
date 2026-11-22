package hy452.xml;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Task A: reads the Mondial XML with JAXP (DOM + XPath) and writes the European countries to JSON
 * with Gson.
 *
 * <p>Usage: {@code java hy452.xml.MondialXml <mondial.xml> [output.json]}
 */
public class MondialXml {

  /** Countries whose encompassed/@continent points at the continent named Europe. */
  static final String EUROPEAN_COUNTRIES =
      "/mondial/country[encompassed/@continent = /mondial/continent[@name='Europe']/@id]";

  /** Countries that lie in both Europe and Asia. */
  static final String EUROPE_AND_ASIA_COUNTRIES =
      "/mondial/country["
          + "encompassed/@continent = /mondial/continent[@name='Europe']/@id and "
          + "encompassed/@continent = /mondial/continent[@name='Asia']/@id]";

  public static void main(String[] args) throws Exception {
    if (args.length < 1) {
      System.err.println("Usage: java hy452.xml.MondialXml <mondial.xml> [output.json]");
      System.exit(1);
    }
    Path output = Path.of(args.length > 1 ? args[1] : "european_countries.json");

    Document doc = parse(new File(args[0]));
    XPath xpath = XPathFactory.newInstance().newXPath();

    // i) The root node and the names of the first-level nodes below it.
    System.out.println("=== A.i) Root node and first-level nodes ===");
    Element root = doc.getDocumentElement();
    System.out.println("Root node: " + root.getNodeName());
    Map<String, Integer> firstLevel = firstLevelNodeNames(root);
    System.out.println("First-level node names (in document order, with how many of each):");
    firstLevel.forEach((name, count) -> System.out.println("  " + name + " (" + count + ")"));

    // ii) Names of all European countries, via XPath.
    System.out.println();
    System.out.println("=== A.ii) European countries (XPath) ===");
    NodeList names =
        (NodeList) xpath.evaluate(EUROPEAN_COUNTRIES + "/@name", doc, XPathConstants.NODESET);
    for (int i = 0; i < names.getLength(); i++) {
      System.out.println("  " + names.item(i).getNodeValue());
    }
    System.out.println("Total: " + names.getLength());

    // iii) Countries in both Europe and Asia, with every attribute.
    System.out.println();
    System.out.println("=== A.iii) Countries in both Europe and Asia ===");
    for (Map<String, String> country : attributesOf(xpath, doc, EUROPE_AND_ASIA_COUNTRIES)) {
      System.out.println("Country: " + country.get("name"));
      country.forEach((name, value) -> System.out.println("  " + name + " = " + value));
    }

    // iv) European countries with all their attributes, as JSON.
    System.out.println();
    System.out.println("=== A.iv) European countries as JSON (Gson) ===");
    List<Map<String, String>> european = attributesOf(xpath, doc, EUROPEAN_COUNTRIES);
    writeJson(european, output);
    System.out.println("Wrote " + european.size() + " countries to " + output.toAbsolutePath());
  }

  static Document parse(File file) throws Exception {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    // The file references no DTD, but turn off external entities anyway.
    factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
    factory.setExpandEntityReferences(false);
    DocumentBuilder builder = factory.newDocumentBuilder();
    return builder.parse(file);
  }

  /** Element names directly below the root, in first-seen order, with a count of each. */
  static Map<String, Integer> firstLevelNodeNames(Element root) {
    Map<String, Integer> names = new LinkedHashMap<>();
    NodeList children = root.getChildNodes();
    for (int i = 0; i < children.getLength(); i++) {
      Node child = children.item(i);
      if (child.getNodeType() == Node.ELEMENT_NODE) {
        names.merge(child.getNodeName(), 1, Integer::sum);
      }
    }
    return names;
  }

  /** Every attribute of every node the expression selects, using Node.getAttributes(). */
  static List<Map<String, String>> attributesOf(XPath xpath, Document doc, String expression)
      throws XPathExpressionException {
    NodeList nodes = (NodeList) xpath.evaluate(expression, doc, XPathConstants.NODESET);
    List<Map<String, String>> result = new ArrayList<>();
    for (int i = 0; i < nodes.getLength(); i++) {
      NamedNodeMap attributes = nodes.item(i).getAttributes();
      Map<String, String> map = new LinkedHashMap<>();
      for (int j = 0; j < attributes.getLength(); j++) {
        Node attribute = attributes.item(j);
        map.put(attribute.getNodeName(), attribute.getNodeValue());
      }
      // DOM returns attributes sorted by name; put "name" first so the output is easier to read.
      Map<String, String> ordered = new LinkedHashMap<>();
      if (map.containsKey("name")) {
        ordered.put("name", map.get("name"));
      }
      ordered.putAll(map);
      result.add(ordered);
    }
    return result;
  }

  static void writeJson(List<Map<String, String>> countries, Path output) throws IOException {
    Gson gson = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();
    try (Writer writer = Files.newBufferedWriter(output, StandardCharsets.UTF_8)) {
      gson.toJson(countries, writer);
    }
  }
}
