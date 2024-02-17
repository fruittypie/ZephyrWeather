import { useState, useEffect } from "react";
import { fetchNewsData } from '../utils/api';
import "./NewsWidget.css";
import { WebArticleProps } from "../pages/News";
import { Link } from 'react-router-dom';


const NewsWidget = () => {
    const [articles, setArticles] = useState<WebArticleProps[] | undefined>(undefined);

    useEffect(() => {
        const getNewsData = async () => {
            try {
                const data = await fetchNewsData("temperature");
                const articlesData: WebArticleProps[] = data.response.results;
                setArticles(articlesData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        getNewsData();
    }, []);

    return (
        <div className="news-widget">
        <Link to="/news" className="news-title">
            Recent News {" >"}
        </Link>            <ul className="news-list">
                {articles && articles.map((article, index)=> (
                    <li key={index}>
                        <a href={article.webUrl} target="_blank" rel="noopener noreferrer">
                            <p>{article.webTitle}</p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default NewsWidget;