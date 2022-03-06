import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from "./pages/Login"
import Home from "./pages/Home"

function App() {
  return (
    <Router>
      <div>
        <Routes>
        <Route exact path='/' element={<Home/>}></Route>
        <Route exact path='/login' element={<Login/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
