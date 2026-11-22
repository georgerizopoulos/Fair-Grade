package hy452.spotlight;

import com.fasterxml.jackson.databind.JsonNode;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** Calls the DBpedia Spotlight REST API: POST /annotate with form fields text and confidence. */
@Component
public class SpotlightClient {

  private final RestClient http;
  private final String url;

  public SpotlightClient(RestClient.Builder builder, @Value("${spotlight.url}") String url) {
    SimpleClientHttpRequestFactory timeouts = new SimpleClientHttpRequestFactory();
    timeouts.setConnectTimeout(Duration.ofSeconds(10));
    timeouts.setReadTimeout(Duration.ofSeconds(30));
    this.http = builder.requestFactory(timeouts).build();
    this.url = url;
  }

  /** Spotlight's JSON answer, for example {"@text": ..., "Resources": [...]}. */
  public JsonNode annotate(String text, double confidence) {
    MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
    form.add("text", text);
    form.add("confidence", Double.toString(confidence));
    return http.post()
        .uri(url)
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .accept(MediaType.APPLICATION_JSON)
        .body(form)
        .retrieve()
        .body(JsonNode.class);
  }
}
