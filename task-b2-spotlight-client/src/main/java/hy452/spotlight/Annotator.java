package hy452.spotlight;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.web.util.HtmlUtils;

/** Turns the user's text plus Spotlight's resources into HTML with a link for every term. */
public final class Annotator {

  private Annotator() {}

  /** One term Spotlight found: where it starts in the text, the words, and its DBpedia URI. */
  public record Resource(int offset, String surfaceForm, String uri) {}

  /** Reads the "Resources" list from Spotlight's JSON. Missing means no terms were found. */
  public static List<Resource> resources(JsonNode spotlightJson) {
    List<Resource> result = new ArrayList<>();
    JsonNode resources = spotlightJson == null ? null : spotlightJson.get("Resources");
    if (resources == null || resources.isNull()) {
      return result;
    }
    // Older Spotlight versions return a single object instead of a one-item array.
    Iterable<JsonNode> items = resources.isArray() ? resources : List.of(resources);
    for (JsonNode r : items) {
      String uri = r.path("@URI").asText("");
      String surface = r.path("@surfaceForm").asText("");
      int offset = r.path("@offset").asInt(-1);
      if (!uri.isEmpty() && !surface.isEmpty() && offset >= 0) {
        result.add(new Resource(offset, surface, uri));
      }
    }
    return result;
  }

  /**
   * The text as HTML, with each found term wrapped in a link to its DBpedia page. All text is
   * HTML-escaped. A term is skipped when its offset does not match the text or when it overlaps
   * an earlier term.
   */
  public static String toHtml(String text, List<Resource> resources) {
    List<Resource> sorted = new ArrayList<>(resources);
    sorted.sort(Comparator.comparingInt(Resource::offset));
    StringBuilder html = new StringBuilder();
    int position = 0;
    for (Resource r : sorted) {
      int start = r.offset();
      int end = start + r.surfaceForm().length();
      if (start < position || end > text.length() || !text.startsWith(r.surfaceForm(), start)) {
        continue;
      }
      if (!r.uri().startsWith("http://") && !r.uri().startsWith("https://")) {
        continue;
      }
      html.append(HtmlUtils.htmlEscape(text.substring(position, start)));
      html.append("<a href=\"")
          .append(HtmlUtils.htmlEscape(r.uri()))
          .append("\" target=\"_blank\" rel=\"noopener\">")
          .append(HtmlUtils.htmlEscape(r.surfaceForm()))
          .append("</a>");
      position = end;
    }
    html.append(HtmlUtils.htmlEscape(text.substring(position)));
    return html.toString();
  }
}
