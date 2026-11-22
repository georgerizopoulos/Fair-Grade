package hy452.country;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * Reads the Mondial XML once at startup and answers the service's questions with XPath.
 *
 * <p>XPath objects are not thread-safe, so every lookup is synchronized; the dataset is small
 * enough that this is not a bottleneck for this service.
 */
@Repository
public class MondialRepository {

  private final Document doc;
  private final XPath xpath = XPathFactory.newInstance().newXPath();

  public MondialRepository() throws Exception {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
    try (InputStream in = new ClassPathResource("xmldata_mondial-3.0.xml").getInputStream()) {
      doc = factory.newDocumentBuilder().parse(in);
    }
  }

  /** The country whose datacode is the given two-letter code, ignoring case. */
  public synchronized Optional<Element> country(String code) {
    if (code == null || !code.matches("[A-Za-z]{2}")) {
      return Optional.empty();
    }
    String upper = code.toUpperCase(Locale.ROOT);
    return element("/mondial/country[@datacode='" + upper + "']", doc);
  }

  /** The name of the country's capital city, if the dataset has it. */
  public synchronized Optional<String> capitalName(Element country) {
    String capitalId = country.getAttribute("capital");
    if (capitalId.isEmpty() || !capitalId.matches("[A-Za-z0-9_]+")) {
      return Optional.empty();
    }
    // The capital is a city inside the country, or inside one of its provinces.
    return element("//city[@id='" + capitalId + "']", country).map(MondialRepository::nameOf);
  }

  /** The river with exactly this name, ignoring case. */
  public synchronized Optional<Element> river(String name) {
    for (Element river : elements("/mondial/river", doc)) {
      if (river.getAttribute("name").equalsIgnoreCase(name.trim())) {
        return Optional.of(river);
      }
    }
    return Optional.empty();
  }

  /** Names of the countries the river flows through, without duplicates, in dataset order. */
  public synchronized List<String> riverCountries(Element river) {
    Set<String> names = new LinkedHashSet<>();
    for (Element located : elements("located", river)) {
      byId(located.getAttribute("country")).ifPresent(c -> names.add(c.getAttribute("name")));
    }
    return new ArrayList<>(names);
  }

  /** Where the river ends: the sea, river or lake each of its "to" elements points at. */
  public synchronized List<Outfall> riverOutfalls(Element river) {
    List<Outfall> outfalls = new ArrayList<>();
    for (Element to : elements("to", river)) {
      String type = to.getAttribute("type");
      byId(to.getAttribute("water"))
          .ifPresent(water -> outfalls.add(new Outfall(type, water.getAttribute("name"))));
    }
    return outfalls;
  }

  public record Outfall(String type, String name) {}

  private Optional<Element> byId(String id) {
    if (id.isEmpty() || !id.matches("[A-Za-z0-9_]+")) {
      return Optional.empty();
    }
    return element("/mondial/*[@id='" + id + "']", doc);
  }

  private Optional<Element> element(String expression, Node context) {
    try {
      Node node = (Node) xpath.evaluate(expression, context, XPathConstants.NODE);
      return Optional.ofNullable((Element) node);
    } catch (XPathExpressionException e) {
      throw new IllegalStateException(e);
    }
  }

  private List<Element> elements(String expression, Node context) {
    try {
      NodeList nodes = (NodeList) xpath.evaluate(expression, context, XPathConstants.NODESET);
      List<Element> result = new ArrayList<>(nodes.getLength());
      for (int i = 0; i < nodes.getLength(); i++) {
        result.add((Element) nodes.item(i));
      }
      return result;
    } catch (XPathExpressionException e) {
      throw new IllegalStateException(e);
    }
  }

  /** The text of a city's name element, or its name attribute. */
  private static String nameOf(Element element) {
    NodeList names = element.getElementsByTagName("name");
    if (names.getLength() > 0) {
      return names.item(0).getTextContent().trim();
    }
    return element.getAttribute("name");
  }
}
