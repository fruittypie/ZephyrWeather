import "../pages/News.css";

type NewsCardProps = {
    article: {
        webPublicationDate : string;
        webTitle : string;
        webUrl: string
        id: string;
         
        apiUrl : string;
        fields: {
            thumbnail: string;
        }
    }
    isBigCard: boolean;
};

const NewsCard: React.FC<NewsCardProps>= ({article, isBigCard}) => {
    return (
       <div className={`row ${isBigCard ? 'big-card' : 'small-card'}`} key={article.id}>   
            <div className="col-l-6 col-md-6 col-sm-6 col-xs-6 img-container">         
                <img className="rounded img-fluid" src={article.fields.thumbnail} alt="Article Thumbnail"/>
            </div>
            <div className="col-md-6 text-container">
                <p className="news-headline">{article.webTitle}</p>
                <p className="news-date"><small className="text-body-secondary">Last updated {article.webPublicationDate}</small></p>
            </div>
        </div>
    );
};
export default NewsCard;