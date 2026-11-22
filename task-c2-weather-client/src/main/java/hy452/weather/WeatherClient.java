package hy452.weather;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.ByteArrayInputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Task C.ii: a Jersey client for the OpenWeatherMap current weather API, asking for XML.
 *
 * <p>Usage: {@code OPENWEATHER_API_KEY=<key> java hy452.weather.WeatherClient [city]}. The city
 * defaults to "Heraklion,GR". The key is read from the environment so it never ends up in the
 * code or the report.
 */
public class WeatherClient {

  public static final String DEFAULT_BASE_URL = "https://api.openweathermap.org/data/2.5";

  private final String baseUrl;
  private final String apiKey;

  public WeatherClient(String baseUrl, String apiKey) {
    if (apiKey == null || apiKey.isBlank()) {
      throw new IllegalArgumentException(
          "Set the OPENWEATHER_API_KEY environment variable to your OpenWeatherMap API key");
    }
    this.baseUrl = baseUrl;
    this.apiKey = apiKey.trim();
  }

  /** The current weather for the city, as OpenWeatherMap's XML document. */
  public String currentWeatherXml(String city) {
    if (city == null || city.isBlank()) {
      throw new IllegalArgumentException("City must not be empty");
    }
    Client client =
        ClientBuilder.newBuilder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();
    try {
      WebTarget target =
          client
              .target(baseUrl)
              .path("weather")
              .queryParam("q", city.trim())
              .queryParam("mode", "xml")
              .queryParam("units", "metric")
              .queryParam("appid", apiKey);
      try (Response response = target.request(MediaType.APPLICATION_XML_TYPE).get()) {
        String body = response.readEntity(String.class);
        if (response.getStatus() != 200) {
          throw new WeatherException(response.getStatus(), body);
        }
        return body;
      }
    } finally {
      client.close();
    }
  }

  /** The main readings from OpenWeatherMap's XML, in a fixed order. */
  public static Map<String, String> summary(String xml) throws Exception {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
    Document doc =
        factory
            .newDocumentBuilder()
            .parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));
    Map<String, String> s = new LinkedHashMap<>();
    s.put("City", attr(doc, "city", "name") + ", " + text(doc, "country"));
    s.put("Weather", attr(doc, "weather", "value"));
    s.put("Temperature", attr(doc, "temperature", "value") + " °C");
    s.put("Feels like", attr(doc, "feels_like", "value") + " °C");
    s.put("Humidity", attr(doc, "humidity", "value") + " " + attr(doc, "humidity", "unit"));
    s.put("Pressure", attr(doc, "pressure", "value") + " " + attr(doc, "pressure", "unit"));
    s.put("Wind", attr(doc, "speed", "value") + " m/s, " + attr(doc, "speed", "name"));
    s.put("Clouds", attr(doc, "clouds", "name"));
    s.put("Last update", attr(doc, "lastupdate", "value") + " UTC");
    return s;
  }

  /** Indents the XML for printing. */
  public static String pretty(String xml) throws Exception {
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
    Document doc =
        factory
            .newDocumentBuilder()
            .parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));
    Transformer transformer = TransformerFactory.newInstance().newTransformer();
    transformer.setOutputProperty(OutputKeys.INDENT, "yes");
    transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
    StringWriter out = new StringWriter();
    transformer.transform(new DOMSource(doc), new StreamResult(out));
    return out.toString();
  }

  private static String attr(Document doc, String tag, String attribute) {
    var nodes = doc.getElementsByTagName(tag);
    return nodes.getLength() == 0 ? "?" : ((Element) nodes.item(0)).getAttribute(attribute);
  }

  private static String text(Document doc, String tag) {
    var nodes = doc.getElementsByTagName(tag);
    return nodes.getLength() == 0 ? "?" : nodes.item(0).getTextContent().trim();
  }

  /** OpenWeatherMap answered with an error, for example 401 (bad key) or 404 (unknown city). */
  public static class WeatherException extends RuntimeException {
    public final int status;

    public WeatherException(int status, String body) {
      super("OpenWeatherMap returned HTTP " + status + ": " + body);
      this.status = status;
    }
  }

  public static void main(String[] args) throws Exception {
    String city = args.length > 0 ? String.join(" ", args) : "Heraklion,GR";
    WeatherClient weather;
    try {
      weather = new WeatherClient(DEFAULT_BASE_URL, System.getenv("OPENWEATHER_API_KEY"));
    } catch (IllegalArgumentException e) {
      System.err.println(e.getMessage());
      System.exit(2);
      return;
    }
    String xml;
    try {
      xml = weather.currentWeatherXml(city);
    } catch (WeatherException e) {
      System.err.println(e.getMessage());
      if (e.status == 401) {
        System.err.println("Check the key. A new OpenWeatherMap key can take a few hours to work.");
      }
      System.exit(1);
      return;
    }
    System.out.println("=== Current weather for " + city + " (XML from OpenWeatherMap) ===");
    System.out.println(pretty(xml));
    System.out.println("=== Summary ===");
    summary(xml).forEach((k, v) -> System.out.println(k + ": " + v));
  }
}
