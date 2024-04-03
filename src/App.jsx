import Card from "./Card"
import Nav from "./Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Game from "./pages/Game";
import Difficulty from "./pages/Difficulty";
import { Route, Routes } from "react-router-dom"


import { useState, useEffect } from "react";
import imgStruct from "./imgstruct"
import CardClass from "./cardClass"

function App() {

  let Component


  return (
    <>

      <Nav></Nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>

    </>
  )
}

export default App
