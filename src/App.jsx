
import Landing from "./pages/Landing";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Tower from "./pages/Tower.jsx"
import Triplet from "./pages/Triplet.jsx"
import Potato from "./pages/Potato.jsx"
import Poison from "./pages/Poison.jsx"
import Well from "./pages/Well.jsx"
import Modes from "./pages/Modes.jsx"
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
          <Route path="/wait/:edition/:diff/:mode" element={<Waiting />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/modes/:edition/:lvl" element={<Modes />} />          
          <Route path="/difficulty/:edition" element={<Difficulty />} />
          <Route path="/tower/:lowkey/:rand/:edition/:lvl" element={<Tower />} />
          <Route path="/triplet/:lowkey/:rand/:edition/:lvl" element={<Triplet />} /> 
          <Route path="/potato/:lowkey/:rand/:edition/:lvl" element={<Potato />} />
          <Route path="/poison/:lowkey/:rand/:edition/:lvl/:pNum" element={<Poison />} />
          <Route path="/well/:lowkey/:rand/:edition/:lvl/:pNum" element={<Well />} />
        </Routes>
      </div>

    </>
  )
}

export default App
