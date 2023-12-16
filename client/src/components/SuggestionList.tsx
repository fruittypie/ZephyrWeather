import React, {useState} from "react";
import "./SuggestionList.css";

type SuggestionListProps = {
  suggestions: City[]; 
  onSuggestionClick: (city: City) => void;
}

type City = {
  name: string;
  country: string;
  lon: number;
  lat: number;
  state?: string;
};


const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSuggestionClick = (city: City) => {
    onSuggestionClick(city);
    setShowSuggestions(false);
  };

  return (
    <div className="suggestion-box">
      {showSuggestions && (
        <ul className="suggestion-list">
          {suggestions.map((city:City, index: number) => (
            <li 
              className="suggestion-item"
              key={`${city.name}_${index}`}
              onClick={() => handleSuggestionClick(city)}
            >
              {`${city.name}, ${city.state}, ${city.country}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionList;