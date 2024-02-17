import { useState, useEffect } from "react";
import { useUnit } from "../context/TemperatureContext";
import { IconDroplet, IconWind, IconTemperature, IconMapPinFilled } from '@tabler/icons-react';
import "./WeatherWidget.css";
import { fetchWeatherData } from '../utils/api';

const iconBaseUrl = "https://openweathermap.org/img/wn/";

type WidgetProps = {
    latitude?: number | null;
    longitude?: number | null;
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
}

const WeatherWidget: React.FC<WidgetProps> = ({ latitude, longitude }) => { 
    const [weatherData, setWeatherData] = useState<WeatherDataProps>(); 
    const {isCelsius, toggleUnit} = useUnit();

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@4x.png`;
    };

    useEffect(() => {
        const defaultLatitude = 51.5074;
        const defaultLongitude = -0.1278;
        const fetchData = async () => {
            try {
              const data = await fetchWeatherData(
                latitude || defaultLatitude,
                longitude || defaultLongitude,
                isCelsius
              );
              setWeatherData(data);
            } catch (error) {
                console.error("Error fetching data", error);
        }
    }
    fetchData();
    }, [latitude, longitude, isCelsius]);

    if (!weatherData) {
        return (
            <div> 
                <p>Loading</p>
            </div>
        )
    };

    // Extract city name from weather data
    const city = `${weatherData.name}, ${weatherData.sys.country}`;
    
    return (
        <div className="weather-widget">
            <div className="widget-row">
                <p className="text mb-0" id="city-name">
                    <IconMapPinFilled 
                        size={28}
                        style={{ marginRight: '6px' }} 
                    />
                    {city}
                </p>
                <h2 className="temperature">
                    <strong>
                        {Math.round(weatherData.main.temp)}
                        {' °'}
                        {isCelsius ? 'C' : 'F'}
                    </strong>
                </h2>
                <div className="unit-switch" onClick={toggleUnit}>
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={isCelsius}
                        onChange={toggleUnit}
                    />
                    <div className={`slider ${isCelsius ? "celsius" : "fahrenheit"}`}>
                        <span className="unit1">°F</span>
                        <span className="unit2">°C</span>
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
                    <p style={{ fontWeight: 'bold' }}>{weatherData.weather[0].main}</p>
                    <p> 
                        <IconDroplet size={14} style={{ marginRight: '8px' }}/>
                        <span style={{ marginRight: '15px' }}>Humidity:</span>
                        {weatherData.main.humidity} %
                    </p>
                    <p>
                        <IconWind size={16} style={{ marginRight: '8px' }}/>
                        <span style={{ marginRight: '43px' }}>Wind:</span> 
                        {isCelsius 
                            ? `${Math.round(weatherData.wind.speed)} m/c` 
                            : `${Math.round(weatherData.wind.speed)} mph`
                        }
                    </p>
                    <p>
                        <IconTemperature size={16} style={{ marginRight: '10px' }} />
                        <span style={{ marginRight: '10px' }}>Feels Like:</span>
                        {isCelsius 
                            ? `${Math.round(weatherData.main.feels_like)} °C` 
                            : `${Math.round(weatherData.main.feels_like)} °F`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
