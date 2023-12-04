import { useState, useEffect } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import "./ForecastDailyWidget.css";
//import { format as formatzone } from 'date-fns-tz';



const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";

type WidgetProps = {
    latitude?: number;
    longitude?: number;
    onDayClick: (day: string) => void;
  };

const ForecastDailyWidget: React.FC<WidgetProps> = ({ latitude = 51.5074, longitude =  -0.1278, onDayClick }) => { 
    const [forecastData, setForecastData] = useState<any>(); 

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@2x.png`;
    };

    useEffect(() => {
        // asynchronous function to fetch data
        const fetchForecastData = async () => {
            try {
                const response = await axios.get(
                     `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
                ); 
                setForecastData(response.data);
                //console.log(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchForecastData();
    }, [latitude, longitude]);

    if (!forecastData) {
        return (
            <div> 
                <p>Loading</p>
            </div>
        );
    }
    const cityTimezoneOffset = forecastData.city.timezone;

    const getDate = ( utcDt:number, timezoneOffset: number) => {
        const utcOffset = (utcDt + timezoneOffset);
        return new Date(utcOffset * 1000);
    };


    //empty object to store all temps by day
    const allTemperatures: { [day:string]: {min: number; max:number} } = {}

    forecastData.list.forEach((forecast: any) => {
        const localTime = getDate(forecast.dt, cityTimezoneOffset);
        forecast.localTime = localTime;
        const localDay = format(localTime, "MM/dd/yyyy");
        //.log(localTime)
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
        //console.log(allTemperatures)
     }); 

    return (
        <div className="forecast-widget">
            <div className="day-sign">
                 <p>5 day forecast</p>
             </div>
             <div className="daily-data">
                {Object.entries(allTemperatures).map(([key, value], index: number) => {
                    const parsedDate = parse(key, "MM/dd/yyyy", new Date());
                    const dayOfWeek = format(parsedDate, "EEEE");
                    const forecastItem = forecastData.list.find((item: any) =>
                    item.localTime.getDate() === parsedDate.getDate()
                    );                   
                    return <div key={index} onClick={() => onDayClick(key)} className="day">
                        <div className="forecast-temperature">
                            {Math.round(value.min)}°C / {Math.round(value.max)}°C
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