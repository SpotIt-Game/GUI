import BackCS from "../BackCS"
import BackLang from "../BackLang"

function Home(){
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
            <h1 style={styler}>Choose Edition! </h1>
            <ul className="homelist">
                <li>
                    <BackCS></BackCS>
                </li>
                <li>
                    <BackLang></BackLang>
                </li>

            </ul>
        </>
    )
}

export default Home