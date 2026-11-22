package hy452.ws.intro;

/**
 * ws1: a POJO Axis2 service. Each public method becomes a SOAP operation of the same name. The
 * package hy452.ws.intro gives the namespace http://intro.ws.hy452.
 */
public class ConverterService {

  /** Exactly 2.54 cm in an inch, by definition. */
  public static final double CM_PER_INCH = 2.54;

  public double inch_to_cm(double inch) {
    return round(inch * CM_PER_INCH);
  }

  public double cm_to_inch(double cm) {
    return round(cm / CM_PER_INCH);
  }

  /** Six decimal places hide floating-point noise. */
  static double round(double value) {
    return Math.round(value * 1e6) / 1e6;
  }
}
