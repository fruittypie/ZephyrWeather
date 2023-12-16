import React, { useState, useEffect } from "react";
import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";
import "./SuggestionList.tsx";
import { findCityData } from '../utils/api';


type MyProps = {
  onComplete: (cities: City[]) => void;
};

export type City = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
};

const SearchBar: React.FC<MyProps> = ({onComplete}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const cityData = await findCityData(input);

      const cities: City[] = cityData.map(
        (city: City) => ({
            name : city.name,
            country : city.country,
            lat : city.lat,
            lon : city.lon,
            state: city.state
          }));

      onComplete(cities);
      setLoading(false);        
    } catch (error) {
        console.error("Error finding suggestions", error);
        setLoading(false);
    }
    };

  useEffect(() => {
    if (input.length >= 3) {
      fetchData();
    } else {
      onComplete([]);
    }
  }, [input]);


  return (
    <div className="input-wrapper">
      <input
        placeholder="Search city"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <FaSearch id="search-icon" />
      {loading}
    </div>
  );
};

export default SearchBar;