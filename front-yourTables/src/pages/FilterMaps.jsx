import { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';


const apiKeyMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export const FilteredMapView = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKeyMaps,
    libraries: ['places'],
    language: 'es',
  });

  const [individuos, setIndividuos] = useState([]);
  const [filtroEstadoCivil, setFiltroEstadoCivil] = useState('Todos');
  const [individuosFiltrados, setIndividuosFiltrados] = useState([]);

  useEffect(() => {
    // Obtener los datos del backend
    fetch('http://localhost:8000/individuo')
      .then(response => response.json())
      .then(data => setIndividuos(data))
      .catch(error => console.error('Error al obtener los individuos:', error));
  }, []);

  useEffect(() => {
    // Filtrar los individuos según el estado civil seleccionado
    if (filtroEstadoCivil === 'Todos') {
      setIndividuosFiltrados(individuos);  // Si es "Todos", mostrar todos los individuos
    } else {
      const filtrados = individuos.filter(individuo => individuo.estadoCivil === filtroEstadoCivil);
      setIndividuosFiltrados(filtrados);
    }
  }, [filtroEstadoCivil, individuos]);

  const handleFiltroChange = (e) => {
    setFiltroEstadoCivil(e.target.value);
  };

  if (loadError) return <p>Error al cargar el mapa</p>;
  if (!isLoaded) return <p>Cargando mapa...</p>;

  return (
    <div className="map-filter-container">
      <h1>Mapa de Individuos</h1>
      
      <div className="filtro-container">
        <label htmlFor="estadoCivil">Filtrar por Estado Civil:</label>
        <select id="estadoCivil" value={filtroEstadoCivil} onChange={handleFiltroChange}>
          <option value="Todos">Todos</option>
          <option value="Soltero">Soltero</option>
          <option value="Casado">Casado</option>
          <option value="Viudo">Viudo</option>
          <option value="Divorciado">Divorciado</option>
        </select>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={{ lat: -26.1849, lng: -58.1731 }}  // Centro inicial del mapa
      >
        {individuosFiltrados.map((individuo) => (
          <Marker
            key={individuo.id}
            position={{
              lat: individuo['ubicacion.latitud'],
              lng: individuo['ubicacion.longitud'],
            }}
            title={`${individuo.nombre} ${individuo.apellido}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
};