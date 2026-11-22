package hy452.country;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info =
        @Info(
            title = "Mondial Country and River Service",
            version = "1.0",
            description =
                "CS452 Assignment 2, task B.i. Answers questions about countries (by two-letter"
                    + " code) and rivers (by name) from the Mondial 3.0 XML dataset."))
public class CountryServiceApplication {
  public static void main(String[] args) {
    SpringApplication.run(CountryServiceApplication.class, args);
  }
}
