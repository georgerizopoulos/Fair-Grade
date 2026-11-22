package hy452.spotlight;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.ResourceAccessException;

@SpringBootTest
@AutoConfigureMockMvc
class AnnotateControllerTest {

  @Autowired MockMvc mvc;
  @MockitoBean SpotlightClient spotlight;

  @Test
  void annotatesText() throws Exception {
    when(spotlight.annotate(anyString(), anyDouble()))
        .thenReturn(new ObjectMapper().readTree(AnnotatorTest.SPOTLIGHT_JSON));
    mvc.perform(
            post("/api/annotate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"" + AnnotatorTest.TEXT + "\",\"confidence\":0.5}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.resources.length()").value(2))
        .andExpect(jsonPath("$.html", Matchers.containsString("Mona_Lisa")));
  }

  @Test
  void rejectsEmptyTextAndBadConfidence() throws Exception {
    mvc.perform(
            post("/api/annotate").contentType(MediaType.APPLICATION_JSON).content("{\"text\":\" \"}"))
        .andExpect(status().isBadRequest());
    mvc.perform(
            post("/api/annotate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Crete\",\"confidence\":7}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void spotlightDownIs502() throws Exception {
    when(spotlight.annotate(anyString(), anyDouble()))
        .thenThrow(new ResourceAccessException("Connection reset"));
    mvc.perform(
            post("/api/annotate")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"Crete\"}"))
        .andExpect(status().isBadGateway());
  }

  @Test
  void servesThePage() throws Exception {
    mvc.perform(get("/index.html"))
        .andExpect(status().isOk())
        .andExpect(content().string(Matchers.containsString("DBpedia Text Annotator")));
  }
}
