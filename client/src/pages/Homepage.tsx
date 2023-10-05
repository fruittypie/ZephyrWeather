import SearchBar from "../components/SearchBar";
import SuggestionList from "../components/SuggestionList";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 


export const Homepage = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const navigate = useNavigate();
 
    return (
        <>
        <h1>Homepage</h1>
        <div className="search-bar-container">
                <SearchBar onComplete={
                (resultList:any) => setSuggestions(resultList)} />
                <div>
                    {suggestions.length > 0 && (
                    <SuggestionList 
                    suggestions={suggestions}
                    onSuggestionClick={(city) => navigate(`/city/${city}`)}
                />
                )} 
                </div>
            </div>
            <button onClick={() => alert("clicked")}>My Button</button>
        </>
    );
}

export default Homepage;