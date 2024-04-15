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
function Game4(){
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    const [segment, setSegment] = useState([]);
    const image_cardCollectionRef = collection(db, "image_card")
    const [a, setA] = useState(2);
    const [b, setB] = useState(1);
    const { lowkey } = useParams();
    const [t, setT] = useState(0)

    useEffect(() =>{

        const fetchCards = () => {

            const apiUrl = 'https://q3cgus21cj.execute-api.us-east-2.amazonaws.com/dev';
            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const slicedData = data.slice(0, 52)
                const shuffledData = slicedData.sort(() => Math.random() - 0.5)
                setData(shuffledData);
                setLoading(false)
                const processData = () => {
                    const arr = shuffledData;
                    const array = new Array(14);

                    for (let i = 0; i < 14; i++) {
                        array[i] = new CardClass();
                    }

                    for (let i = 0; i < arr.length; i++) {
                        let temp = new imgStruct(arr[i].url, arr[i].rotate, arr[i].scale, arr[i].x, arr[i].y, arr[i].width, arr[i].height);
                        array[arr[i].id_card].info.push(temp);
                    }

                    let fours = array;

                    setSegment(fours);

                };

                processData()
                
            })
            .catch(error => {
                // Handle any errors
                console.error('Error fetching data:', error);
    
                setLoading(false)
            });
        }
        getDocs(image_cardCollectionRef)
        .then((querySnapshot) => {
            const pre = querySnapshot.docs.map((doc) => ({
                ...doc.data()
            }))
            if(pre.length === 0){
                fetchCards()
            }
            else{
                const arr = pre
                const array = new Array(14)
        
                for(let i = 0; i < 14; i++){
                    array[i] = new CardClass();
                }
        
                for(let i = 0; i < arr.length; i++){
                    let temp = new imgStruct(arr[i].url, arr[i].rotate, arr[i].scale, arr[i].x, arr[i].y, arr[i].width, arr[i].height)
                    array[arr[i].id_card].info.push(temp)
                }
    
                let fours = array
    
                setSegment(fours)
                setLoading(false)
                console.log(segment)
            }
            
        })
    }, []);

    useEffect(() => {
        console.log(a, "This is the value of A")
    }, [a])

    useEffect(() => {
        const fillDeck = async () => {

            console.log(data, "this is the data")
            data.map(async (photo) => {
                try{
                    await addDoc(image_cardCollectionRef, {
                        id_card: photo.id_card,
                        height: photo.height,
                        rotate: photo.rotate,
                        scale: photo.scale,
                        url: photo.url,
                        width: photo.width,
                        x: photo.x,
                        y: photo.y
                    })
                }
                catch(error){
                    console.error("this doesn't work", error)
                }
            })
        }
        getDocs(image_cardCollectionRef)
            .then((querySnapshot) => {
                const pre = querySnapshot.docs.map((doc) => ({
                    ...doc.data()
                }))
                if (pre.length > 0) {
                    console.log("Collection exists and has documents.");
                } else {
                    fillDeck();
            }
        })
        .catch((error) => {
            console.error("Error checking collection existence:", error);
        });
    }, [data])




    const deleteData = async () => {
        try{
            const inf = await getDocs(image_cardCollectionRef)
            inf.docs.map((single) => {
                deleteDoc(single.ref)
            })
        }
        catch(err){
            console.error(err)
        }
    }


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

    if(a == 14){
        return(
            <>
                <h1 className="overScreen" >Game over</h1>
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
