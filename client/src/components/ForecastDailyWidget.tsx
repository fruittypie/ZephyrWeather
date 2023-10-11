import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "293a5d839a79bb53686c89544634a786";

type WidgetProps = {
    latitude?: number | null;
    longitude?: number | null;
  };

// get a day of the week
const daysWeek = (date: Date) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
};

const ForecastDailyWidget: React.FC<WidgetProps> = ({ latitude, longitude }) => { 
    const [forecastData, setForecastData] = useState<any>(); 

    useEffect(() => {
        // default coordinates
        const defaultLatitude = 51.5074;
        const defaultLongitude = -0.1278;

        // asynchronous function to fetch data
        const fetchForecastData = async () => {
            try {
                const response = await axios.get(
                     `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude || defaultLatitude}&lon=${longitude || defaultLongitude}&appid=${apiKey}&units=metric`
                ); 
                setForecastData(response.data);
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
    
    return (
        <div className="forecast-widget">
             <p>5-DAY FORECAST</p>
             {forecastData.list.map((forecast:any, index: number) => (
                <div key={index}>
                     <p>
                        {daysWeek(forecast.dt_txt)}
                     </p>
                     <div className="forecast-temperature">
                         {Math.round(forecast.main.temp)}°C
                      </div>
                 </div>
             ))}
        </div>
    );   
};

export default ForecastDailyWidget;