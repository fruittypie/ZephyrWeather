import React, { useState, useEffect } from "react";

import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";
import axios from "axios";
import SuggestionList from "./SuggestionList";

const SearchBar: React.FC = ({}) => {
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = "293a5d839a79bb53686c89544634a786";

  useEffect(() => {
    if (input.length >= 2) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${apiKey}`
          );

          const cities: string[] = response.data.list.map(
            (city: any) => city.name
          );
          setSuggestions(cities);
          setLoading(false);        
        } catch (error) {
          console.error("Error finding suggestions", error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setSuggestions([]);
    }
  }, [input, apiKey]);

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search city"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {suggestions.length > 0 && (
        <SuggestionList
          suggestions={suggestions}
          onSuggestionClick={(city) => setInput(city)}
        />
      )}
    </div>
  );
};

export default SearchBar;