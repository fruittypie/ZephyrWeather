import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from "./components/NavBar";
import Homepage from './pages/Homepage';
import News from './pages/News';
import WeatherMap from './pages/Map';
import Login from './pages/Login';
import { TempProvider } from "./context/TemperatureUnitContext"


function App() {
     return (
     <>
        <TempProvider> 
            <div className="App">
                <Router>
                    <MyNavbar />
                    <div>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/map" element={<WeatherMap />} />
                                <Route path="/news" element={<News />} />
                                <Route path="/login" element={<Login />} />
                            </Routes>                   
                    </div>
                </Router>
            </div>     
        </TempProvider>
     </>
     );
 }

 export default App;

