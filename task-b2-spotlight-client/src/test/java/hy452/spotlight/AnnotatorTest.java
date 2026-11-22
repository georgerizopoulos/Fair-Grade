package hy452.spotlight;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hy452.spotlight.Annotator.Resource;
import java.util.List;
import org.junit.jupiter.api.Test;

class AnnotatorTest {

  static final String TEXT = "Leonardo da Vinci created the 'Mona Lisa'";

  /** Shaped like Spotlight's real answer for the assignment's example sentence. */
  static final String SPOTLIGHT_JSON =
      """
      {"@text":"Leonardo da Vinci created the 'Mona Lisa'","@confidence":"0.5",
       "Resources":[
        {"@URI":"http://dbpedia.org/resource/Leonardo_da_Vinci","@surfaceForm":"Leonardo da Vinci",
         "@offset":"0","@similarityScore":"1.0"},
        {"@URI":"http://dbpedia.org/resource/Mona_Lisa","@surfaceForm":"Mona Lisa",
         "@offset":"31","@similarityScore":"1.0"}]}
      """;

  @Test
  void linksTheAssignmentExample() throws Exception {
    JsonNode json = new ObjectMapper().readTree(SPOTLIGHT_JSON);
    String html = Annotator.toHtml(TEXT, Annotator.resources(json));
    assertEquals(
        "<a href=\"http://dbpedia.org/resource/Leonardo_da_Vinci\" target=\"_blank\""
            + " rel=\"noopener\">Leonardo da Vinci</a> created the &#39;"
            + "<a href=\"http://dbpedia.org/resource/Mona_Lisa\" target=\"_blank\""
            + " rel=\"noopener\">Mona Lisa</a>&#39;",
        html);
  }

  @Test
  void noResourcesKeyMeansPlainEscapedText() throws Exception {
    JsonNode json = new ObjectMapper().readTree("{\"@text\":\"a < b\"}");
    assertEquals(List.of(), Annotator.resources(json));
    assertEquals("a &lt; b", Annotator.toHtml("a < b", List.of()));
    assertEquals("", Annotator.toHtml("", List.of()));
  }

  @Test
  void singleObjectInsteadOfArray() throws Exception {
    JsonNode json =
        new ObjectMapper()
            .readTree(
                "{\"Resources\":{\"@URI\":\"http://dbpedia.org/resource/Crete\","
                    + "\"@surfaceForm\":\"Crete\",\"@offset\":\"0\"}}");
    assertEquals(1, Annotator.resources(json).size());
  }

  @Test
  void skipsBadOffsetsOverlapsAndNonHttpLinks() {
    String text = "Crete is in Greece";
    List<Resource> resources =
        List.of(
            new Resource(0, "Crete", "http://dbpedia.org/resource/Crete"),
            new Resource(2, "ete", "http://dbpedia.org/resource/Overlap"),
            new Resource(500, "Greece", "http://dbpedia.org/resource/Greece"),
            new Resource(12, "Greece", "javascript:alert(1)"));
    String html = Annotator.toHtml(text, resources);
    assertEquals(
        "<a href=\"http://dbpedia.org/resource/Crete\" target=\"_blank\" rel=\"noopener\">Crete</a>"
            + " is in Greece",
        html);
    assertTrue(!html.contains("javascript"));
  }
}
