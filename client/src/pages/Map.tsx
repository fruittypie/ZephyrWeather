import { MapContainer, TileLayer, LayersControl, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import MyNavbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import SuggestionList from "../components/SuggestionList";
import MapMarkerWidget from "../components/MapMarkerWidget";
import RecentSearch from "../components/RecentSearch";
import NewsWidget from "../components/NewsWidget";
import { Icon, LatLng } from 'leaflet'; 
import { City } from "../components/SearchBar";
import { useEffect, useState } from "react";

const proxyServerUrl = '/api/proxy'

const markerIcon = new Icon({
    iconUrl: "https://img.icons8.com/glyph-neue/64/737373/marker--v1.png",
    iconSize: [30,30]
});

const AddMarker = () => {
    const [position, setPosition] = useState<LatLng | null>(null); ;
  
    useMapEvents({
      click: (e) => {
        setPosition(e.latlng);
        },
    });
  
    return position === null ? null : (
      <Marker position={position} icon={markerIcon}>
        <MapMarkerWidget
            latitude={position.lat}
            longitude={position.lng}
        />
      </Marker>
    );
  };

const getHistorySearch = (() => {
    const historyString = localStorage.getItem('historySearch');
    if (historyString && historyString.length) {
        return JSON.parse(historyString);
    } else {
        return [];
    }   
});    

export const Map = () => {

    const [suggestions, setSuggestions] = useState<City[]>([]);
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0); 

    const handleSelectedCity = (selectedLatitude: number, selectedLongitude: number) => {
        setLatitude(selectedLatitude);
        setLongitude(selectedLongitude);
      };    
    
    const locationKey = `${longitude}_${latitude}`;

    useEffect(() => {
        const history = getHistorySearch();
        if (history.length) {
            const lastItem = history[history.length-1];
            setLatitude(lastItem.latitude);
            setLongitude(lastItem.longitude);
        } else {
            setLatitude(51.5074);
            setLongitude(-0.1278);
        }
    },[]);

    return (
        <>
        <div className="container-fluid"> 
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12 side-widget">
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
                        }}/>
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
                <div className="col-lg-8 col-md-8 col-sm-12">
                    <MyNavbar />
                    <MapContainer key={locationKey} center ={[latitude, longitude]} zoom={10}>
                        <LayersControl position="topright">
                            <TileLayer 
                                attribution={ `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                                url={`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`}
                            /> 
                            <LayersControl.Overlay checked name="Temperature">
                            <TileLayer
                                attribution="OpenWeatherApi"
                                url={`${proxyServerUrl}/temp_new/{z}/{x}/{y}.png`}
                            />
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name="Precipitation">
                                <TileLayer
                                    attribution="OpenWeatherApi"
                                    url={`${proxyServerUrl}/precipitation_new/{z}/{x}/{y}.png`}
                                />
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name="Wind">
                                <TileLayer
                                    attribution="OpenWeatherApi"
                                    url={`${proxyServerUrl}/wind_new/{z}/{x}/{y}.png`}
                                />
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name="Pressure">
                                <TileLayer
                                    attribution="OpenWeatherApi"
                                    url={`${proxyServerUrl}/pressure_new/{z}/{x}/{y}.png`}
                                />
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name="Clouds">
                                <TileLayer
                                    attribution="OpenWeatherApi"
                                    url={`${proxyServerUrl}/clouds_new/{z}/{x}/{y}.png`}
                                />
                            </LayersControl.Overlay>
                        </LayersControl>
                        <AddMarker/>
                        <Marker position={[latitude, longitude]} icon={markerIcon}>
                            <MapMarkerWidget
                            latitude={latitude}
                            longitude={longitude}
                            />
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </div>
        </>
    );
}

export default Map;