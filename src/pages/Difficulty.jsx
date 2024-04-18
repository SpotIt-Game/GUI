import PlainCard from "../components/PlainCard"
import { useParams } from "react-router-dom"

function Difficulty(){
    
    const { edition } = useParams()
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
            <h1 style={styler}>Choose Difficulty</h1>
            <ul className="diflist">
                <li>
                    <PlainCard text={"4"} tsize={200} page= {`/modes/${edition}/4`}></PlainCard>
                </li>
                <li>
                    <PlainCard text="5" tsize={200} page= {`/modes/${edition}/5`}/>
                </li>
                <li>
                    <PlainCard text="6" tsize={200} page= {`/modes/${edition}/6`}/>
                </li>
                <li>
                    <PlainCard text="8" tsize={200} page= {`/modes/${edition}/8`}/>
                </li>
                <li>
                <PlainCard text="9" tsize={200} page= {`/modes/${edition}/9`}/>
                </li>
            </ul>

        </>
    )
}

export default Difficulty
