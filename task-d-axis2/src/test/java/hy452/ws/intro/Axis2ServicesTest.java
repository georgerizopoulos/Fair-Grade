package hy452.ws.intro;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.apache.axis2.AxisFault;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

/** Deploys services.xml on Axis2's own HTTP server and calls it with the two clients. */
class Axis2ServicesTest {

  static LocalAxis2Server server;

  @BeforeAll
  static void start() throws Exception {
    server = new LocalAxis2Server(18090);
    server.start();
  }

  @AfterAll
  static void stop() {
    server.stop();
  }

  @Test
  void ws1ConvertsBothWays() throws Exception {
    ConverterClient client = new ConverterClient(server.serviceUrl("ConverterService"));
    assertEquals(25.4, client.inchToCm(10));
    assertEquals(1.0, client.cmToInch(2.54));
    assertEquals(68.897638, client.cmToInch(175));
    assertEquals(0.0, client.cmToInch(0));
  }

  @Test
  void ws2MatchesTheAssignmentExample() throws Exception {
    IdealWeightClient client = new IdealWeightClient(server.serviceUrl("IdealWeightService"));
    for (String operation : new String[] {"idealWeightFormula", "millerFormula"}) {
      IdealWeight w = client.idealWeight(operation, 175);
      assertEquals(68.745475, w.getMenWeight(), operation);
      assertEquals(65.2006, w.getWomenWeight(), operation);
    }
  }

  @Test
  void ws2ResponseHasTheExampleShape() throws Exception {
    IdealWeightClient client = new IdealWeightClient(server.serviceUrl("IdealWeightService"));
    String xml = client.rawResponse("millerFormula", 175).toString();
    assertTrue(xml.contains("millerFormulaResponse"), xml);
    assertTrue(xml.contains("http://intro.ws.hy452"), xml);
    assertTrue(xml.contains("http://intro.ws.hy452/xsd"), xml);
    assertTrue(xml.contains("IdealWeight"), xml);
    assertTrue(xml.contains(">68.745475<"), xml);
    assertTrue(xml.contains(">65.2006<"), xml);
  }

  @Test
  void ws2RejectsNonPositiveHeight() throws Exception {
    IdealWeightClient client = new IdealWeightClient(server.serviceUrl("IdealWeightService"));
    assertThrows(AxisFault.class, () -> client.idealWeight("idealWeightFormula", 0));
    assertThrows(AxisFault.class, () -> client.idealWeight("idealWeightFormula", -170));
  }

  @Test
  void bothServicesPublishWsdl() throws Exception {
    for (String name : new String[] {"ConverterService", "IdealWeightService"}) {
      var url = new java.net.URL(server.serviceUrl(name) + "?wsdl");
      try (var in = url.openStream()) {
        String wsdl = new String(in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        assertTrue(wsdl.contains("wsdl:definitions"), name);
      }
    }
  }
}
