package hy452.jersey;

import static org.junit.jupiter.api.Assertions.assertEquals;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.WebTarget;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.glassfish.grizzly.http.server.HttpServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ConverterResourceTest {

  static final String BASE = "http://localhost:18080/api/";
  static HttpServer server;
  static Client client;
  static WebTarget converter;

  @BeforeAll
  static void start() {
    server = ConverterServer.start(BASE);
    client = ClientBuilder.newClient();
    converter = client.target(BASE).path("converter");
  }

  @AfterAll
  static void stop() {
    client.close();
    server.shutdownNow();
  }

  private String get(String operation, String value, MediaType type) {
    return converter.path(operation).queryParam("value", value).request(type).get(String.class);
  }

  @Test
  void convertsBothWays() {
    assertEquals("2.54", get("inch_to_cm", "1", MediaType.TEXT_PLAIN_TYPE));
    assertEquals("1.0", get("cm_to_inch", "2.54", MediaType.TEXT_PLAIN_TYPE));
    assertEquals("68.897638", get("cm_to_inch", "175", MediaType.TEXT_PLAIN_TYPE));
    assertEquals("0.0", get("cm_to_inch", "0", MediaType.TEXT_PLAIN_TYPE));
    assertEquals("-25.4", get("inch_to_cm", "-10", MediaType.TEXT_PLAIN_TYPE));
  }

  @Test
  void jsonAndXml() {
    assertEquals(
        "{\"inch\":1.0,\"cm\":2.54}", get("inch_to_cm", "1", MediaType.APPLICATION_JSON_TYPE));
    assertEquals(
        "<cm_to_inch><cm>2.54</cm><inch>1.0</inch></cm_to_inch>",
        get("cm_to_inch", "2.54", MediaType.APPLICATION_XML_TYPE));
  }

  @Test
  void rejectsBadInput() {
    for (String bad : new String[] {"", "abc", "NaN", "Infinity"}) {
      Response r = converter.path("cm_to_inch").queryParam("value", bad).request().get();
      assertEquals(400, r.getStatus(), "value=" + bad);
      r.close();
    }
    Response missing = converter.path("inch_to_cm").request().get();
    assertEquals(400, missing.getStatus());
    assertEquals("Missing query parameter: value", missing.readEntity(String.class));
  }
}
