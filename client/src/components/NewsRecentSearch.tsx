import React, { useEffect, useState } from "react";
import "./RecentSearch.css";
import { WebArticleProps } from "../pages/News";

type RecentSearchProps = {
  recentArticles: WebArticleProps[];
};

const NewsRecentSearch: React.FC<RecentSearchProps> = ({
  recentArticles = [],
}) => {

const storedDataString = localStorage.getItem('newsHistorySearch');
const storedData = storedDataString ? JSON.parse(storedDataString) : [];
const [searches, setSearches] = useState<WebArticleProps[]>(storedData);
  // Update the search history when the article changes
  useEffect(() => {
    console.log(recentArticles)
    if (recentArticles.length > 0) {
      const article = recentArticles[0];

      const existedIndex = searches.findIndex(
        (historyItem: WebArticleProps) =>
        // Check if the article is already in the storage
        (historyItem.webTitle === article.webTitle &&
         historyItem.webUrl === article.webUrl)
      );
      const newSearches = [...searches];

      // Keep only 3 last searches moving the existed search to the top
      if (existedIndex !==-1) {
        newSearches.splice(existedIndex, 1);
      }
      if (newSearches.length < 3) {
        newSearches.push(article);
      } else {
        newSearches.shift();
        newSearches.push(article)
      }
      // Adding the search to the storage
      localStorage.setItem('newsHistorySearch', JSON.stringify(newSearches));
      setSearches(newSearches);
    }
  }, [recentArticles]);

  // Reverse the array to display the most recent searches first
  return (
    <div className="history-search">
      {searches.length > 0 && 
        (<p className="history-title">Recent Search</p>
      )}
      <ul className="history-list">
        {searches.map((searchItem, index) => (
          <div className="news-history-item" key={index}>
            <a href={searchItem.webUrl} target="_blank" rel="noopener noreferrer">
              {searchItem.webTitle} 
            </a>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default NewsRecentSearch;
