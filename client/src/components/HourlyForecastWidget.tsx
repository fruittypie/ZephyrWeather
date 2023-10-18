import { useState, useEffect } from "react";
import axios from "axios";
import { format, parseISO, } from "date-fns";

const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";

type MyProps = {
    latitude?: number;
    longitude?: number;
    selectedDay: string;
};

type ForecastData = {
    dt_txt: string;
    timezone: number; 
}

const localTimeZone = (forecast: ForecastData) => {
    const utcDate = parseISO(forecast.dt_txt);
    const localTimestamp = utcDate.getTime() + forecast.timezone * 1000; // Convert offset to milliseconds
    const localDate = new Date(localTimestamp);
    return localDate;
  };
  

const HourlyForecastWidget: React.FC<MyProps> = ({
    latitude = 51.5074,
    longitude = -0.1278,
    selectedDay}) => {
        const [hourlyData, setHourlyData] = useState<any>();

    useEffect (() => {
        const FetchForecastData = async() => {
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
    const selectedDayData = hourlyData.list.filter((forecast: ForecastData) => 
        forecast.dt_txt.includes((selectedDay)));

    const correctedTime = selectedDayData.map((forecast: ForecastData) => {
        const localTime = localTimeZone(forecast);
        return{...forecast, localTime};
    });

    return (
        <div className="hourly-forecast-widget">
          <p>Hourly Forecast for {format(parseISO(selectedDay), "eeee")}</p>
          {correctedTime.map((forecast: any, index: number) => (
            <div key={index}>
              <p>{format(forecast.localTime, "h:mm a")}</p>
              <img
                className="weather-icon"
                src={iconBaseUrl + forecast.weather[0].icon + "@2x.png"}
                alt={forecast.weather[0].description}
              />
              <p>{Math.round(forecast.main.temp)}°C</p>
            </div>
          ))}
        </div>
    ); 
};


export default HourlyForecastWidget;
