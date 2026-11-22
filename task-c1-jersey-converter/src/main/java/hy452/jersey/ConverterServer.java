package hy452.jersey;

import java.net.URI;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

/** Starts the converter service on an embedded Grizzly server. */
public class ConverterServer {

  public static final String DEFAULT_URI = "http://localhost:8080/api/";

  public static HttpServer start(String baseUri) {
    ResourceConfig config = new ResourceConfig(ConverterResource.class);
    return GrizzlyHttpServerFactory.createHttpServer(URI.create(baseUri), config);
  }

  public static void main(String[] args) throws Exception {
    String baseUri = args.length > 0 ? args[0] : DEFAULT_URI;
    HttpServer server = start(baseUri);
    System.out.println("Converter service running at " + baseUri + "converter");
    System.out.println("Try: " + baseUri + "converter/cm_to_inch?value=2.54");
    System.out.println("Press Ctrl+C to stop.");
    Runtime.getRuntime().addShutdownHook(new Thread(server::shutdownNow));
    Thread.currentThread().join();
  }
}
