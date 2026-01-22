
export const collectionFields = {
    personas: [
        '_id', 'nombre', 'apellido', 'dni', 'sexo', 'fechaNacimiento', 'estadoCivil', 'localidad',
        'paisNacimiento', 'provinciaNacimiento', 'ciudadNacimiento', 'direccion', 'ocupacion',
        'barrio', 'numeroTelefono', 'cargo', 'votaPor', 'ubicacion', 'jurisdiccion'
    ],
    instituciones: [
        '_id', 'nombreInstitucion', 'encargadoODirector', 'localidad', 'barrio',
        'direccion', 'ubicacion', 'jurisdiccion'
    ],
    acciones: [
        '_id', 'nombreAccion', 'colorMarcador'
    ],
    eventos: [
        '_id', 'accion', 'organizadorDelEvento', 'fecha', 'localidad', 'barrio', 'direccion',
        'detalle', 'beneficiariosOAsistentes', 'ubicacion', 'archivos', 'jurisdiccion'
    ],
    coordinadores: [
        '_id', 'persona', 'jurisdiccionACargo', 'personasACargo', 'estado', 'fechaDesde', 'fechaHasta'
    ],
    dirigentes: [
        '_id', 'persona', 'barriosACargo', 'personasACargo', 'superioresACargo', 'estado', 'fechaDesde', 'fechaHasta'
    ],
    adherentes: [
        '_id', 'persona', 'barriosACargo', 'superioresACargo', 'estado', 'fechaDesde', 'fechaHasta'
    ],
    localidades: [
        '_id', 'nombreLocalidad', 'departamento'
    ],
    jurisdicciones: [
        '_id', 'nombreJurisdiccion', 'barrios'
    ],
    barrios: [
        '_id', 'nombreBarrio'
    ],
    EventosPersona: [
        '_id', 'accion', 'organizadorDelEvento', 'fecha', 'localidad', 'barrio', 'direccion',
        'detalle', 'beneficiariosOAsistentes', 'ubicacion', 'archivos', 'jurisdiccion'
    ],
    PersonasEncontradas: [
        '_id', 'nombre', 'apellido', 'dni', 'sexo', 'fechaNacimiento', 'estadoCivil', 'localidad',
        'paisNacimiento', 'provinciaNacimiento', 'ciudadNacimiento', 'direccion', 'ocupacion',
        'barrio', 'numeroTelefono', 'cargo', 'votaPor', 'ubicacion', 'jurisdiccion'
    ]
};