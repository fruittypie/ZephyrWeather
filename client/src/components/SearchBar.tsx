import React, {useState} from "react";

import {FaSearch} from "react-icons/fa";
import "./SearchBar.css";
import axios from "axios";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = "293a5d839a79bb53686c89544634a786";


  return (
    <div className="input-wrapper">
        <FaSearch id="search-icon" />
        <input placeholder="Search city"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
    </div>
  );
}

export default SearchBar;