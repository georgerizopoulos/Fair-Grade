package hy452.ws.intro;

/**
 * The response of ws2: ideal weight in kg for men and for women. Axis2 serialises it as the
 * complex type ax21:IdealWeight in namespace http://intro.ws.hy452/xsd.
 */
public class IdealWeight {

  private double menWeight;
  private double womenWeight;

  public IdealWeight() {}

  public IdealWeight(double menWeight, double womenWeight) {
    this.menWeight = menWeight;
    this.womenWeight = womenWeight;
  }

  public double getMenWeight() {
    return menWeight;
  }

  public void setMenWeight(double menWeight) {
    this.menWeight = menWeight;
  }

  public double getWomenWeight() {
    return womenWeight;
  }

  public void setWomenWeight(double womenWeight) {
    this.womenWeight = womenWeight;
  }

  @Override
  public String toString() {
    return "menWeight=" + menWeight + " kg, womenWeight=" + womenWeight + " kg";
  }
}
