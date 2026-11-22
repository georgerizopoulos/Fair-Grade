package hy452.weather;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.Map;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** Runs the client against a fake OpenWeatherMap on localhost, so no key or network is needed. */
class WeatherClientTest {

  static final String BASE = "http://localhost:18081/data/2.5";

  /** Shaped like OpenWeatherMap's real mode=xml answer. */
  static final String HERAKLION_XML =
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?><current>"
          + "<city id=\"261745\" name=\"Heraklion\"><coord lon=\"25.1442\" lat=\"35.3387\"/>"
          + "<country>GR</country><timezone>7200</timezone>"
          + "<sun rise=\"2026-11-22T05:15:00\" set=\"2026-11-22T15:10:00\"/></city>"
          + "<temperature value=\"17.4\" min=\"16.9\" max=\"18.1\" unit=\"celsius\"/>"
          + "<feels_like value=\"17.0\" unit=\"celsius\"/>"
          + "<humidity value=\"71\" unit=\"%\"/><pressure value=\"1017\" unit=\"hPa\"/>"
          + "<wind><speed value=\"5.1\" unit=\"m/s\" name=\"Gentle Breeze\"/>"
          + "<direction value=\"320\" code=\"NW\" name=\"Northwest\"/></wind>"
          + "<clouds value=\"20\" name=\"few clouds\"/><visibility value=\"10000\"/>"
          + "<precipitation mode=\"no\"/><weather number=\"801\" value=\"few clouds\" icon=\"02d\"/>"
          + "<lastupdate value=\"2026-11-22T12:00:00\"/></current>";

  @Path("weather")
  public static class FakeOpenWeatherMap {
    @GET
    @Produces("application/xml")
    public Response weather(
        @QueryParam("q") String q,
        @QueryParam("mode") String mode,
        @QueryParam("units") String units,
        @QueryParam("appid") String appid) {
      if (!"test-key".equals(appid)) {
        return Response.status(401).entity("{\"cod\":401}").build();
      }
      if (!"Heraklion,GR".equals(q) || !"xml".equals(mode) || !"metric".equals(units)) {
        return Response.status(404).entity("{\"cod\":\"404\"}").build();
      }
      return Response.ok(HERAKLION_XML).build();
    }
  }

  static HttpServer server;

  @BeforeAll
  static void start() {
    server =
        GrizzlyHttpServerFactory.createHttpServer(
            URI.create(BASE + "/"), new ResourceConfig(FakeOpenWeatherMap.class));
  }

  @AfterAll
  static void stop() {
    server.shutdownNow();
  }

  @Test
  void fetchesXmlForACity() throws Exception {
    String xml = new WeatherClient(BASE, "test-key").currentWeatherXml("Heraklion,GR");
    assertTrue(xml.startsWith("<?xml"));
    Map<String, String> summary = WeatherClient.summary(xml);
    assertEquals("Heraklion, GR", summary.get("City"));
    assertEquals("17.4 °C", summary.get("Temperature"));
    assertEquals("few clouds", summary.get("Weather"));
    assertTrue(WeatherClient.pretty(xml).contains("\n  <city"));
  }

  @Test
  void reportsHttpErrors() {
    var bad = assertThrows(
        WeatherClient.WeatherException.class,
        () -> new WeatherClient(BASE, "wrong-key").currentWeatherXml("Heraklion,GR"));
    assertEquals(401, bad.status);
    var unknown = assertThrows(
        WeatherClient.WeatherException.class,
        () -> new WeatherClient(BASE, "test-key").currentWeatherXml("Atlantis"));
    assertEquals(404, unknown.status);
  }

  @Test
  void rejectsMissingKeyAndCity() {
    assertThrows(IllegalArgumentException.class, () -> new WeatherClient(BASE, null));
    assertThrows(IllegalArgumentException.class, () -> new WeatherClient(BASE, " "));
    assertThrows(
        IllegalArgumentException.class,
        () -> new WeatherClient(BASE, "test-key").currentWeatherXml(""));
  }
}
