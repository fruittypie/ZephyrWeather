import React, { useState } from "react";
import "./SuggestionList.css";
import { WebArticleProps } from "../pages/News";



type SuggestionListProps = {
  suggestions: WebArticleProps[];
  onSuggestionClick: (suggestion: WebArticleProps) => void;
};

const NewsSuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSuggestionClick = (suggestion: WebArticleProps) => {
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
    window.open(suggestion.webUrl);
  };

  return (
    <div className="suggestion-box">
      {showSuggestions && (
        <ul className="suggestion-list">
          {suggestions.map((suggestion, index: number) => (
            <li
              className="suggestion-item"
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.webTitle} 
              
            </li>
          ))}
        </ul>
      )}
    </div> 
  );
};

export default NewsSuggestionList;
