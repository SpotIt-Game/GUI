import cslogo from '../assets/cslogo.png'
import logo from '../assets/logo.png'

function BackCS(){
    return(
        <button className='csCardBack' onClick={() => window.location.href = '/difficulty/cs'}>
            <img className='node' src={cslogo}></img>
            <img className='logo' src={logo}></img>
            <p className='text'>Computer Science Edition</p>
        </button>
    )
}

export default BackCS
