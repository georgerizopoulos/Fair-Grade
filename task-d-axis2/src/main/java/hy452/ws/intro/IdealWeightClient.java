package hy452.ws.intro;

import javax.xml.namespace.QName;
import org.apache.axiom.om.OMElement;
import org.apache.axis2.AxisFault;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.rpc.client.RPCServiceClient;

/**
 * Client for ws2 (IdealWeightService). Prints the men's and women's ideal weight and the SOAP
 * response body.
 *
 * <p>Usage: {@code java hy452.ws.intro.IdealWeightClient [endpoint] [heightCm]}. The endpoint
 * defaults to Tomcat's http://localhost:8080/axis2/services/IdealWeightService and the height to
 * 175.
 */
public class IdealWeightClient {

  static final String NAMESPACE = "http://intro.ws.hy452";
  static final String DEFAULT_ENDPOINT = "http://localhost:8080/axis2/services/IdealWeightService";

  private final RPCServiceClient client;

  public IdealWeightClient(String endpoint) throws AxisFault {
    client = new RPCServiceClient();
    Options options = client.getOptions();
    options.setTo(new EndpointReference(endpoint));
    options.setTimeOutInMilliSeconds(30_000);
  }

  /** Calls idealWeightFormula or millerFormula; both compute the same thing. */
  public IdealWeight idealWeight(String operation, double heightCm) throws AxisFault {
    client.getOptions().setAction("urn:" + operation);
    Object[] result =
        client.invokeBlocking(
            new QName(NAMESPACE, operation),
            new Object[] {heightCm},
            new Class<?>[] {IdealWeight.class});
    client.cleanupTransport();
    return (IdealWeight) result[0];
  }

  public OMElement rawResponse(String operation, double heightCm) throws AxisFault {
    client.getOptions().setAction("urn:" + operation);
    OMElement response =
        client.invokeBlocking(new QName(NAMESPACE, operation), new Object[] {heightCm});
    response.build();
    client.cleanupTransport();
    return response;
  }

  public static void main(String[] args) throws Exception {
    String endpoint = args.length > 0 ? args[0] : DEFAULT_ENDPOINT;
    double height = args.length > 1 ? Double.parseDouble(args[1]) : 175;
    IdealWeightClient weights = new IdealWeightClient(endpoint);

    IdealWeight w = weights.idealWeight("idealWeightFormula", height);
    System.out.println("idealWeightFormula(" + height + " cm):");
    System.out.println("  men:   " + w.getMenWeight() + " kg");
    System.out.println("  women: " + w.getWomenWeight() + " kg");
    System.out.println();
    System.out.println("SOAP response of idealWeightFormula(" + height + "):");
    System.out.println(weights.rawResponse("idealWeightFormula", height));
    System.out.println();
    System.out.println("SOAP response of millerFormula(" + height + "), as in the assignment:");
    System.out.println(weights.rawResponse("millerFormula", height));
  }
}
