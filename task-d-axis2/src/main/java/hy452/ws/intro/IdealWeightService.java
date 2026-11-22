package hy452.ws.intro;

/**
 * ws2: ideal body weight from height, using the Miller formula.
 *
 * <pre>
 * Men:   56.2 kg + 1.41 kg per inch over 5 feet
 * Women: 53.1 kg + 1.36 kg per inch over 5 feet
 * </pre>
 *
 * Heights under 5 feet use the same straight line, so they come out below the base weight.
 */
public class IdealWeightService {

  /**
   * Inches per centimetre as the assignment's example uses it. With 0.3937, 175 cm gives exactly
   * the example's 68.745475 and 65.2006 kg. The exact factor (1 / 2.54) would give 68.745669 and
   * 65.200787.
   */
  static final double INCH_PER_CM = 0.3937;

  static final double FIVE_FEET_IN_INCHES = 60;

  /** The operation the assignment names. */
  public IdealWeight idealWeightFormula(double heightCm) {
    if (!(heightCm > 0) || Double.isInfinite(heightCm)) {
      throw new IllegalArgumentException("Height must be a positive number of cm");
    }
    double inchesOverFiveFeet = heightCm * INCH_PER_CM - FIVE_FEET_IN_INCHES;
    double men = 56.2 + 1.41 * inchesOverFiveFeet;
    double women = 53.1 + 1.36 * inchesOverFiveFeet;
    return new IdealWeight(round(men), round(women));
  }

  /**
   * The same calculation under the name the assignment's example response uses
   * (millerFormulaResponse), so that example can be reproduced exactly.
   */
  public IdealWeight millerFormula(double heightCm) {
    return idealWeightFormula(heightCm);
  }

  /** Six decimal places, like the example response. */
  static double round(double value) {
    return Math.round(value * 1e6) / 1e6;
  }
}
