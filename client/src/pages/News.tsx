import MyNavbar from "../components/NavBar";
import NewsCard from "../components/NewsCard";
import { useState, useEffect } from "react";
import NewsWidget from "../components/NewsWidget";
import { fetchNewsData } from '../utils/api';
import NewsRecentSearch from "../components/NewsRecentSearch";
import NewsSearchBar from "../components/NewsSearchBar";
import NewsSuggestionList from "../components/NewsSuggestionList";
import "./News.css"

export type WebArticleProps = {
    webPublicationDate : string;
    webTitle : string;
    webUrl: string;
    id: string;
    apiUrl : string;
    fields: {
        thumbnail: string;
    };
};

export const News: React.FC = () => {

    const [articleData, setArticleData] = useState<WebArticleProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchSuggestions, setSearchSuggestions] = useState<WebArticleProps[]>([]);
    const [recentArticles, setRecentArticles] = useState<WebArticleProps[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('weather');

    useEffect(() => {
        const getNewsData = async () => {
            try {
                const data = await fetchNewsData(selectedCategory);
                setArticleData(data.response.results);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching news article", error);
            }
        };

        getNewsData();
    }, [selectedCategory]);

    if (loading) {
        return <div>Loading...</div>
    }

    // Destructure the first article from the articleData array
    const [firstArticle, ...restArticles] = articleData;
   
    return (
        <div className="container-fluid news-page"> 
            <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12 side-widget">
                    <img id="logo" src="https://i.imgur.com/ZGkgQwU.png" alt="logo Zephyr forecast"></img>
                    <h4 id="welcome-homepage-sign">START YOUR JOURNEY NOW</h4>
                    <div className="search-bar-container">
                        <NewsSearchBar onComplete={
                           (articleList: WebArticleProps[]) => {
                            setSearchSuggestions(articleList);
                           }} />
                        {searchSuggestions.length > 0 && (
                            <NewsSuggestionList
                                suggestions={searchSuggestions}
                                onSuggestionClick={(suggestion) => {
                                    //console.log('Clicked suggestion:', suggestion);
                                    setRecentArticles([suggestion]);
                                }}
                            />
                        )}  
                    </div>   
                    <div className="history-container">
                            <ul>
                                <NewsRecentSearch
                                    recentArticles={recentArticles}
                                    
                                />
                            </ul>
                        </div>        
                    <div className="news-widget">
                        <NewsWidget/>
                    </div>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12">
                    <MyNavbar />
                    <div className="col-12 categories-container">
                    <button type="button" className="my-button" onClick={() => setSelectedCategory('weather')}>Top News</button>
                        <button type="button" className="my-button" onClick={() => setSelectedCategory('climate')}>Climate change</button>
                        <button type="button" className="my-button" onClick={() => setSelectedCategory('travel')}>Travel</button>
                    </div>
                    <div className="container-fluid news-cards">
                        <div className="row">
                            <div className="col-12">
                                {/* Big news card for the first article */}
                                <NewsCard key={firstArticle.id} article={firstArticle} isBigCard={true} />
                            </div>
                            {/* Small news cards for the rest of the articles */}
                            {restArticles.map((article) => (
                                <div className="col-lg-6 col-md-12 col-sm-12 px-3 small-card-col-6" key={article.id}>
                                    <NewsCard article={article} isBigCard={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
}

export default News;


