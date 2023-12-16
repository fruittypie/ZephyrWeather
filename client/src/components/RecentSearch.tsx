import { useState, useEffect } from "react";
import { useUnit } from "../context/TemperatureContext";
import { fetchWeatherData } from '../utils/api';
import "./RecentSearch.css";

const iconBaseUrl = "https://openweathermap.org/img/wn/";

type SearchProps = {
    latitude: number | undefined;
    longitude: number | undefined;
    onHistoryClick: (latitude: number, longitude: number) => void;
};

type SearchItem = {
    iconUrl: string;
    unit: string;
    temperature: number;
    name: string;
    latitude:  number;  
    longitude: number;
};

const RecentSearch: React.FC<SearchProps> = ({
    latitude,
    longitude,
    onHistoryClick,
}) => {
    const [search, setSearch] = useState<SearchItem[]>([]);
    const { isCelsius } = useUnit();

    const getWeatherIconUrl = (iconCode: string) => {
        return `${iconBaseUrl}${iconCode}@2x.png`;
    };

    // Get the search history from local storage
    const getHistorySearch = (() => {
        const historyString = localStorage.getItem('historySearch');
        if (historyString && historyString.length) {
            return JSON.parse(historyString);
        } else {
            return [];
        }   
    });
    
    // Read from local storage and set the search state
    const readFromLocalStorageAndSet = (() => {
        const history = getHistorySearch().filter((item: SearchItem) => 
            item.latitude !== undefined && 
            item.longitude !== undefined);
        // Fetch data for each historical search
        const promises = history.map((search: SearchItem) => 
        fetchData(search.latitude, search.longitude, isCelsius));
        Promise.all(promises).then((resp) => {
            const filteredSearch = resp.filter((item) => item !== null);
        setSearch(filteredSearch);
        }).catch( () => {
            console.error("Failed fetching data");
        });
    });

    // Set the state when the temperature unit changes
    useEffect(() => {
        readFromLocalStorageAndSet();
    }, [isCelsius])

    const fetchData = async (latitude: number, longitude: number, isCelsius: boolean) => {
        try {
            const data = await fetchWeatherData(latitude, longitude, isCelsius);
            const {name, main, weather } = data;
            const iconUrl = getWeatherIconUrl(weather[0].icon);
            const temperature = main.temp;
            return (
                {name, latitude, longitude, temperature, iconUrl}
            );
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        if (latitude && longitude) {
            const history = getHistorySearch();
            const existedIndex = history.findIndex((historyItem: SearchProps) => {

                if (historyItem.longitude === longitude &&
                    historyItem.latitude === latitude) {
                        return true
                   } else {
                        return false
                   }  
            });
            
            // Keep only 3 last searches moving the existed search to the top
            if (existedIndex !== -1) {
                history.splice(existedIndex, 1);
            }
            if (history.length < 3) {
            history.push({longitude, latitude});
            } else {
                history.shift();
                history.push({longitude, latitude});
            }
            // Adding the search to the storage
            localStorage.setItem('historySearch', JSON.stringify(history));
            readFromLocalStorageAndSet();
        }
    }, [latitude, longitude]);
    
    // Reverse the array to display the most recent searches first
    const reversedSearch = [...search].reverse();

    return (
        <div className="history-search">
            {search.length > 0 && <p className="history-title">Recent Search</p>}
            <ul className="history-list">
                {reversedSearch.map((search, index) => (
                        <div className="history-item" key={index} onClick={() => {
                            if (search.latitude !== undefined && search.longitude !== undefined) {
                                onHistoryClick(search.latitude, search.longitude);
                            }
                            }}>
                            <div className="search-container clearfix">
                                <img src={search.iconUrl} alt="Weather Icon" />
                                <div className="city-info">
                                    <div id="city-name">
                                        {search.name}
                                    </div>
                                    <div id="temperature">
                                        {Math.round(search.temperature)} °{isCelsius ? 'C' : 'F'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </ul>
        </div>
    );
};

export default RecentSearch;