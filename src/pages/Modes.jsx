import PlainCard from "../components/PlainCard.jsx"
import { useParams } from "react-router-dom"

function Modes(){
    const { edition, lvl } = useParams()
    const styler = {
        display: `grid`,
        textAllign: `center`,
        color: `hsl(56, 100%, 50%)`,
        fontFamily: `"Boink Drop Shadow W01", Arial, Helvetica, sans-serif`,
        justifyContent: `center`,
        alignItems: `center`
    }
    return(
    <>
            <h1 style={styler} >Choose Game Mode!</h1>
            <ul className="diflist">
                <li>
                    <PlainCard text={"Tower"} page= {`/wait/${edition}/${lvl}/tower`} tsize={100}></PlainCard>
                </li>
                <li>
                    <PlainCard text={"Triplet"} page= {`/wait/${edition}/${lvl}/triplet`} tsize={80}></PlainCard>
                </li>
                <li>
                    <PlainCard text={"Well"} page = {`/wait/${edition}/${lvl}/well`} tsize={100}></PlainCard>
                </li>
                <li>
                    <PlainCard text={"H.Potato"} page = {`/wait/${edition}/${lvl}/potato`} tsize={80}></PlainCard>
                </li>
                <li>
                    <PlainCard text={"Poison"} page = {`/wait/${edition}/${lvl}/poison`} tsize={100}></PlainCard>
                </li>

            </ul>
    </>
    )



}

export default Modes
