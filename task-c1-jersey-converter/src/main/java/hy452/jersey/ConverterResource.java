package hy452.jersey;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

/**
 * Task C.i: converts centimetres to inches and back.
 *
 * <pre>
 * GET /api/converter/cm_to_inch?value=2.54   -> 1.0
 * GET /api/converter/inch_to_cm?value=1      -> 2.54
 * </pre>
 *
 * The answer is plain text by default. Send "Accept: application/json" or "Accept:
 * application/xml" to get it in those formats.
 */
@Path("converter")
public class ConverterResource {

  /** Exactly 2.54 cm in an inch, by definition. */
  static final double CM_PER_INCH = 2.54;

  @GET
  @Path("inch_to_cm")
  @Produces(MediaType.TEXT_PLAIN)
  public String inch_to_cm(@QueryParam("value") String value) {
    return Double.toString(round(parse(value) * CM_PER_INCH));
  }

  @GET
  @Path("cm_to_inch")
  @Produces(MediaType.TEXT_PLAIN)
  public String cm_to_inch(@QueryParam("value") String value) {
    return Double.toString(round(parse(value) / CM_PER_INCH));
  }

  @GET
  @Path("inch_to_cm")
  @Produces(MediaType.APPLICATION_JSON)
  public String inch_to_cm_json(@QueryParam("value") String value) {
    double inches = parse(value);
    return json("inch", inches, "cm", round(inches * CM_PER_INCH));
  }

  @GET
  @Path("cm_to_inch")
  @Produces(MediaType.APPLICATION_JSON)
  public String cm_to_inch_json(@QueryParam("value") String value) {
    double cm = parse(value);
    return json("cm", cm, "inch", round(cm / CM_PER_INCH));
  }

  @GET
  @Path("inch_to_cm")
  @Produces(MediaType.APPLICATION_XML)
  public String inch_to_cm_xml(@QueryParam("value") String value) {
    double inches = parse(value);
    return xml("inch_to_cm", "inch", inches, "cm", round(inches * CM_PER_INCH));
  }

  @GET
  @Path("cm_to_inch")
  @Produces(MediaType.APPLICATION_XML)
  public String cm_to_inch_xml(@QueryParam("value") String value) {
    double cm = parse(value);
    return xml("cm_to_inch", "cm", cm, "inch", round(cm / CM_PER_INCH));
  }

  /** A finite number, or 400 Bad Request with the reason. */
  static double parse(String value) {
    if (value == null || value.isBlank()) {
      throw badRequest("Missing query parameter: value");
    }
    double number;
    try {
      number = Double.parseDouble(value.trim());
    } catch (NumberFormatException e) {
      throw badRequest("Not a number: " + value);
    }
    if (Double.isNaN(number) || Double.isInfinite(number)) {
      throw badRequest("Not a finite number: " + value);
    }
    return number;
  }

  /** Six decimal places hide floating-point noise such as 0.39370078740157477. */
  static double round(double value) {
    return Math.round(value * 1e6) / 1e6;
  }

  private static BadRequestException badRequest(String message) {
    return new BadRequestException(
        jakarta.ws.rs.core.Response.status(400)
            .type(MediaType.TEXT_PLAIN)
            .entity(message)
            .build());
  }

  private static String json(String inKey, double in, String outKey, double out) {
    return "{\"" + inKey + "\":" + in + ",\"" + outKey + "\":" + out + "}";
  }

  private static String xml(String root, String inKey, double in, String outKey, double out) {
    return "<" + root + "><" + inKey + ">" + in + "</" + inKey + "><" + outKey + ">" + out
        + "</" + outKey + "></" + root + ">";
  }
}
