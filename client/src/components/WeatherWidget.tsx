import { useState, useEffect } from "react";
import axios from "axios";

// creating a custom type
type WidgetProps = {
    city: string;
  };

//creating a functional component with city as a prop
const WeatherWidget: React.FC<WidgetProps> = ({ city }) => {

    const [weatherData, setWeatherData] = useState(null); // Is null nessesary?
    const apiKey = "293a5d839a79bb53686c89544634a786";

    // creating useEffect hook
    useEffect(() => {
        // asynchronous function to fetch data
        const getWeatherData = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${city}&type=like&sort=population&cnt=5&appid=${apiKey}`
                );
                setWeatherData(response.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        getWeatherData();
    }, [city]);

    // display the weather information
    return (
        <div>
          <h2>Weather in {city}</h2>
        </div>
      );
};



export default WeatherWidget;