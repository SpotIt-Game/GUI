import PlainCard from "../PlainCard"

function Difficulty(){

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
                    <PlainCard text={"4"} page="/game"></PlainCard>
                </li>
                <li>
                    <PlainCard text="5" page="/game"/>
                </li>
                <li>
                    <PlainCard text="6" page="/game"/>
                </li>
                <li>
                    <PlainCard text="8"  page="/game"/>
                </li>
                <li>
                <PlainCard text="9"  page="/game"/>
                </li>
            </ul>

        </>
    )
}

export default Difficulty