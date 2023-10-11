import React, { useState, useEffect } from "react";

import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";
import axios from "axios";
import "./SuggestionList.tsx";

const apiKey = "293a5d839a79bb53686c89544634a786";

type MyProps = {
  onComplete: any;
};

const SearchBar: React.FC<MyProps> = ({onComplete}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
      );

      const cities: string[] = response.data.list.map(
        (city: any) => {
          return {
            cityName : city.name,
            countryName : city.sys.country,
            coordLon : city.coord.lon,
            coordLat : city.coord.lat
          }
        }
      );
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