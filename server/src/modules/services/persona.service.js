import { create, getForId, getAll, updateById, deleteById } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { personaModel } from "../models/persona.js";
import { eventoModel } from "../models/evento.js";

import { obtenerJurisdiccionPorBarrio, obtenerJurisdiccionPorBarrioDeUnaPersona } from "../../helpers/obtenerJurisdiccion.js";

export const personaService = {

    async registrarPersona(persona) {
        return await create(personaModel, persona);
    },

    async obtenerPersonas() {
        return await getAll(personaModel);
    },

    async obtenerPersonaPorId(id) {
        return await getForId(personaModel, id);
    },

    async editarRegistroPersona(id, persona) {
        return await updateById(personaModel, id, persona);
    },

    async eliminarRegistroPersona(id) {
        return await deleteById(personaModel, id);
    },

    async listarPersonasBarrios(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const personas = await personaModel
                .find({}, '-__v')
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio'
                })
                .lean();

            const personasConJurisdiccion = await obtenerJurisdiccionPorBarrio(personas);

            const totalPersonas = await personaModel.countDocuments();

            return {
                data: personasConJurisdiccion,
                currentPage: page,
                totalPages: Math.ceil(totalPersonas / PAGE_SIZE),
                totalRecords: totalPersonas
            };
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async listarPersonas() {
        try {
            const personas = await personaModel
                .find(
                    { ubicacion: { $exists: true, $ne: null, $ne: "" } },
                    '-__v'
                )
                .sort({ _id: -1 })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad'
                });

            const personasConJurisdiccion = await obtenerJurisdiccionPorBarrio(personas);

            return personasConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getPersonasConCargo() {
        try {
            const personas = await personaModel
                .find(
                    { cargo: { $exists: true, $ne: null, $ne: "", $ne: "Sin cargo" } },
                    '-__v'
                )
                .sort({ _id: -1 })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad'
                });

            const personasConJurisdiccion = await obtenerJurisdiccionPorBarrio(personas);

            return personasConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async buscarPorCampo(campo, valor) {
        try {

            const camposValidos = ["nombre", "apellido", "dni"];
            if (!camposValidos.includes(campo)) {
                throw new AppError(`Campo de búsqueda no válido: ${campo}`, 400);
            }

            const filtro = {
                [campo]: {
                    $regex: valor, // busca coincidencias parciales en el valor
                    $options: 'i' // busqueda insensible a mayúsculas
                }
            };

            const resultados = await personaModel
                .find(filtro, '-__v')
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio'
                })
                .lean();

            const resultadosConJurisdiccion = await obtenerJurisdiccionPorBarrio(resultados);
            return resultadosConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async encontrarPersona(idPersona) {
        try {
            const persona = await personaModel
                .findById(idPersona)
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio'
                })
            const personaConJurisdiccion = await obtenerJurisdiccionPorBarrioDeUnaPersona(persona);

            return personaConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async listarEventosPersona(idPersona) {
        try {
            const eventos = await
                eventoModel.find({
                    $or: [
                        { 'beneficiariosOAsistentes.referencia': idPersona },
                        { 'organizadorDelEvento': idPersona }
                    ]
                })
                    .populate('accion barrio organizadorDelEvento beneficiariosOAsistentes.referencia')
                    .populate({
                        path: 'localidad',
                        select: 'nombreLocalidad -_id'
                    });

            const eventosPorPersona = eventos.map(evento => {
                const participantesFiltrados = evento.beneficiariosOAsistentes.filter(participante =>
                    participante.referencia._id.toString() === idPersona
                );

                const esOrganizador = evento.organizadorDelEvento?._id?.toString() === idPersona;

                return {
                    ...evento.toObject(),
                    beneficiariosOAsistentes: esOrganizador ? evento.beneficiariosOAsistentes : participantesFiltrados
                };
            });

            const resultadosConJurisdiccion = await obtenerJurisdiccionPorBarrio(eventosPorPersona);
            return resultadosConJurisdiccion;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async listarEventosOrganizados(idPersona) {
        try {
            const eventos = await eventoModel.find({
                'organizadorDelEvento': idPersona
            }).populate('accion barrio organizadorDelEvento beneficiariosOAsistentes.referencia')
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                });

            return eventos.map(evento => ({
                ...evento.toObject()
            }));
        } catch (error) {
            console.log(error)
            mongooseErrorHandler(error);
        }
    },

    async filtrarRegistros(filtros) {
        try {
            // Lista de campos válidos
            const camposValidos = [
                "nombre",
                "apellido",
                "dni",
                "sexo",
                "fechaNacimiento",
                "estadoCivil",
                "paisNacimiento",
                "provinciaNacimiento",
                "ciudadNacimiento",
                "direccion",
                "ocupacion",
                "barrio",
                "cargo",
                "ubicacion"
            ];

            // Validar que los campos proporcionados sean válidos
            const filtroDinamico = {};
            Object.entries(filtros).forEach(([campo, valor]) => {
                if (!camposValidos.includes(campo)) {
                    throw new AppError(`Campo de búsqueda no válido: ${campo}`, 400);
                }

                // Construcción de filtros según el tipo de dato del campo
                if (["nombre", "apellido", "dni", "direccion", "ocupacion", "paisNacimiento", "provinciaNacimiento", "ciudadNacimiento"].includes(campo)) {
                    filtroDinamico[campo] = {
                        $regex: valor, // Coincidencia parcial
                        $options: 'i' // Insensible a mayúsculas
                    };
                } else if (["sexo", "estadoCivil", "cargo"].includes(campo)) {
                    filtroDinamico[campo] = valor; // Coincidencia exacta
                } else if (campo === "barrio") {
                    filtroDinamico[campo] = valor; // Coincidencia directa con MongoDB ObjectId
                } else if (campo === "fechaNacimiento") {
                    // Filtrar por rango de fechas
                    const { desde, hasta } = valor;
                    filtroDinamico[campo] = {};
                    if (desde) filtroDinamico[campo].$gte = new Date(desde);
                    if (hasta) filtroDinamico[campo].$lte = new Date(hasta);
                } else if (campo === "ubicacion") {
                    // Filtrar por coordenadas geoespaciales
                    filtroDinamico["ubicacion.coordenadas"] = {
                        $geoWithin: {
                            $centerSphere: [[valor.longitud, valor.latitud], valor.radio / 6378.1]
                        }
                    };
                }
            });

            // Consulta a la base de datos con los filtros dinámicos
            const resultados = await personaModel
                .find(filtroDinamico)
                .populate({
                    path: "barrio",
                    select: "nombre"
                })
                .select('-__v');

            return resultados;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
}