import { auth } from "../firebase/config"
import { createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { useState } from "react"

function Auth(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const signIn = async() => {
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            window.location.href = '/home'
        }
        catch(error){
            console.log(error)
        }
    }
    return (
        <>
        <ul className="authList">
            <li>
                <input className="emailin" placeholder="Email..." onChange={(e) => setEmail(e.target.value)}/>
            </li>
            <li>
                <input className="passin" placeholder="Password..." type="password" onChange={(e) => setPassword(e.target.value)}/>
            </li>
        </ul> 
        <button className="signButt" onClick={signIn}>Sign in</button>
        </>

        
        
    )
}

export default Auth