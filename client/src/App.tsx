import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./components/NavBar";


function App() {
     return (
     <>
         <NavBar />
         <button onClick={() => alert("clicked")}>My Button</button>     
     </>
     );
 }
 export default App;
