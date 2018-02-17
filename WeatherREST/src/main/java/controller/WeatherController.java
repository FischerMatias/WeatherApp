package controller;
import service.WeatherService;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.xml.bind.JAXBException;
import java.io.IOException;

@RequestMapping("/api/weather")
@RestController
public class WeatherController {
    private static final Logger LOGGER = LoggerFactory.getLogger(WeatherController.class);


    @RequestMapping("/greeting")
    String greet() {
        return "Hola!";
    }

    @RequestMapping("/currentweather")
    public String Weather(@RequestParam(value= "location") String location) throws JAXBException, IOException {
       return new Gson().toJson(new WeatherService().GetCurrentWeatherForLocation(location));
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public void handleConnectionError(Exception ex) { //TODO: Custom Exceptions
        LOGGER.error("Handling error with message: {}", ex.getMessage());
    }
}
