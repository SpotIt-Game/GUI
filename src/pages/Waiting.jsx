import { auth } from "../firebase/config"
import { rt } from "../firebase/config"
import { child, ref, onValue, set, query, get, remove, update, push, runTransaction, } from "firebase/database";
import { useEffect } from "react";
import { async } from "@firebase/util";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Waiting(){
    let pathKey = ""
    let rando = 0
    const [activer, setActiver] = useState(false)
    const [inLobby, setInLobby] = useState(false)
    const [LobbyKey, setLobbyKey] = useState("testing...")
    const { edition, diff, mode } = useParams()
    const [creator, setCreator] = useState(false)
    const [finder, setFinder] = useState(false)
    let checker = false
    let limit = 6;
    let pNum = 0;



    const addLobby = async () => {
        if(checker == true){
            return
        }
        checker = true

        const newLobbyRef = ref(rt, `/lobbies/${edition}/${diff}s/${mode}`)
        const newLobby1Ref = await push(newLobbyRef)
        setLobbyKey(newLobby1Ref.key)
        pathKey = newLobby1Ref.key
        console.log(pathKey)
        rando = Math.random()
        rando = Math.floor(rando * (1000000)) + 1
        if(mode == "triplet"){
            await set(newLobby1Ref, {
                start: false,
                turn: 9,
                deck: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                srtFact: rando
            })
        }
        else if(mode == "tower"){
            await set(newLobby1Ref, {
                start: false,
                turn: 1,
                srtFact: rando
            })
        }
        else if(mode == "potato"){
            await set(newLobby1Ref, {
                start: false,
                turn: 1,
                srtFact: rando,
                pCount: 0
            })
        }
        else if(mode == "poison"){
            await set(newLobby1Ref, {
                start: false,
                turn: 1,
                srtFact: rando,
                pCount: 0,
                cards: [0]
            })
        }
        else if(mode == "well"){
            await set(newLobby1Ref, {
                start: false,
                turn: 1,
                srtFact: rando,
                pCount: 0,
                middCard: 0
            })
        }
        addPlayerToLobby(`/lobbies/${edition}/${diff}s/${mode}/${newLobby1Ref.key}`)
        setCreator(true)
        setInLobby(true)
    }

    const startGame = async () => {
        const refer = ref(rt, `/lobbies/${edition}/${diff}s/${mode}/${LobbyKey}`);
        try {
            await update(refer, { start: true });
        } catch (error) {
            console.error(error);
        }
    };
    

    const addPlayerToLobby = async (path) => {
        const refer = ref(rt, path + "/players")
        const lobref = ref(rt, path);
        const pRef = ref(rt, path +"/pCount")
        const dq = query(pRef)
        const pre = (await get(dq))
        let ac = 0
        if(!(await pre.exists())){
            ac = 0
        }
        else{
            ac = pre.val()
            pNum = ac + 1;
        }
        try{
            if(mode == "poison"){
                await update(refer, {
                    [ac + 1]: {
                        points: 0,
                        name: auth.currentUser.uid
                    }
                })
            }
            else{

                await update(refer, {
                    [auth.currentUser.uid]: {
                        points: 0,
                        name: auth.currentUser.uid
                    } 
                })
            }
            if(mode == 'potato' || mode == "well"){
                const pc = (await get(refer)).size
                await update(lobref, {
                    pCount: pc
                })
                await update(refer, {
                    [auth.currentUser.uid]: {
                        points: 0,
                        name: auth.currentUser.uid,
                        pos: pc
                    }
                })
                

            }
            if(mode == "poison"){
                const pc = (await get(refer)).size
                await update(lobref, {
                    pCount: pc
                })
                const cRef = ref(rt, path + "/cards")
                const pre = (await get(cRef)).val()
                console.log(pre, "this is the cardList")
                pre.push(ac + 1)
                await update(lobref, {
                    cards: pre
                })
            }
            listenToStart(path, goToGame)
        }
        catch(error){
            console.error(error)
        }
        try{
            if((await get(refer)).size == limit){
                startGame()
            }
        }
        catch(error){
            console.error(error)
        }
    }

    const findLobby = async (NodeDir) => {
        const refer = ref(rt, `/${NodeDir}`)
        try {
            const snapshot = await get(refer)
            snapshot.forEach(async (childSnapshot) => {
                if(childSnapshot.val().start == false){
                    setLobbyKey(childSnapshot.key)
                    pathKey = childSnapshot.key
                    rando = childSnapshot.val().srtFact
                    console.log(pathKey)
                    await addPlayerToLobby(`/${NodeDir}/${childSnapshot.key}`, snapshot.size)
                    setInLobby(true)
                    return
                }
            })
        }
        catch(error){
            console.error("Error going over lobbies", error)
        }
    }

    const checkEmpty = async (path) => {
        try{
            const directoryRef = ref(rt, path)

            const dataQuery = query(directoryRef)

            const snapshot = await get(dataQuery)

            return !snapshot.exists()
        }
        catch(error){
            console.error("problems", error)
            return false
        }
    }

    const useEffectWithAsync = async () => {
        if (await checkEmpty(`lobbies/${edition}/${diff}s/${mode}`)) {
            await addLobby();
            checker = true;
        }
        else if(!inLobby){
            await findLobby(`lobbies/${edition}/${diff}s/${mode}`)
            setInLobby(true)
        }
    };


    const goToGame = () => {
        if(mode == "poison" || mode == "well"){
            const url = `/${mode}/${pathKey}/${rando}/${edition}/${diff}/${pNum}`
            window.location.href = url;
            return;
        }
        console.log(pathKey)
        const url = `/${mode}/${pathKey}/${rando}/${edition}/${diff}`

        console.log(url)
        window.location.href = url;
    };

    const listenToStart = async (node, callback) => {
        const refer = ref(rt, node + "/start")
        onValue(refer, (snapshot) => {
            if(snapshot.val() == true){
                callback()
            }
        })
    }

    const joiner = async () => {
        const lo = `lobbies/${edition}/${diff}s/${mode}/${LobbyKey}`
        pathKey = LobbyKey
        console.log(lo)
        const refer = ref(rt, lo)
        const dataQuery = query(refer)
        const snapshot = await get(dataQuery)
        if(snapshot.exists()){
            rando = snapshot.val().srtFact
            addPlayerToLobby(lo)
            setActiver(true)
        }



    }


    const finding = () =>{
        setFinder(true)
    }
    if(activer){
        return(
            <>
                <h1 className="creMes">Waiting for game to start</h1>
            </>
        )
    }

    if(creator){
        return(
            <>
                <h1 className="creMes">Share this key with your friends!</h1>
                <h1 className="LobKey"> {LobbyKey} </h1>
                <div className="inpLob">
                    <button className = "LobJoin" onClick={startGame}>Start Game!</button>

                </div>
            </>
        )
    }

    if(finder){
        return(
            <>
                <h1 className="creMes">Paste the game code in the text box</h1>
                <div className="inpLob">
                    <input className="LobIn" placeholder="LobbyKey" onChange={(e) => setLobbyKey(e.target.value)}/>
                    <button className="LobJoin" onClick={joiner}>Join Lobby!</button>
                </div>
            </>
        )
    }





    return(
        <>
            <ul className="optList">
                <li>
                    <button onClick={addLobby} className="optButts"> Create Game</button>
                </li>
                <li>
                    <button onClick={finding} className="optButts">Join Game</button>
                </li>
            </ul>

        </>
    )
}





export default Waiting
