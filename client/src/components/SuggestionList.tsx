import React, {useState} from "react";
import "./SuggestionList.css";

type SuggestionListProps = {
  suggestions: any;
  onSuggestionClick: (city: any) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  

  const handleSuggestionClick = (city: any) => {
    onSuggestionClick(city);
    setShowSuggestions(false);
    
  };
  return (
    <div>
      {showSuggestions && (
        <ul className="suggestion-list">
          {suggestions.map((city:any) => (
            <li className="suggestion-item" key={city.cityName} onClick={() => handleSuggestionClick(city)}>
              {`${city.cityName}, ${city.countryName} ${city.coordLon}-${city.coordLat}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggestionList;