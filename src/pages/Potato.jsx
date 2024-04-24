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
function Potato(){
    const [Pcount, setPcount] = useState(0);
    const [pNum, setPNum] = useState(0);
    const [data, setData] = useState(null); // Declare state variable and its setter function
    const [loading, setLoading] = useState(true);
    const [segment, setSegment] = useState([]);
    const image_cardCollectionRef = collection(db, "image_card")
    const [a, setA] = useState(1);
    const [b, setB] = useState(0);
    const { lowkey, rand, edition,  lvl } = useParams();
    const [t, setT] = useState(0)
    const [winner, setWinner] = useState({points: 0, name: ""})
    const [currSlice, setCurrSlice] = useState([])

    const [cardList, setCardList] = useState()
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
            const refer = ref(rt, `/lobbies/${edition}/${lvl}s/potato/${lowkey}/pCount`);
            setPcount((await get(refer)).val())
            const pref = ref(rt, `/lobbies/${edition}/${lvl}s/potato/${lowkey}/players/${auth.currentUser.uid}/pos`);
            setPNum((await get(pref)).val())


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
            const refer = ref(rt, `/lobbies/${edition}/${lvl}s/potato/${lowkey}/pCount`);
            console.log(Pcount, "WTF")
            console.log(pNum, "p number")
            setLoading(false);
            const pref = ref(rt, `/lobbies/${edition}/${lvl}s/potato/${lowkey}/${auth.currentUser.uid}/pos`);

        }
        waiter()
}, [])    

    useEffect(() =>{
        setCurrSlice(segment.slice(0, Pcount))
    }, [segment])


    useEffect(() =>{
            setCardList(currSlice.map((current, index) => {
            console.log(index, pNum)
            if(index + 1 == pNum){
                return(
                    <li>
                        <Card scaler={0.6} gallery={current} num = {index} onButtonClick={verificador}></Card>
                        <p className='player'> Player Card </p>                 
                    </li>
                )
            }
            else{
                return(
                    <li>
                        <Card scaler={0.6} gallery={current} num = {index} onButtonClick={verificador}></Card>
                    </li>
                )
            }
        }))
        console.log(currSlice, "This is currSlice")
            


    }, [currSlice])


      useEffect(() => {
        setSegment(segment.sort(() => rand - 0.5))
        console.log(rand, "This is random")
      }, [rand])


    useEffect(() => {
        console.log(a, "This is the value of A")
    }, [a])






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
    let cnum = -1

    const addPoints = async () => {
        const refer = ref(rt, `/lobbies/${edition}/${lvl}s/potato/${lowkey}/players/${auth.currentUser.uid}/points`)
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
                setCurrSlice(segment.slice(Pcount * t, Pcount * snapshot.val()))
                setT(snapshot.val())
                setA(snapshot.val())
                callback()
                console.log(a, "this is the value of A")
            }
        })
    }

    listenToTurn(`lobbies/${edition}/${lvl}s/potato/${lowkey}`, async () => {
        console.log(a, "this is the value of A")
    })

    const nextTurn = async () => {
        const refer = ref(rt, `lobbies/${edition}/${lvl}s/potato/${lowkey}/turn`)
        try{
            await runTransaction(refer, (currentData) => {
                return currentData + 1
            })
        }
        catch(error){
            console.error("error adding points", error)
        }
    }

    const verificador = (link, num) => {
        if(link == pre && num + 1 != cnum && (num + 1 == pNum || cnum == pNum)){
            link = ""
            num = -1
            addPoints()
            nextTurn()
        }
        else{
            pre = link;
            cnum = num
        }
    }


    const findWinner = async () => {
        const refer = ref(rt, `lobbies/${edition}/${lvl}s/potato/${lowkey}/players`)
        const lobRef = ref(rt, `lobbies/${edition}/${lvl}s/potato/${lowkey}`)
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

    if(a * Pcount >= end - start){
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
                {cardList}
            </ul>
        </>
    )
}

export default Potato
