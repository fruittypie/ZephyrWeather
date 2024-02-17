import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import "./ForecastDailyWidget.css";
import { useUnit } from "../context/TemperatureContext";
import { fetchForecastData } from '../utils/api';

const iconBaseUrl = "https://openweathermap.org/img/wn/";

type WidgetProps = {
    latitude?: number;
    longitude?: number;
    onDayClick: (day: string) => void;
};

type WeatherDataProps = {
    weather: {
        icon: string;
        main: string;
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
    localTime: Date;
    dt: number;
}
type DailyData = {
    list: WeatherDataProps[];
    city: {
      timezone: number; 
    }
}


const ForecastDailyWidget: React.FC<WidgetProps> = ({ 
    latitude = 51.5074, 
    longitude = -0.1278, 
    onDayClick,
}) => { 
    const [forecastData, setForecastData] = useState<DailyData>(); 
    const { isCelsius } = useUnit();

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@2x.png`;
    };

    //  Calculate the local time and create a Date object
    const getDate = ( utcDt:number, timezoneOffset: number) => {
        const utcOffset = (utcDt + timezoneOffset);
        return new Date(utcOffset * 1000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchForecastData(
                    latitude,
                    longitude,
                    isCelsius
                );
                if (data.list.length) { 
                    // Extracting data for the current day
                    const currentDay = data.list[0];
                    const localTime = getDate(currentDay.dt, data.city.timezone);
                    const localDay = format(localTime, "MM/dd/yyyy");
                    setForecastData(data);
                    onDayClick(localDay);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [latitude, longitude, isCelsius]);

    if (!forecastData) {
        return (
            <div> 
                <p>Loading</p>
            </div>
        );
    }
    // The city's time zone offset
    const cityTimezoneOffset = forecastData.city.timezone;

    // Empty object to store all temps by day
    const allTemperatures: { [day:string]: {min: number; max:number} } = {}

    // Store temperatures in the object by local time
    forecastData.list.forEach((forecast: WeatherDataProps) => {
        const localTime = getDate(forecast.dt, cityTimezoneOffset);
        forecast.localTime = localTime;
        const localDay = format(localTime, "MM/dd/yyyy");
        const temperature = forecast.main.temp;

         if(!allTemperatures[localDay]) {
             allTemperatures[localDay] = {min: temperature, max: temperature};
         } else {
             if (temperature < allTemperatures[localDay].min) {
                 allTemperatures[localDay].min = temperature;
             } else if (temperature > allTemperatures[localDay].max) {
                 allTemperatures[localDay].max = temperature;
             }
         }
     }); 

    return (
        <div className="forecast-widget">
            <div className="day-sign">
                 <p>5 day forecast</p>
             </div>
             <div className="daily-data">
                {Object.entries(allTemperatures).map(([key, value], index: number) => {
                    // Parse the date and get the day of the week
                    const parsedDate = parse(key, "MM/dd/yyyy", new Date());
                    const dayOfWeek = format(parsedDate, "EEEE");
                    // Find the forecast item for the current day
                    const forecastItem = forecastData.list.find((item: WeatherDataProps) =>
                        item.localTime.getDate() === parsedDate.getDate()
                    );

                    return <div key={index} onClick={() => onDayClick(key)} className="day">
                        <div className="forecast-temperature">
                        {isCelsius
                            ? `${Math.round(value.min)}°C / ${Math.round(value.max)}°C`
                            : `${Math.round(value.min)}°F / ${Math.round(value.max)}°F`
                        }
                        </div>
                        {forecastItem && (
                        <img
                            className="weather-icon"
                            src={getWeatherIconUrl(forecastItem.weather[0].icon)}
                            alt={`Weather icon for ${dayOfWeek}`}
                        />
                        )}
                        <p>
                            {dayOfWeek}
                        </p>
                </div>          
                })}
            </div>
        </div>
    );   
};

export default ForecastDailyWidget;