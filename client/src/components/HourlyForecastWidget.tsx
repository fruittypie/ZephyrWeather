import { useState, useEffect } from "react";
import axios from "axios";
import { format, parse, parseISO} from "date-fns";
import "./HourlyForecastWidget.css";  

const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";

type MyProps = {
  latitude?: number;
  longitude?: number;
  selectedDay: string;
};

type ForecastData = {
  dt: number;

};

const HourlyForecastWidget: React.FC<MyProps> = ({
  latitude = 51.5074,
  longitude = -0.1278,
  selectedDay,
}) => {
  const [hourlyData, setHourlyData] = useState<any>();
  const [isCurrentHour, setIsCurrentHour] = useState<boolean>(false);


  useEffect(() => {
    const FetchForecastData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        setHourlyData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    FetchForecastData();
  }, [latitude, longitude]);

  if (!hourlyData) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  // array of forecast data objects for selected day
 const selectedDayData = hourlyData.list
    .filter((forecast: ForecastData) => {
      const localTime = new Date(forecast.dt * 1000 + hourlyData.city.timezone * 1000);
      const localDay = format(localTime, "MM/dd/yyyy");
        return localDay === selectedDay
    });
    //console.log(selectedDayData)
    //console.log("selectedDay:", selectedDay);
    const formattedSelectedDay = format(parse(selectedDay, "MM/dd/yyyy", new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSSX");
    const parsedSelectedDay = parseISO(formattedSelectedDay);

  return (
    <div className="hourly-forecast-widget">
        <div className="forecast-day">
          <p>Hourly Forecast for {format(parsedSelectedDay, "eeee")}</p>
        </div>
        <div className="hourly-data">
      {selectedDayData.map((forecast:any , index: number) => {
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
          <p>{Math.round(forecast.main.temp)}°C</p>
        </div>
        );
        })}
    </div>
    </div>
  );
};

export default HourlyForecastWidget;
