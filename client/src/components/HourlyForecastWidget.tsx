import { useState, useEffect } from "react";
import { format, parse, parseISO} from "date-fns";
import "./HourlyForecastWidget.css";  
import { useUnit } from "../context/TemperatureContext";
import { fetchForecastData } from '../utils/api';

const iconBaseUrl = "https://openweathermap.org/img/wn/";

type MyProps = {
  latitude?: number;
  longitude?: number;
  selectedDay: string;
};

type HourlyData = {
  list: WeatherDataProps[];
  city: {
    timezone: number; 
  }
}

type WeatherDataProps = {
  weather: {
      icon: string;
      main: string;
      description:string;
  }[];
  sys : {
      country: string;
  };
  main: {
      humidity: number;
      temp: number;
      feels_like: number;
  };
  wind: {
      speed: number;
  };
  name: string;
  timezone: number;
  dt: number;
}

const HourlyForecastWidget: React.FC<MyProps> = ({
  latitude = 51.5074,
  longitude = -0.1278,
  selectedDay,
}) => {
  const [hourlyData, setHourlyData] = useState<HourlyData>();
  const [isCurrentHour, setIsCurrentHour] = useState<boolean>(false);
  const { isCelsius } = useUnit();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchForecastData(
            latitude,
            longitude,
            isCelsius
        );
        setHourlyData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [latitude, longitude, isCelsius]);

  if (!hourlyData) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  // Filter forecast data for the selected day
  const selectedDayData = hourlyData.list
    .filter((forecast: WeatherDataProps) => {
      const localTime = new Date(
        forecast.dt * 1000 + hourlyData.city.timezone * 1000
      );
      const localDay = format(localTime, "MM/dd/yyyy");
        return localDay === selectedDay
    });
    
    // Format the selected day for further use
    const formattedSelectedDay = format(
      parse(selectedDay, 
        "MM/dd/yyyy", 
        new Date()
      ),
      "yyyy-MM-dd'T'HH:mm:ss.SSSX");

    // Parse the formatted selected day into a Date object
    const parsedSelectedDay = parseISO(formattedSelectedDay);

  return (
    <div className="hourly-forecast-widget">
        <div className="forecast-day">
          <p>
            Hourly Forecast for{" "}
            {format(parsedSelectedDay, "eeee")}
          </p>
        </div>
        <div className="hourly-data">
          {/* Map over the hourly forecast data for the selected day */}
          {selectedDayData.map(
            (forecast:WeatherDataProps , index: number) => {
              const localTime = new Date(forecast.dt * 1000 + hourlyData.city.timezone * 1000);
              let currentHour = "Now";
              if (!isCurrentHour) {
                setIsCurrentHour(true);
              } else {
                currentHour = format(localTime, "h:mm a");
              }
              return (
                <div key={index}>
                  <p>{currentHour}</p>
                  <img
                    className="weather-icon"
                    src={iconBaseUrl + forecast.weather[0].icon + "@2x.png"}
                    alt={forecast.weather[0].description}
                  />
                  <p>
                    {isCelsius 
                      ? `${Math.round(forecast.main.temp)} °C`
                      : `${Math.round(forecast.main.temp)} °F`
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
    </div>
  );
};

export default HourlyForecastWidget;
