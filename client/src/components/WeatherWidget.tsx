import { useState, useEffect } from "react";
import axios from "axios";
import { TempProvider } from "./context/TemperatureUnitContext"
import "./WeatherWidget.css"

const apiKey = "293a5d839a79bb53686c89544634a786";
const iconBaseUrl = "https://openweathermap.org/img/wn/";

type WidgetProps = {
    latitude?: number | null;
    longitude?: number | null;
};

const WeatherWidget: React.FC<WidgetProps> = ({ latitude, longitude }) => { 
    const [weatherData, setWeatherData] = useState<any>(); 
    const [isCelsius, setIsCelsius] = useState(true);

    const toggleTemperatureUnit = () => {
        setIsCelsius((prevIsCelsius) => !prevIsCelsius);
    };

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@4x.png`;
    };

    const fetchWeatherData = async (lat: number, lon: number, isCelsius: boolean) => {
        try {
            const unit = isCelsius ? 'metric' : 'imperial';
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        const defaultLatitude = 51.5074;
        const defaultLongitude = -0.1278;
        fetchWeatherData(latitude || defaultLatitude, longitude || defaultLongitude, isCelsius);
    }, [latitude, longitude, isCelsius]);

    if (!weatherData) {
        return (
            <div> 
                <p>Loading</p>
            </div>
        )
    };

    const city = `${weatherData.name}, ${weatherData.sys.country}`;
    return (
        <div className="weather-widget">
            <div className="widget-row">
                <p className="text mb-0" id="city-name">{city}</p>
                <h2 className="temperature">
                    <strong>
                        {isCelsius 
                            ? `${Math.round(weatherData.main.temp)} °C` 
                            : `${Math.round(weatherData.main.temp)} °F`
                        }
                    </strong>
                </h2>
                <div className="toggle-button" onClick={toggleTemperatureUnit}>
    <input type="checkbox" className="checkbox" checked={isCelsius} />
    <div className="slider">
        <span className="unit">{isCelsius ? "°F" : "°C"}</span>
    </div>
</div>
            </div>
            <div className="widget-row">
                <img 
                    className="weather-icon"
                    src={getWeatherIconUrl(weatherData.weather[0].icon)}
                />
            </div>
            <div className="widget-row">
                <div className="weather-details">
                    <p>{weatherData.weather[0].main}</p>
                    <p>Humidity: {weatherData.main.humidity} %</p>
                    <p>Wind: {isCelsius 
                        ? `${Math.round(weatherData.wind.speed)} m/c` 
                        : `${Math.round(weatherData.wind.speed)} mph`
                        }</p>
                    <p>Feels Like: {isCelsius 
                        ? `${Math.round(weatherData.main.feels_like)} °C` 
                        : `${Math.round(weatherData.main.feels_like)} °F`
                    }</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
