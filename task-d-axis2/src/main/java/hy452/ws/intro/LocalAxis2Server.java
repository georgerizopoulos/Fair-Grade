package hy452.ws.intro;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.axis2.transport.http.SimpleHTTPServer;

/**
 * Runs both services on Axis2's built-in HTTP server, for trying them without Tomcat.
 *
 * <p>It builds a throwaway Axis2 repository with the compiled classes and META-INF/services.xml
 * as an exploded service (the same content as hy452ws.aar), then serves it at
 * http://localhost:PORT/axis2/services/. For the assignment's Tomcat setup, deploy
 * target/hy452ws.aar instead (see the README).
 *
 * <p>Usage: {@code mvn -q compile exec:java [-Dexec.args=8080]}
 */
public class LocalAxis2Server {

  private final SimpleHTTPServer server;
  private final int port;

  public LocalAxis2Server(int port) throws Exception {
    this.port = port;
    Path repository = buildRepository();
    ConfigurationContext context =
        ConfigurationContextFactory.createConfigurationContextFromFileSystem(
            repository.toString(), null);
    // The services' URLs are http://localhost:PORT/axis2/services/<name>, as on Tomcat.
    context.setContextRoot("axis2");
    this.server = new SimpleHTTPServer(context, port);
  }

  public void start() throws Exception {
    server.start();
  }

  public void stop() {
    server.stop();
  }

  public String serviceUrl(String serviceName) {
    return "http://localhost:" + port + "/axis2/services/" + serviceName;
  }

  /** A repository with services/hy452ws/ holding this module's classes and services.xml. */
  static Path buildRepository() throws IOException, URISyntaxException {
    Path classes =
        Path.of(ConverterService.class.getProtectionDomain().getCodeSource().getLocation().toURI());
    if (!Files.isDirectory(classes)) {
      throw new IllegalStateException("Run from the compiled classes directory, not a jar");
    }
    Path repository = Files.createTempDirectory("axis2-repo");
    Path service = repository.resolve("services").resolve("hy452ws");
    try (Stream<Path> files = Files.walk(classes)) {
      for (Path source : (Iterable<Path>) files::iterator) {
        Path target = service.resolve(classes.relativize(source).toString());
        if (Files.isDirectory(source)) {
          Files.createDirectories(target);
        } else {
          Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
        }
      }
    }
    return repository;
  }

  public static void main(String[] args) throws Exception {
    int port = args.length > 0 ? Integer.parseInt(args[0]) : 8080;
    LocalAxis2Server server = new LocalAxis2Server(port);
    server.start();
    System.out.println("Axis2 is serving:");
    System.out.println("  " + server.serviceUrl("ConverterService") + "?wsdl");
    System.out.println("  " + server.serviceUrl("IdealWeightService") + "?wsdl");
    System.out.println("Press Ctrl+C to stop.");
    Runtime.getRuntime().addShutdownHook(new Thread(server::stop));
    Thread.currentThread().join();
  }
}
