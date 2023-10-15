import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";

type WidgetProps = {
    latitude?: number;
    longitude?: number;
  };

// get a day of the week
const daysWeek = (date: Date) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
}; 

const ForecastDailyWidget: React.FC<WidgetProps> = ({ latitude = 51.5074, longitude =  -0.1278 }) => { 
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
                console.log(response.data);
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

    //empty object to store all temps by day
    const allTemperatures: { [day:string]: {min: number; max:number} } = {}

    forecastData.list.forEach((forecast:any) => {
        const day = forecast.dt_txt.split(" ")[0];
        const temperature = forecast.main.temp;

        if(!allTemperatures[day]) {
            allTemperatures[day] = {min: temperature, max: temperature};
        } else {
            if (temperature < allTemperatures[day].min) {
                allTemperatures[day].min = temperature;
            } else if (temperature > allTemperatures[day].max) {
                allTemperatures[day].max = temperature;
            }
        }
    });

    return (
        <div className="forecast-widget">
             <p>5-DAY FORECAST</p>
             {Object.entries(allTemperatures).map(([key,value], index: number) => {
                return <div key={index}>
                        <div className="forecast-temperature">
                            {Math.round(value.min)}°C / {Math.round(value.max)}°C
                        </div>
                        <img className="weather-icon"
                        src={getWeatherIconUrl(forecastData.list.find((item: any) => item.dt_txt.includes(key)).weather[0].icon)}
                        />
                        <p>
                            {daysWeek(new Date(key))}
                        </p>
                    </div>          
    })}
        </div>
    );   
};

export default ForecastDailyWidget;

