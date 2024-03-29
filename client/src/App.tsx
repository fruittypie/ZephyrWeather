import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import News from './pages/News';
import WeatherMap from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import { TempProvider } from "./context/TemperatureContext";

function App() {
     return (
     <>
        <TempProvider> 
            <div>
                <Router>
                    <div>
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/map" element={<WeatherMap />} />
                                <Route path="/news" element={<News />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />}/>
                            </Routes>                   
                    </div>
                </Router>
            </div>     
        </TempProvider>
     </>
     );
 }

 export default App;

