import SearchBar from "../components/SearchBar";
import SuggestionList from "../components/SuggestionList";
import WeatherWidget from "../components/WeatherWidget";
import ForecastDailyWidget from "../components/ForecastDailyWidget";
import HourlyForecastWidget from "../components/HourlyForecastWidget";
import NewsWidget from "../components/NewsWidget";
import { City } from "../components/SearchBar";
import RecentSearch from "../components/RecentSearch";
import MyNavbar from "../components/NavBar";
import "./Homepage.css"
import { useState } from "react";

export const Homepage = () => {
    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [latitude, setLatitude] = useState<number | undefined>();
    const [longitude, setLongitude] = useState<number | undefined>();
    const [selectedDay, setSelectedDay] = useState<string | undefined>(); 

    const handleSelectedCity = (selectedLatitude: number, selectedLongitude: number) => {
        if (selectedLatitude !== undefined && selectedLongitude !== undefined) {
            setLatitude(selectedLatitude);
            setLongitude(selectedLongitude);
        }
      };    

      return (
        <>   
            <div className="container-fluid"> 
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 side-widget">
                        <img id="logo" src="https://i.imgur.com/ZGkgQwU.png" alt="logo Zephyr forecast"></img>
                        <h4 id="welcome-homepage-sign">START YOUR JOURNEY NOW</h4>
                        <div className="search-bar-container">
                            <SearchBar onComplete={
                                (resultList:City[]) => {
                                    setSuggestions(resultList)
                                    }
                                } />
                            {suggestions.length > 0 && (
                                <SuggestionList
                                    suggestions={suggestions}
                                    onSuggestionClick={(city) => {
                                        setLatitude(city.lat);
                                        setLongitude(city.lon);
                                    }}
                                />
                            )} 
                        </div>                           
                        <div className="history-container">
                            <ul>
                                 <RecentSearch
                                    latitude = {latitude}
                                    longitude = {longitude}
                                    onHistoryClick={handleSelectedCity}
                                /> 
                            </ul>
                        </div>
                        <div className="news-widget">
                            <NewsWidget/>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12">
                        <div>
                            <MyNavbar />
                        </div> 
                        <div>
                            <WeatherWidget 
                                latitude={latitude} 
                                longitude={longitude}
                            />
                        </div>
                        <div>
                            {selectedDay && (
                                <HourlyForecastWidget 
                                    latitude={latitude} 
                                    longitude={longitude} 
                                    selectedDay={selectedDay} 
                                />
                            )}
                        </div>
                        <div>  
                            <ForecastDailyWidget
                                latitude={latitude}
                                longitude={longitude}
                                onDayClick={(day: string) => setSelectedDay(day)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Homepage;
