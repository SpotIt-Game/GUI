
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
function Triplet(){
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    const [segment, setSegment] = useState([]);
    const image_cardCollectionRef = collection(db, "image_card")
    const [cardList, setCardList] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8])
    const { lowkey, rand, edition,  lvl } = useParams();
    const [t, setT] = useState(0)
    const [winner, setWinner] = useState({points: 0, name: ""})
    let used = [];
    let links = [];
    let start = 0;
    let end = 0;
    if(lvl == 4 && edition == 'cs'){
        start = 1;
        end = 13;
    }
    else if(lvl == 5 && edition == 'cs'){
        start = 14;
        end = 34;
    }
    else if(lvl == 6 && edition == 'cs'){
        start = 35;
        end = 65;
    }
    else if(lvl == 8 && edition == 'cs'){
        start = 66;
        end = 122; 
    }
    else if(lvl == 9 && edition == 'cs'){
        start = 123;
        end = 196;
    }
    else if(lvl == 4 && edition == 'lang'){
        start = 196;
        end = 208;
    }
    else if(lvl == 5 && edition == 'lang'){
        start = 209;
        end = 229;
    }
    else if(lvl == 6 && edition == 'lang'){
        start = 230;
        end = 260;
    }
    else if(lvl == 8 && edition == 'lang'){
        start = 261;
        end = 317;
    }
    else if(lvl == 9 && edition == 'lang'){
        start = 318;
        end = 390;
    }
    console.log("This is the edition", edition)

    useEffect(() => {
        const apiUrl = 'https://q3cgus21cj.execute-api.us-east-2.amazonaws.com/dev'
        const fetchData = async () => {
            try{
                const response = await fetch(apiUrl)
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                const dt = await response.json()
                setData(dt)
                const arr = dt
                const array = new Array(391)

                for(let i = 0; i < 391; i++){
                    array[i] = new CardClass()
                }

                for(let i = 0; i < arr.length; i++){
                    let temp = new imgStruct(arr[i].url, arr[i].rotate, arr[i].scale, arr[i].x, arr[i].y, arr[i].width, arr[i].height)
                    array[arr[i].id_card].info.push(temp)
                }

                let fours = array.slice(start, end)
                const rng = seedrandom(rand)

                for(let i = fours.length - 1; i > 0; i-- ){
                    const j = Math.floor(rng() * (i + 1));
                    [fours[i], fours[j]] = [fours[j], fours[i]]
                }
                fours = fours.sort(() => rand - 0.5)

                setSegment(fours)
            }
            catch(error){
                console.error("Network Reponse was not ok")
        }
    }
        const waiter = async () => {
            await fetchData();
            setLoading(false);
        }
        waiter()
}, [])

      useEffect(() => {
        setSegment(segment.sort(() => rand - 0.5))
        console.log(rand, "This is random")
      }, [rand])


    useEffect(() => {
        console.log(cardList, "Card list")
    }, [cardList])
    




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
        const refer = ref(rt, `/lobbies/${edition}/${lvl}s/triplet/${lowkey}/players/${auth.currentUser.uid}/points`)
        try{
            await runTransaction(refer, (currentData) => {
                console.log(lowkey)
                return currentData + 1
            })
        }
        catch(error){
            console.error("error adding points", error)
        }
    }

    const listenToDeck = async (node, callback) => {
        const refer = ref(rt, node + "/deck")
        await onValue(refer, (snapshot) => {
            console.log(snapshot.val())
            const isEqual = JSON.stringify(cardList) === JSON.stringify(snapshot.val());
            console.log(isEqual)
            if(!isEqual){
                setCardList(snapshot.val())
                callback()
            }
        })
    }

    listenToDeck(`lobbies/${edition}/${lvl}s/triplet/${lowkey}`, async () => {
    })

    const listenToTurn = async (node, callback) => {
        const refer = ref(rt, node + "/turn")
        await onValue(refer, (snapshot) => {
            console.log(snapshot.val(), "this is snappyWappy")
            console.log(t, "this is t")
            if(snapshot.val() > t){
                setT(snapshot.val())
                callback()
            }
        })
    }

    listenToTurn(`lobbies/${edition}/${lvl}s/triplet/${lowkey}`, async () => {
    })
    const nextTurn = async () => {
        const refer = ref(rt, `lobbies/${edition}/${lvl}s/triplet/${lowkey}/turn`)
        try{
            const snapshot = await runTransaction(refer, (currentData) => {
                return currentData + 3
            })
        }
        catch(error){
            console.error("error adding points", error)
        }
    }
    const updateDeck = async () => {
        const refer = ref(rt, `lobbies/${edition}/${lvl}s/triplet/${lowkey}/deck`)
        const tref = ref(rt, `lobbies/${edition}/${lvl}s/triplet/${lowkey}/turn`)
        const snapshot = await get(refer)
        let snap = snapshot.val()
        const turno = await get(tref)
        const p = turno.val()
        console.log(snap, "This is snap")
        setT(p)
        console.log(snap[used[0]])
        snap[used[0]] = p - 3;
        snap[used[1]] = p - 2;
        snap[used[2]] = p - 1;
        try{
            await set(refer, snap)
        }
        catch(error){
            console.log("Use update instead")
        }



    }

    const verificador = async (link, number) => {
        if(used.includes(number)){
            links = [link];
            used = [number];
        }
        else{
            if(links != [] && !links.includes(link)){
                links = [link];
                used = [number];
            }
            else{
                links.push(link);
                used.push(number);
            }
            if(links.length == 3){
                await addPoints();
                await nextTurn();
                await updateDeck();
                links = [];
                used = [];
            }
        }
    }




    const findWinner = async () => {
        const refer = ref(rt, `lobbies/${edition}/${lvl}s/triplet/${lowkey}/players`)
        const lobRef = ref(rt, `lobbies/${edition}/${lvl}s/triplet/${lowkey}`)
        const snapshot = await get(refer)
        snapshot.forEach((childSnap) => {
            if(childSnap.val().points > winner.points){
                setWinner(childSnap.val())
            }
        })
        try{
            await remove(lobref)
        }
        catch(error){
            console.error(error)
        }
    }

    if(t >= end - start){
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
                    <Card scaler={0.6} gallery={segment[cardList[0]]} num={0} styling={-80} onButtonClick={verificador} ></Card>
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[1]]} num={1} styling={-80} onButtonClick={verificador}></Card>
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[2]]} num={2} styling={-80} onButtonClick={verificador} />
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[3]]} num={3} styling={-80} onButtonClick={verificador} />
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[4]]} num={4} styling={-80} onButtonClick={verificador} />
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[5]]} num={5} styling={-80} onButtonClick={verificador} />
                </li>
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[6]]} num={6} styling={-80} onButtonClick={verificador} />
                </li>
                 <li>
                    <Card scaler={0.6} gallery={segment[cardList[7]]} num={7} styling={-80} onButtonClick={verificador} />
                </li>               
                <li>
                    <Card scaler={0.6} gallery={segment[cardList[8]]} num={8} styling={-80} onButtonClick={verificador} />
                </li>
            </ul>
        </>
    )
}

export default Triplet
