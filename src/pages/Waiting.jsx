import { auth } from "../firebase/config"
import { rt } from "../firebase/config"
import { child, ref, onValue, set, query, get, remove, update, push, runTransaction} from "firebase/database";
import { useEffect } from "react";
import { async } from "@firebase/util";
import { useState } from "react";


function Waiting(){
    let pathKey = ""
    let rando = 0
    const [inLobby, setInLobby] = useState(false)
    const [LobbyKey, setLobbyKey] = useState("testing...")
    let checker = false


    const addLobby = async () => {
        if(checker == true){
            return
        }
        checker = true

        const newLobbyRef = ref(rt, '/lobbies/4s')
        const newLobby1Ref = await push(newLobbyRef)
        setLobbyKey(newLobby1Ref.key)
        pathKey = newLobby1Ref.key
        console.log(pathKey)
        rando = Math.random()
        rando = Math.floor(rando * (1000000)) + 1
        await set(newLobby1Ref, {
            start: false,
            turn: 1,
            srtFact: rando
        })
        addPlayerToLobby(`/lobbies/4s/${newLobby1Ref.key}`)
        setInLobby(true)
    }

    const startGame = async (path) => {
        const refer = ref(rt, path + '/start')
        try{
            await runTransaction(refer, (currentData) => {
                return true
            })
        }
        catch(error){
            console.error(error)
        }

    }

    const addPlayerToLobby = async (path) => {
        const refer = ref(rt, path)
        try{
            await update(refer, {
                [auth.currentUser.uid]: {
                    points: 0,
                    name: auth.currentUser.uid
                } 
            })
            listenToStart(path, goToGame)
        }
        catch(error){
            console.error(error)
        }
        try{
            if((await get(refer)).size === 5){
                startGame(path)
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
            snapshot.forEach((childSnapshot) => {
                if(childSnapshot.val().start == false){
                    setLobbyKey(childSnapshot.key)
                    pathKey = childSnapshot.key
                    rando = childSnapshot.val().srtFact
                    console.log(pathKey)
                    addPlayerToLobby(`/${NodeDir}/${childSnapshot.key}`, snapshot.size)
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

    const deleteData = async () => {
        const refer = ref(rt, "/lobbies/4s/" + LobbyKey)
        try{
            await remove(refer)
            console.log("updated?")
        }
        catch(error){
            console.error("Problems deleting", error)
        }
    }

    const useEffectWithAsync = async () => {
        if (await checkEmpty("lobbies/4s")) {
            await addLobby();
            checker = true;
        }
        else if(!inLobby){
            findLobby("lobbies/4s")
            setInLobby(true)
        }
    };


    const goToGame = () => {
        console.log(pathKey)
        const url = `/game4/${pathKey}/${rando}`
        console.log(url)
        window.location.href = url;
    };

    const listenToStart = async (node, callback) => {
        const refer = ref(rt, node + "/start")
        onValue(refer, (snapshot) => {
            console.log(snapshot.val())
            if(snapshot.val() == true){
                callback()
            }
        })
    }

    const addPoints = async () => {
        const refer =  ref(rt, `/lobbies/4s/${pathKey}/${auth.currentUser.uid}/points`)
        try{
            await runTransaction(refer, (currentData) => {
                console.log(pathKey)
                return currentData + 1
            })
        }
        catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        useEffectWithAsync()
    }, []);




    return(
        <>
            <h1 className="waiting" >this is the testing faze</h1>
            <button onClick={deleteData}>DeleteData</button>
            <button onClick={addPoints}>AddPoints</button>

        </>
    )
}





export default Waiting