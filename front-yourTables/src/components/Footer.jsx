import { FaXTwitter } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io5";
import { FaFacebookSquare } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './css/Footer.css';


export function Footer(){
    return(
        <div id='caja-footer'>
          <Link ><div className='social-icon'><CgMail /></div></Link>
          <Link ><div className='social-icon'><FaWhatsapp /></div></Link>
          <p>© PorSiempreCompañero - Todos los derechos reservados.</p>
        </div>
        

    )
};