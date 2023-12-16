import { useState, useEffect, useRef } from "react";
import { useUnit } from "../context/TemperatureContext";
import { fetchWeatherData } from '../utils/api';
import { IconTemperature, IconDroplet } from '@tabler/icons-react';
import { Tooltip } from "react-leaflet";
import L from 'leaflet'; 

const iconBaseUrl = "https://openweathermap.org/img/wn/";

type MarkerProps = {
    latitude: number;
    longitude: number;
};

type WeatherDataProps = {
    "sys": {
        "country": string,
    };
    "main": {
        "temp": number;
        "humidity": number;
    };
    "weather": {
        icon: string;
    }[];
    unit: string;
    name: string;
    latitude:  number | undefined ;  
    longitude: number | undefined ;
};

const MapMarkerWidget: React.FC<MarkerProps> = ({ latitude, longitude}) => {
    const [weatherData, setWeatherData] = useState<WeatherDataProps>();
    const tooltipRef = useRef<any>(null);
    const { isCelsius } = useUnit();

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@2x.png`;
    };

    const fetchData = async (latitude: number, longitude: number) => {
        try {
            const data = await fetchWeatherData(
                latitude,
                longitude,
                isCelsius,
            );
            setWeatherData(data);
        } catch (error) {
            console.error("Error fetching weather data", error);
        }};

        useEffect(() => {
            fetchData(latitude, longitude);
        }, [latitude, longitude, isCelsius]);

        useEffect(() => {
            if (tooltipRef.current) {
              tooltipRef.current.openTooltip();
            }
          }, []);

        if (!weatherData) {
            return (
                <div> 
                    <p>Loading</p>
                </div>
            )
        };

    const city = `${weatherData.name}, ${weatherData.sys.country}`;
    return (
        <Tooltip ref={tooltipRef} direction="top" opacity={1} permanent offset={L.point({x: 0, y: -10})}>
            <div className="widget-marker">
                <div className="marker-name">
                    {city}
                </div>
                <div className="icon-weather">
                <img
                    src={getWeatherIconUrl(weatherData.weather[0].icon)}
                />
                </div>
                <div className="marker-temperature"> 
                     <IconTemperature size={18} style={{ marginBottom: '1.5px' }} />
                    {isCelsius 
                        ? `${Math.round(weatherData.main.temp)} °C`
                        : `${Math.round(weatherData.main.temp)} °F`
                    }
                    <IconDroplet size={16} style={{ marginLeft: '5px', marginRight: '1px',  marginBottom: '2px'}}/>
                    {weatherData.main.humidity}%
                </div>  
            </div>
        </Tooltip>
    )
}
export default MapMarkerWidget;