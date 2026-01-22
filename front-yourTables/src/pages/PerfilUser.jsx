import { Footer } from "../components/Footer"
import { Header } from "../components/Header"
import { useSelector, useDispatch } from 'react-redux';

import avatar from '../assets/avatar2.jpg';
import './css/PerfilUser.css'

export const PerfilUser = () => {

    const { user } = useSelector(state => state.auth);

    return (
        <div className="box-body-perfil-user">

            <Header />

            <div className="box-padre-main-perfil-user">


                <div id='box-header-perfil-img'>
                    <img src={avatar} alt="" />
                    <p>{user.nombre} {user.apellido}</p>
                </div>

                <div id='box-body-perfil-user-datos'>
                    {/* <p>Correo Electrónico: {user.correoElectronico}</p> */}
                </div>

            </div>

            <Footer />
        </div>
    )
}