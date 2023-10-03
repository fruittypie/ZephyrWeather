import React from "react";

interface SuggestionListProps {
  suggestions: string[];
  onSuggestionClick: (city: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  return (
    <ul className="suggestion-list">
      {suggestions.map((city) => (
        <li key={city} onClick={() => onSuggestionClick(city)}>
          {city}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;