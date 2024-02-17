import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { fetchNewsData } from '../utils/api';
import "./SearchBar.css";
import { WebArticleProps } from "../pages/News";


type MyProps = {
  onComplete: (articles: WebArticleProps[]) => void; 
};


const NewsSearchBar: React.FC<MyProps> = ({ onComplete }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const newsData = await fetchNewsData(input);

      const articles: WebArticleProps[] = newsData.response.results.map(
        (article: WebArticleProps) => {
          return {
            webUrl: article.webUrl,
            webTitle: article.webTitle,
          };
        }
      );

      onComplete(articles);
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
        placeholder="Search articles"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <FaSearch id="search-icon" />
      {loading }
    </div>
  );
};

export default NewsSearchBar;
