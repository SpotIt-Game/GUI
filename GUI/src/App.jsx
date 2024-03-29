import Card from "./Card"
import Nav from "./Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Game from "./pages/Game";
import Difficulty from "./pages/Difficulty";


import { useState, useEffect } from "react";
import imgStruct from "./imgstruct"
import CardClass from "./cardClass"

function App() {

  let Component

  switch (window.location.pathname) {
    case "/":
      Component = Home
      break;
    case '/about':
      Component = About
      break;
    case '/game':
      Component = Game
      break
    case '/difficulty':
      Component = Difficulty
  }

  return (
    <>

      <Nav></Nav>
      <Component></Component>

      {/* <Card gallery={array[13]} styling={-50}></Card>
      <Card gallery={array[12]} styling={300}></Card> */}

    </>
  )
}

export default App
