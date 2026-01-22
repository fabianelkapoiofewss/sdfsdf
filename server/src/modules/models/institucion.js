import { model, Schema } from "mongoose";

const institucionSchema = new Schema({
    nombreInstitucion: {
        type: String,
        required: true,
    },
    encargadoODirector: {
        type: String,
    },
    localidad: {
        type: Schema.Types.ObjectId,
        ref: 'Localidad',
    },
    barrio: {
        type: Schema.Types.ObjectId,
        ref: 'Barrio',
        required: false,
        default: null
    },
    direccion: {
        type: String,
        required: true,
    },
    ubicacion: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordenadas: {
            type: [Number],
        },
    },
    
}, {
    timestamps: false,
    collection: 'instituciones'
});

export const institucionModel = model('Institucion', institucionSchema);