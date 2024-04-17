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
                    <PlainCard text={"4"} page= {`/wait/4/${edition}`}></PlainCard>
                </li>
                <li>
                    <PlainCard text="5" page= {`/wait/5/${edition}`}/>
                </li>
                <li>
                    <PlainCard text="6" page= {`/wait/6${edition}`}/>
                </li>
                <li>
                    <PlainCard text="8"  page= {`/wait/8/${edition}`}/>
                </li>
                <li>
                <PlainCard text="9"  page= {`/wait/9/${edition}`}/>
                </li>
            </ul>

        </>
    )
}

export default Difficulty
