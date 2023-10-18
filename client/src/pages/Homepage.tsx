import SearchBar from "../components/SearchBar";
import SuggestionList from "../components/SuggestionList";
import WeatherWidget from "../components/WeatherWidget"
import ForecastDailyWidget from "../components/ForecastDailyWidget";
import HourlyForecastWidget from "../components/HourlyForecastWidget";

import { useState } from "react";
import "./Homepage.css"
// import { useNavigate } from "react-router-dom"; 


export const Homepage = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [latitude, setLatitude] = useState<number | undefined>();
    const [longitude, setLongitude] = useState<number | undefined>();
    const [selectedDay, setSelectedDay] = useState<string | undefined>(new Date().toISOString());
 
    return (
        <> 
            <div className="row">
                <div className="col-4 min-vh-100 d-sm-flex">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                    <div className="search-bar-container">
                        <SearchBar onComplete={
                            (resultList:any) => setSuggestions(resultList)} />
                        <div>
                        {suggestions.length > 0 && (
                        <SuggestionList
                            suggestions={suggestions}
                            onSuggestionClick={(city) => {
                                setLatitude(city.coordLat);
                                setLongitude(city.coordLon);
                            }}
                        />
                        )} 
                        </div>
                    </div> 
                </div>
                <div className="col-6">
                    <WeatherWidget 
                        latitude={latitude} 
                        longitude={longitude}
                    />
                    <div className="col-12">
                        {selectedDay && (
                            <HourlyForecastWidget latitude={latitude} longitude={longitude} selectedDay={selectedDay} />
                        )}
                    </div>
                </div>
                <div className="col-2">  
                <ForecastDailyWidget
                        latitude={latitude}
                        longitude={longitude}
                        onDayClick={(day: string) => setSelectedDay(day)}
                    />
                </div>
            </div>  
        </>
    );
}

export default Homepage;