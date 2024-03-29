function PlainCard(props){

    const styler = {
        display: `flex`,
        width: `420px`,
        height: `420px`,
        borderRadius: `50%`,
        border: `solid  15px hsl(277, 64%, 62%)`,
        backgroundColor: `hsl(56, 100%, 50%)`,
        scale: `0.5`,
        position: `relative`,
        cursor: `pointer`  
    }

    const textStyle = {
        display: `grid`,
        color: `hsl(277, 64%, 62%)`,
        fontFamily: `"Boink Drop Shadow W01", Arial, Helvetica, sans-serif`,
        justifyContent: `center`,
        alignItems: `center`,
        position: `relative`,
        fontSize: `200px`,
        textAlign: `center`,
        top: `-100px`,
        left: `100px`, 
    }



    return(
        <>
            <button style={styler} onClick={() => window.location.href = props.page}>
                <h1 style={textStyle}>{props.text}</h1>
            </button>
        </>
    )
}

export default PlainCard