package hy452.spotlight;

import hy452.spotlight.Annotator.Resource;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * The page (static/index.html) posts the user's text here. The server calls Spotlight, so the
 * browser never needs to reach Spotlight directly.
 */
@RestController
public class AnnotateController {

  static final int MAX_TEXT_LENGTH = 10_000;

  private final SpotlightClient spotlight;

  public AnnotateController(SpotlightClient spotlight) {
    this.spotlight = spotlight;
  }

  public record AnnotateRequest(String text, Double confidence) {}

  public record AnnotateResponse(String html, List<Resource> resources) {}

  @PostMapping("/api/annotate")
  public AnnotateResponse annotate(@RequestBody AnnotateRequest request) {
    String text = request.text();
    if (text == null || text.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter some text to annotate");
    }
    if (text.length() > MAX_TEXT_LENGTH) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Text is longer than " + MAX_TEXT_LENGTH + " characters");
    }
    double confidence = request.confidence() == null ? 0.5 : request.confidence();
    if (!(confidence >= 0 && confidence <= 1)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Confidence must be between 0 and 1");
    }

    List<Resource> resources;
    try {
      resources = Annotator.resources(spotlight.annotate(text, confidence));
    } catch (RestClientException e) {
      throw new ResponseStatusException(
          HttpStatus.BAD_GATEWAY, "DBpedia Spotlight did not answer: " + e.getMessage());
    }
    return new AnnotateResponse(Annotator.toHtml(text, resources), resources);
  }
}
