import Card from "../Card";
import CardClass from "../cardClass";
import imgStruct from "../imgstruct";
import React, { useState, useEffect } from 'react';

function Game(){
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    useEffect(() =>{
      const apiUrl = 'http://localhost:8080/cards';
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
  
    const arr = data; // Assuming 'data' is an array
    // console.log(data)
  
  
  
    const array = new Array(391)
  
    for(let i = 0; i < 391; i++){
      array[i] = new CardClass();
    }
  
    for(let i = 0; i < arr.length; i++){
      let temp = new imgStruct(arr[i].url, arr[i].rotate, arr[i].scale, arr[i].x, arr[i].y, arr[i].width, arr[i].height)
      array[arr[i].id_card].info.push(temp)
    }

    let fours = array.slice(1, 13)

    fours = fours.sort(() => Math.random() - 0.5)

    return(
        <>
            <Card gallery={fours[0]} styling={-50}></Card>
            <Card gallery={fours[11]} styling={-50}></Card>
            <p className="player"> Player Card</p>
        </>
    )
}

export default Game