import mongoose from "mongoose";
import { jurisdiccionModel } from "../modules/models/jurisdiccion.js";
import { coordinadorJurisdiccionModel } from "../modules/models/coordinadorJurisdiccion.js";

const obtenerJurisdiccionPorBarrio = async (personas) => {

    const barriosIds = personas
        .map(p => p.barrio?._id?.toString())
        .filter(Boolean);

    if (barriosIds.length === 0) {
        return personas.map(p => ({ ...p, jurisdiccion: 'Sin Jurisdicción' }));
    }

    const jurisdicciones = await jurisdiccionModel
        .find({ barrios: { $in: barriosIds } }, 'barrios nombreJurisdiccion')
        .lean();

    const jurisdiccionMap = jurisdicciones.reduce((acc, j) => {
        j.barrios.forEach(barrioId => {
            acc[barrioId.toString()] = j.nombreJurisdiccion;
        });
        return acc;
    }, {});

    return personas.map(persona => {
        const personaObj = persona.toObject ? persona.toObject() : { ...persona };
        personaObj.jurisdiccion = persona.barrio
            ? jurisdiccionMap[persona.barrio._id.toString()] || 'Sin Jurisdicción'
            : 'Sin Jurisdicción';
        return personaObj;
    });
};

const obtenerJurisdiccionPorBarrioDeUnaPersona = async (persona) => {
    const barrioId = persona?.barrio?._id?.toString();

    if (!barrioId) {
        const personaObj = persona.toObject ? persona.toObject() : { ...persona };
        return { ...personaObj, jurisdiccion: 'Sin Jurisdicción' };
    }

    const jurisdiccion = await jurisdiccionModel.findOne(
        { barrios: barrioId },
        'nombreJurisdiccion'
    ).lean();

    const personaObj = persona.toObject ? persona.toObject() : { ...persona };
    personaObj.jurisdiccion = jurisdiccion?.nombreJurisdiccion || 'Sin Jurisdicción';

    return personaObj;
};


const obtenerJurisdiccionPorBarriosACargo = async (personas) => {
    const barriosIds = personas
        .flatMap(d => d.barriosACargo.map(b => b._id));

    const jurisdicciones = await jurisdiccionModel.find(
        { barrios: { $in: barriosIds } },
        'barrios nombreJurisdiccion'
    );

    const jurisdiccionMap = {};
    jurisdicciones.forEach(jurisdiccion => {
        jurisdiccion.barrios.forEach(barrioId => {
            jurisdiccionMap[barrioId.toString()] = jurisdiccion.nombreJurisdiccion;
        });
    });

    const personasConJurisdiccion = personas.map(dirigente => {
        const personasObj = dirigente.toObject();

        personasObj.barriosACargo = personasObj.barriosACargo.map(barrio => {
            return {
                nombreBarrio: barrio.nombreBarrio,
                jurisdiccionDelBarrio: jurisdiccionMap[barrio._id.toString()] || 'Sin Jurisdicción'
            };
        });

        return personasObj;
    });

    return personasConJurisdiccion;
}

const obtenerJurisdiccionPersona = async (personas) => {

    const barriosIds = personas
        .map(p => p.persona?.barrio?._id?.toString())
        .filter(Boolean);


    if (barriosIds.length === 0) {
        return personas.map(p => ({ ...p, jurisdiccion: 'Sin Jurisdicción' }));
    }

    const jurisdicciones = await jurisdiccionModel
        .find({ barrios: { $in: barriosIds.map(id => new mongoose.Types.ObjectId(id)) } }, 'barrios nombreJurisdiccion')
        .lean();


    const jurisdiccionMap = jurisdicciones.reduce((acc, j) => {
        j.barrios.forEach(barrioId => {
            acc[barrioId.toString()] = j.nombreJurisdiccion;
        });
        return acc;
    }, {});

    return personas.map(persona => {
        const personaObj = persona.toObject ? persona.toObject() : { ...persona };

        personaObj.jurisdiccion = persona.persona?.barrio
            ? jurisdiccionMap[persona.persona.barrio._id.toString()] || 'Sin Jurisdicción'
            : 'Sin Jurisdicción';


        return personaObj;
    });
}

const obtenerJurisdiccionYJerarquia = async (registros) => {
    const dirigentesIds = registros
        .flatMap(d => d.superioresACargo.map(d => d._id)); // extraigo los ids de los dirigentes

    const coordinadores = await coordinadorJurisdiccionModel
        .find({ personasACargo: { $in: dirigentesIds } }) // consultamos los coordinadores que tengan los dirigentes como personasACargo
        .populate({
            path: 'persona',
            select: 'nombre apellido dni cargo'
        })
        .exec()

    const coordinadorMap = {};
    coordinadores.forEach(coord => {
        coord.personasACargo.forEach(dirigenteId => {
            coordinadorMap[dirigenteId.toString()] = coord.persona;
        });
    });

    const barriosIds = registros
        .flatMap(d => d.barriosACargo.map(b => b._id));


    const jurisdicciones = await jurisdiccionModel.find(
        { barrios: { $in: barriosIds } },
        'barrios nombreJurisdiccion'
    );

    const jurisdiccionMap = {};
    jurisdicciones.forEach(jurisdiccion => {
        jurisdiccion.barrios.forEach(barrioId => {
            jurisdiccionMap[barrioId.toString()] = jurisdiccion.nombreJurisdiccion;
        });
    });

    const adherentesConJurisdiccionYJerarquia = registros.map(adherente => {
        const adherenteObj = adherente.toObject();

        adherenteObj.superioresACargo = adherenteObj.superioresACargo.map(superior => {
            return {
                ...superior,
                Coordinador: coordinadorMap[superior._id.toString()]
            }
        });
        adherenteObj.barriosACargo = adherenteObj.barriosACargo.map(barrio => {
            return {
                nombreBarrio: barrio.nombreBarrio,
                jurisdiccionDelBarrio: jurisdiccionMap[barrio._id.toString()] || 'Sin Jurisdicción'
            };
        });

        return adherenteObj;
    });

    return adherentesConJurisdiccionYJerarquia;
}

export { obtenerJurisdiccionPorBarrio, obtenerJurisdiccionPorBarrioDeUnaPersona, obtenerJurisdiccionPorBarriosACargo, obtenerJurisdiccionPersona, obtenerJurisdiccionYJerarquia };