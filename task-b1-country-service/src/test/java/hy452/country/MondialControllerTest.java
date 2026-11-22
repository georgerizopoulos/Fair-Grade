package hy452.country;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class MondialControllerTest {

  @Autowired MockMvc mvc;

  @Test
  void countryOperations() throws Exception {
    mvc.perform(get("/countries/GR/country_name"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.country_name").value("Greece"));
    mvc.perform(get("/countries/gr/country_population"))
        .andExpect(jsonPath("$.code").value("GR"))
        .andExpect(jsonPath("$.country_population").value(10538594));
    mvc.perform(get("/countries/GR/country_total_area"))
        .andExpect(jsonPath("$.country_total_area").value(131940));
    mvc.perform(get("/countries/GR/country_capital_name"))
        .andExpect(jsonPath("$.country_capital_name").value("Athens"));
    mvc.perform(get("/countries/GR/country_political_system"))
        .andExpect(jsonPath("$.country_political_system").value("parliamentary republic"));
  }

  @Test
  void capitalInsideAProvince() throws Exception {
    // Austria's capital sits inside a province element, not directly under the country.
    mvc.perform(get("/countries/AU/country_capital_name"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.country_capital_name").value("Vienna"));
  }

  @Test
  void riverOperations() throws Exception {
    mvc.perform(get("/rivers/Nile/river_passes_through_countries"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.river_passes_through_countries.length()").value(2));
    mvc.perform(get("/rivers/nile/river_outfall"))
        .andExpect(jsonPath("$.river").value("Nile"))
        .andExpect(jsonPath("$.river_outfall[0].type").value("sea"))
        .andExpect(jsonPath("$.river_outfall[0].name").value("Mediterranean Sea"));
    mvc.perform(get("/rivers/Rhein/river_outfall"))
        .andExpect(jsonPath("$.river_outfall.length()").value(2));
    mvc.perform(get("/rivers/Thames/river_passes_through_countries"))
        .andExpect(jsonPath("$.river_passes_through_countries.length()").value(0));
  }

  @Test
  void unknownOrInvalidInputIs404() throws Exception {
    mvc.perform(get("/countries/ZZ/country_name")).andExpect(status().isNotFound());
    mvc.perform(get("/countries/G'R/country_name")).andExpect(status().isNotFound());
    mvc.perform(get("/countries/GRC/country_name")).andExpect(status().isNotFound());
    mvc.perform(get("/rivers/NoSuchRiver/river_outfall")).andExpect(status().isNotFound());
  }

  @Test
  void openApiDocumentIsServed() throws Exception {
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.openapi").exists())
        .andExpect(jsonPath("$.paths['/countries/{code}/country_name']").exists());
  }
}
