package service;

import com.github.fedy2.weather.YahooWeatherService;
import com.github.fedy2.weather.data.Channel;
import com.github.fedy2.weather.data.Condition;
import com.github.fedy2.weather.data.unit.DegreeUnit;

import javax.xml.bind.JAXBException;
import java.io.IOException;

/**
 * Created by Matias Fischer on 30/06/2017.
 */
public class WeatherService {
    private YahooWeatherService service;

    public YahooWeatherService getService() {
        return service;
    }

    public WeatherService(YahooWeatherService service) {
        this.service = service;
    }

    public WeatherService() throws JAXBException {
        service = new YahooWeatherService();
    }

    public Condition GetCurrentWeatherForLocation(String location) throws JAXBException, IOException {
        YahooWeatherService.LimitDeclaration limit = service.getForecastForLocation(location, DegreeUnit.CELSIUS);

        Channel channel = limit.last(1).get(0);

         return channel
                 .getItem()
                 .getCondition();
    }
}
