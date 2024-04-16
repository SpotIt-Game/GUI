import { useState, useEffect } from "react";
import Card from "../components/Card";
import { db } from "../firebase/config"
import { getDocs, collection, addDoc, deleteDoc } from "firebase/firestore";
import CardClass from "../components/cardClass";
import imgStruct from "../components/imgstruct";
import { auth } from "../firebase/config"
import { child, ref, onValue, set, query, get, remove, update, push, runTransaction} from "firebase/database";
import { rt } from "../firebase/config"
import { useParams } from "react-router-dom";
import seedrandom from "seedrandom";
function Game4(){
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    const [segment, setSegment] = useState([]);
    const image_cardCollectionRef = collection(db, "image_card")
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const { lowkey, rand } = useParams();
    const [t, setT] = useState(0)
    const [winner, setWinner] = useState({points: 0, name: ""})

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
  
              let fours = array.slice(1, 13)

              const rng = seedrandom(rand)

              for(let i = fours.length - 1; i > 0; i--){
                const j = Math.floor(rng() * (i + 1));
                [fours[i], fours[j]] = [fours[j], fours[i]]
              }
  
              fours = fours.sort(() => rand - 0.5)
  
              setSegment(fours)
          })
          .catch(error => {
            // Handle any errors
            console.error('Error fetching data:', error);
  
            setLoading(false)
          });
      }, []);

      useEffect(() => {
        setSegment(segment.sort(() => rand - 0.5))
        console.log(rand, "This is random")
      }, [rand])


    useEffect(() => {
        console.log(a, "This is the value of A")
    }, [a])

    // useEffect(() => {
    //     const fillDeck = async () => {

    //         console.log(data, "this is the data")
    //         data.map(async (photo) => {
    //             try{
    //                 await addDoc(image_cardCollectionRef, {
    //                     id_card: photo.id_card,
    //                     height: photo.height,
    //                     rotate: photo.rotate,
    //                     scale: photo.scale,
    //                     url: photo.url,
    //                     width: photo.width,
    //                     x: photo.x,
    //                     y: photo.y
    //                 })
    //             }
    //             catch(error){
    //                 console.error("this doesn't work", error)
    //             }
    //         })
    //     }
    //     getDocs(image_cardCollectionRef)
    //         .then((querySnapshot) => {
    //             const pre = querySnapshot.docs.map((doc) => ({
    //                 ...doc.data()
    //             }))
    //             if (pre.length > 0) {
    //                 console.log("Collection exists and has documents.");
    //             } else {
    //                 fillDeck();
    //         }
    //     })
    //     .catch((error) => {
    //         console.error("Error checking collection existence:", error);
    //     });
    // }, [data])







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

    let pre = ""

    const addPoints = async () => {
        const refer = ref(rt, `/lobbies/4s/${lowkey}/${auth.currentUser.uid}/points`)
        try{
            await runTransaction(refer, (currentData) => {
                console.log(lowkey)
                return currentData + 1
            })
            setB(prevB => prevB + 1)
        }
        catch(error){
            console.error("error adding points", error)
        }
    }

    const listenToTurn = async (node, callback) => {
        const refer = ref(rt, node + "/turn")
        onValue(refer, (snapshot) => {
            console.log(snapshot.val())
            if(snapshot.val() > t){
                setT(snapshot.val())
                setA(snapshot.val())
                callback()
                console.log(a, "this is the value of A")
            }
        })
    }

    listenToTurn(`lobbies/4s/${lowkey}`, async () => {
        console.log(a, "this is the value of A")
    })

    const nextTurn = async () => {
        const refer = ref(rt, `lobbies/4s/${lowkey}/turn`)
        try{
            await runTransaction(refer, (currentData) => {
                return currentData + 1
            })
        }
        catch(error){
            console.error("error adding points", error)
        }
    }

    const verificador = (link) => {
        if(link == pre){
            addPoints()
            setB(a - 1)
            nextTurn()
        }
        pre = ""
    }

    const setPre = (link) => {
        pre = link
    }
    auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in
          console.log('User is authenticated:', user);
          // You can access user information like user.uid, user.displayName, etc.
        } else {
          // User is signed out
          console.log('User is not authenticated');
          // Redirect to sign-in page or display a sign-in modal
        }
      });

    const findWinner = async () => {
        const refer = ref(rt, `lobbies/4s/${lowkey}`)
        const snapshot = await get(refer)
        snapshot.forEach((childSnap) => {
            if(childSnap.val().points > winner.points){
                setWinner(childSnap.val())
            }
        })
        try{
            await remove(refer)
        }
        catch(error){
            console.error(error)
        }
    }

    if(a == 12){
        findWinner()
        return(
            <>
                <h1 className="overScreen" >The winner is {winner.name}</h1>
            </>
        )
    }
    return(
        
        <>
            <ul className="gameList">
                <li>
                    <Card gallery={segment[a]} onButtonClick={verificador} className="center"></Card>
                </li>
                <li>
                    <Card gallery={segment[b]} className="jugador" onButtonClick={setPre}></Card>
                    <p className="player"> Player Card </p>
                </li>
            </ul>
        </>
    )
}

export default Game4
