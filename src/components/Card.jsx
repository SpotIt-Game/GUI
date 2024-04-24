import CardClass from "./cardClass"
import imgStruct from "./imgstruct"

function Card(props){
    const imgs = props.gallery.info
    const { onButtonClick } = props

    const styler = {

        backgroundColor: `transparent`,
        border: `0px solid #000`,
        cursor: `pointer`

    } 

    const CardStyler = {
        display: `grid`,
        justifyContent: `center`,
        alignItems: `center`,
        height: `400px`,
        width: `400px`,
        border: `solid  15px hsl(277, 64%, 62%)`,
        borderWidth: `10px`,
        borderRadius: `50%`,
        position: `relative`,
        top: `10px`,
        margin: `${props.styling}px`,
        backgroundColor: `rgb(230, 230, 230)`,
        transform: `scale(${props.scaler})`,

      }

    const handler = (link) => {
        onButtonClick(link, props.num)
    }

    const galleryItems = imgs.map(icon => 
        <button style={styler} onClick={() => handler(icon.url)} >
            <img src={icon.url} style={icon.styler}></img>
        </button>
    )


    return(
        <div style={CardStyler}>
            {galleryItems}

        </div>
    )
}

export default Card
