import { useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './css/AddUbiPrueba.css';

const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export const AddUbiPrueba = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKeyMaps,
    libraries: ['places'],
    language: 'es',
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    fechaNacimiento: '',
    sexo: 'Masculino',
    estadoCivil: 'Soltero',
    ocupacion: '',
    direccion: '',
    ubicacion: {
      latitud: '',
      longitud: ''
    }
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const onMapClick = (event) => {
    const latitud = event.latLng.lat();
    const longitud = event.latLng.lng();
    setSelectedLocation({ latitud, longitud });


    setFormData({
      ...formData,
      ubicacion: {
        latitud,
        longitud
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/individuo/with-ubi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Datos enviados con éxito:', data);
        alert('Individuo registrado exitosamente');
      })
      .catch((error) => {
        console.error('Error al enviar los datos:', error);
        alert('Error al registrar el individuo');
      });
  };

  if (loadError) return <p>Error al cargar el mapa</p>;
  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div className="add-ubi-container">
      <h1 className='title-individuo'>Agregar Individuo</h1>
      <form onSubmit={handleSubmit} className="add-ubi-form">
        <div className="form-group">
          <label className='label-form'>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className='label-form'>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className='label-form'>DNI:</label>
          <input
            type="number"
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className='label-form'>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className='label-form'>Sexo:</label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleInputChange}
            required
          >
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </div>
        <div className="form-group">
          <label className='label-form'>Estado Civil:</label>
          <select
            name="estadoCivil"
            value={formData.estadoCivil}
            onChange={handleInputChange}
            required
          >
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Viudo">Viudo</option>
            <option value="Divorciado">Divorciado</option>
          </select>
        </div>
        <div className="form-group">
          <label className='label-form'>Ocupación:</label>
          <input
            type="text"
            name="ocupacion"
            value={formData.ocupacion}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className='label-form'>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
        </div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={selectedLocation || { lat: -26.1849, lng: -58.1731 }}
          onClick={onMapClick}
        >
          {selectedLocation && (
            <Marker position={{ lat: selectedLocation.latitud, lng: selectedLocation.longitud }} />
          )}
        </GoogleMap>

        <button type="submit" className="submit-button">Guardar Individuo</button>
      </form>
    </div>
  );
};