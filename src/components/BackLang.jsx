import cslogo from '../assets/langlogo.png'
import logo from '../assets/logo.png'

function BackLang(){
    return(
        <button className='langCardBack' onClick={() => window.location.href = '/difficulty/lang'}>
            <img className='node' src={cslogo}></img>
            <img className='logo' src={logo}></img>
            <p className='text'>Programming Language Edition</p>
        </button>
    )
}

export default BackLang
