
import Landing from "./pages/Landing";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Game9 from "./pages/Game9";
import Game4 from "./pages/Game4.jsx";
import Game5 from "./pages/Game5.jsx";
import Game6 from "./pages/Game6.jsx";
import Game8 from "./pages/Game8.jsx"
import Difficulty from "./pages/Difficulty";
import Auth from "./components/Auth" 
import Waiting from "./pages/Waiting"
import { Route, Routes } from "react-router-dom"


function App() {


  return (
    <>

      <Nav></Nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/wait/:diff" element={<Waiting />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/game4/:lowkey/:rand" element={<Game4 />} />
          <Route path="/game5" element = {<Game5 />} />
          <Route path="/game6" element = {<Game6 />} />
          <Route path="/game8" element = {<Game8 />} />
          <Route path="/game9" element={<Game9 />} />
        </Routes>
      </div>

    </>
  )
}

export default App
