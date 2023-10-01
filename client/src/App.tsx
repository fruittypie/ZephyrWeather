import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyNavbar from "./components/NavBar";
import Homepage from './pages/Homepage';
import News from './pages/News';
import WeatherMap from './pages/Map';
import Login from './pages/Login';


function App() {
     return (
     <>
         <Router>
             <MyNavbar />
             <div className="container mt-4">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/map" element={<WeatherMap />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
             </div>
         </Router>
         <button onClick={() => alert("clicked")}>My Button</button>     
     </>
     );
 }

 export default App;

