package hy452.ws.intro;

import javax.xml.namespace.QName;
import org.apache.axiom.om.OMElement;
import org.apache.axis2.AxisFault;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.rpc.client.RPCServiceClient;

/**
 * Client for ws1 (ConverterService). Prints the SOAP response body and the value it holds.
 *
 * <p>Usage: {@code java hy452.ws.intro.ConverterClient [endpoint]}. The endpoint defaults to
 * Tomcat's http://localhost:8080/axis2/services/ConverterService.
 */
public class ConverterClient {

  static final String NAMESPACE = "http://intro.ws.hy452";
  static final String DEFAULT_ENDPOINT = "http://localhost:8080/axis2/services/ConverterService";

  private final RPCServiceClient client;

  public ConverterClient(String endpoint) throws AxisFault {
    client = new RPCServiceClient();
    Options options = client.getOptions();
    options.setTo(new EndpointReference(endpoint));
    options.setTimeOutInMilliSeconds(30_000);
  }

  public double inchToCm(double inch) throws AxisFault {
    return call("inch_to_cm", inch);
  }

  public double cmToInch(double cm) throws AxisFault {
    return call("cm_to_inch", cm);
  }

  /** The SOAP body Axis2 returns for the operation, for printing in the report. */
  public OMElement rawResponse(String operation, double value) throws AxisFault {
    client.getOptions().setAction("urn:" + operation);
    OMElement response =
        client.invokeBlocking(new QName(NAMESPACE, operation), new Object[] {value});
    response.build();
    client.cleanupTransport();
    return response;
  }

  private double call(String operation, double value) throws AxisFault {
    client.getOptions().setAction("urn:" + operation);
    Object[] result =
        client.invokeBlocking(
            new QName(NAMESPACE, operation), new Object[] {value}, new Class<?>[] {Double.class});
    client.cleanupTransport();
    return (Double) result[0];
  }

  public static void main(String[] args) throws Exception {
    ConverterClient converter = new ConverterClient(args.length > 0 ? args[0] : DEFAULT_ENDPOINT);
    System.out.println("inch_to_cm(10)   = " + converter.inchToCm(10) + " cm");
    System.out.println("cm_to_inch(175)  = " + converter.cmToInch(175) + " inch");
    System.out.println("cm_to_inch(2.54) = " + converter.cmToInch(2.54) + " inch");
    System.out.println();
    System.out.println("SOAP response of inch_to_cm(10):");
    System.out.println(converter.rawResponse("inch_to_cm", 10));
  }
}
