import CardClass from "./cardClass"
import imgStruct from "./imgstruct"

function Card(props){
    const imgs = props.gallery.info

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
        top: `${props.styling}px`,
        margin: `0 auto`,
        backgroundColor: `rgb(230, 230, 230)`,
        transform: `scale(0.68)`,

      }

    const galleryItems = imgs.map(icon => 
        <button style={styler} onClick={()=> console.log(icon.url)}>
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