import React from "react";
import "./SuggestionList.css";

interface SuggestionListProps {
  suggestions: string[];
  onSuggestionClick: (city: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <div>
    <ul className="suggestion-list">
      {suggestions.map((city) => (
        <li key={city} onClick={() => onSuggestionClick(city)}>
          {city}
        </li>
      ))}
    </ul>
    </div>
  );
};

export default SuggestionList;