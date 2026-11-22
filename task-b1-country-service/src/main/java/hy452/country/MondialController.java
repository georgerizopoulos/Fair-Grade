package hy452.country;

import hy452.country.MondialRepository.Outfall;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.w3c.dom.Element;

/** The seven operations of task B.i. Every answer is a small JSON object. */
@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class MondialController {

  private final MondialRepository mondial;

  public MondialController(MondialRepository mondial) {
    this.mondial = mondial;
  }

  // ----- Countries -----

  @Tag(name = "Countries")
  @Operation(summary = "Country name", description = "Name of the country with this code.")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"code\":\"GR\",\"country_name\":\"Greece\"}")))
  @ApiResponse(responseCode = "404", description = "No country has this code")
  @GetMapping("/countries/{code}/country_name")
  public Map<String, Object> countryName(@PathVariable @Parameter(example = "GR") String code) {
    return countryAnswer(code, "country_name", country(code).getAttribute("name"));
  }

  @Tag(name = "Countries")
  @Operation(summary = "Country population", description = "Population of the country.")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"code\":\"GR\",\"country_population\":10538594}")))
  @ApiResponse(responseCode = "404", description = "No country has this code")
  @GetMapping("/countries/{code}/country_population")
  public Map<String, Object> countryPopulation(
      @PathVariable @Parameter(example = "GR") String code) {
    return countryAnswer(code, "country_population", number(country(code), "population"));
  }

  @Tag(name = "Countries")
  @Operation(summary = "Country total area", description = "Total area of the country in km².")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"code\":\"GR\",\"country_total_area\":131940}")))
  @ApiResponse(responseCode = "404", description = "No country has this code")
  @GetMapping("/countries/{code}/country_total_area")
  public Map<String, Object> countryTotalArea(
      @PathVariable @Parameter(example = "GR") String code) {
    return countryAnswer(code, "country_total_area", number(country(code), "total_area"));
  }

  @Tag(name = "Countries")
  @Operation(summary = "Capital name", description = "Name of the country's capital city.")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"code\":\"GR\",\"country_capital_name\":\"Athens\"}")))
  @ApiResponse(responseCode = "404", description = "No country has this code, or the dataset"
      + " has no capital for it")
  @GetMapping("/countries/{code}/country_capital_name")
  public Map<String, Object> countryCapitalName(
      @PathVariable @Parameter(example = "GR") String code) {
    String capital =
        mondial
            .capitalName(country(code))
            .orElseThrow(() -> notFound("The dataset has no capital for country " + code));
    return countryAnswer(code, "country_capital_name", capital);
  }

  @Tag(name = "Countries")
  @Operation(
      summary = "Political system",
      description = "The country's government type, from its government attribute.")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"code\":\"GR\",\"country_political_system\":\"parliamentary republic\"}")))
  @ApiResponse(responseCode = "404", description = "No country has this code")
  @GetMapping("/countries/{code}/country_political_system")
  public Map<String, Object> countryPoliticalSystem(
      @PathVariable @Parameter(example = "GR") String code) {
    // Some values in the dataset have stray leading spaces.
    String government = country(code).getAttribute("government").trim();
    return countryAnswer(code, "country_political_system", government);
  }

  // ----- Rivers -----

  @Tag(name = "Rivers")
  @Operation(
      summary = "Countries a river passes through",
      description =
          "Countries the river flows through. The list is empty when the dataset gives no"
              + " countries for the river (59 of its 135 rivers, for example the Thames).")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"river\":\"Nile\",\"river_passes_through_countries\":[\"Egypt\",\"Sudan\"]}")))
  @ApiResponse(responseCode = "404", description = "No river has this name")
  @GetMapping("/rivers/{name}/river_passes_through_countries")
  public Map<String, Object> riverPassesThroughCountries(
      @PathVariable @Parameter(example = "Nile") String name) {
    Element river = river(name);
    List<String> countries = mondial.riverCountries(river);
    return answer("river", river.getAttribute("name"), "river_passes_through_countries", countries);
  }

  @Tag(name = "Rivers")
  @Operation(
      summary = "River outfall",
      description =
          "Where the river ends: the name and type (sea, river or lake) of the water it flows"
              + " into. A list, because one river in the dataset (Rhein) has two outfalls.")
  @ApiResponse(responseCode = "200", content = @Content(examples = @ExampleObject(
      "{\"river\":\"Nile\",\"river_outfall\":[{\"type\":\"sea\","
          + "\"name\":\"Mediterranean Sea\"}]}")))
  @ApiResponse(responseCode = "404", description = "No river has this name")
  @GetMapping("/rivers/{name}/river_outfall")
  public Map<String, Object> riverOutfall(@PathVariable @Parameter(example = "Nile") String name) {
    Element river = river(name);
    List<Outfall> outfalls = mondial.riverOutfalls(river);
    return answer("river", river.getAttribute("name"), "river_outfall", outfalls);
  }

  // ----- Helpers -----

  private Element country(String code) {
    return mondial.country(code).orElseThrow(() -> notFound("No country has code " + code));
  }

  private Element river(String name) {
    return mondial.river(name).orElseThrow(() -> notFound("No river is named " + name));
  }

  private Map<String, Object> countryAnswer(String code, String key, Object value) {
    return answer("code", code.toUpperCase(java.util.Locale.ROOT), key, value);
  }

  private static Map<String, Object> answer(String idKey, Object id, String key, Object value) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put(idKey, id);
    body.put(key, value);
    return body;
  }

  /** The attribute as a number, keeping decimals only when the dataset has them. */
  private static Number number(Element element, String attribute) {
    String value = element.getAttribute(attribute);
    if (value.isEmpty()) {
      throw notFound("The dataset has no " + attribute + " for this country");
    }
    if (value.matches("\\d+")) {
      return Long.parseLong(value);
    }
    return Double.parseDouble(value);
  }

  private static ResponseStatusException notFound(String message) {
    return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
  }
}
