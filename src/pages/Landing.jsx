import logo from "../assets/logo.png"
import Auth from "../components/Auth"
import { db } from "../firebase/config"
import { getDocs, collection, addDoc, deleteDoc} from "firebase/firestore";

function Landing(){
    const image_cardCollectionRef = collection(db, "image_card")


    return(
        <>
            <div className="homeLogo">
                <img src={logo}></img>
                
            </div>
            <div className="authText">
                <h1>Please Sign in to play!</h1>
            </div>
            <div className="signIn">
                <Auth/>
            </div>
        </>
    )
}

export default Landing