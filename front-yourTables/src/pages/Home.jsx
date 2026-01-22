import './css/Home.css';
import tablas from '../assets/tablasrela.jpg';
import maps from '../assets/maps.jpg';
import usuarios from '../assets/USERS.jpg';
import imgGrafico from '../assets/results2.jpg';

import { Link } from 'react-router-dom';

import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { useTablesStore } from '../hooks/useTableStore.js';

export const Home = () => {

  const { activeUsuarios } = useTablesStore();

  return (
    <>
      <div id='box-body-main-home'>
        <Header />

        <div id='box-main-home'>

          <div id='first-box' className='fourBoxes'>
            <img src={tablas} alt="" />
            <Link to='/tables'>Ver Datos</Link>
          </div>
          <div id='second-box' className='fourBoxes'>
            <img src={maps} alt="" />
            <Link to='/maps'>Utilizar Mapa</Link>
          </div>
          <div id='third-box' className='fourBoxes'>
            <img src={usuarios} alt="" />
            <Link to='/users-admin' onClick={activeUsuarios}>
              Administrar Usuarios
            </Link>
          </div>
          <div id='quarter-box' className='fourBoxes'>
            <img src={imgGrafico} alt="" />
            <Link to='/'>Ver Resultados</Link>
          </div>


        </div>

        <Footer />
      </div>
    </>
  )
}
