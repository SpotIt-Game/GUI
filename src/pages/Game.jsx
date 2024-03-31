import Card from "../Card";
import CardClass from "../cardClass";
import imgStruct from "../imgstruct";
import React, { useState, useEffect } from 'react';

function Game(){
    const [a, setA] = useState(1)
    const [b, setB] = useState(0)    
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    const [segment, setSegment] = useState([])
    useEffect(() =>{
      const apiUrl = 'https://q3cgus21cj.execute-api.us-east-2.amazonaws.com/dev';
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Set the fetched data in state
          setData(data);
          setLoading(false)
            const arr = data
            const array = new Array(391)
  
            for(let i = 0; i < 391; i++){
                array[i] = new CardClass();
            }
  
            for(let i = 0; i < arr.length; i++){
                let temp = new imgStruct(arr[i].url, arr[i].rotate, arr[i].scale, arr[i].x, arr[i].y, arr[i].width, arr[i].height)
                array[arr[i].id_card].info.push(temp)
            }

            let fours = array.slice(390 - 73, 390)

            fours = fours.sort(() => Math.random() - 0.5)

            setSegment(fours)
        })
        .catch(error => {
          // Handle any errors
          console.error('Error fetching data:', error);

          setLoading(false)
        });
    }, []);

    const loadStyler = {
      display: `grid`,
      fontFamily: `"Boink Drop Shadow W01", Arial, Helvetica, sans-serif`,
      justifyContent: `center`,
      alignItems: `center`,
      height: `400px`,
      width: `400px`,
      border: `solid  15px hsl(277, 64%, 62%)`,
      borderWidth: `10px`,
      borderRadius: `50%`,
      position: `relative`,
      margin: `0 auto`,
      backgroundColor: `white`,
      transform: `scale(0.68)`,

    }

    if (loading){
      return(
        <h1 style={loadStyler} >Loading...</h1>
      )
    }
  
    
  
  
  



    
    const increment = () => {
        console.log("Hello", a, b)
        setA(prevA => prevA + 1)
        setB(prevB => prevB + 1)
    }

    return(
        <>
            <Card gallery={segment[a]} onButtonClick={() => increment()} className="center" styling={-50}></Card>
            <Card gallery={segment[b]} className="jugador" styling={-50}></Card>
            <p className="player"> Player Card </p>
        </>
    )
}

export default Game
