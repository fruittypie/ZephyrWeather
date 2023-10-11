import { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherWidget.css"

const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";


// creating a custom type
type WidgetProps = {
    latitude?: number | null;
    longitude?: number | null;
  };

//creating a functional component with city as a prop
const WeatherWidget: React.FC<WidgetProps> = ({ latitude, longitude }) => { 
    const [weatherData, setWeatherData] = useState<any>(); 
    const [isCelsius, setIsCelsius] = useState(true);


    const calculateFahrenheit = (celsius: number) => {
        return Math.round((celsius * 9) / 5 + 32);
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius((prevIsCelsius) => !prevIsCelsius);
      };

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@2x.png`;
    };

    // creating useEffect hook
    useEffect(() => {
        // default coordinates
        const defaultLatitude = 51.5074;
        const defaultLongitude = -0.1278;
        // asynchronous function to fetch data
        const fetchWeatherData = async () => {
            try {

                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude || defaultLatitude }&lon=${longitude || defaultLongitude }&appid=${apiKey}&units=metric`
                );      
                setWeatherData(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
    
        fetchWeatherData();
        
    }, [latitude, longitude]);

    if (!weatherData) {
        return (
            <div> 
                <p>Loading</p>
            </div>
        )
    };

    const city = `${weatherData.name}, ${weatherData.sys.country}`;
    // display the weather information
    return (
        <div className="weather-widget">
            <div>
                <p className="text mb-0" id="city-name">{city}</p>
                <h2 className="temperature"><strong>{isCelsius 
                    ? `${Math.round(weatherData.main.temp)} °C` 
                    : `${calculateFahrenheit(weatherData.main.temp)} °F`}
                    </strong></h2>
            </div>
            <img 
                className="weather-icon"
                src={getWeatherIconUrl(weatherData.weather[0].icon)}
                />
             <div>
                <div className="button b2" id="button-10" onClick={toggleTemperatureUnit}>
                    <input type="checkbox" className="checkbox" checked={isCelsius} />
                    <div className="knobs">
                        <span>F</span>
                    </div>
                    <div className="layer"></div>
                </div>
             <p className="description">{weatherData.weather[0].main}</p>
             </div>
             <div className="weather-details">
                <p>Humidity: {weatherData.main.humidity} %</p>
                <p>Wind: {weatherData.wind.speed} m/c </p>
                <p>Feels Like: {weatherData.main.feels_like}</p>
            </div>
        </div>
    );
};

export default WeatherWidget;