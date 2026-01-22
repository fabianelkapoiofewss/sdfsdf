import { model, Schema } from "mongoose";

const eventoSchema = new Schema({
    accion: {
        type: Schema.Types.ObjectId,
        ref: 'Accion',
        required: true
    },
    organizadorDelEvento: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Persona'
        }
    ],
    fecha: {
        type: Date,
    },
    localidad: {
        type: Schema.Types.ObjectId,
        ref: 'Localidad'
    },
    barrio: {
        type: Schema.Types.ObjectId, 
        ref: 'Barrio',
        default: null
    },
    direccion: {
        type: String,
    },
    detalle: {
        type: String,
    },
    beneficiariosOAsistentes: [
        {
            tipo: {
                type: String,
                enum: ['Persona', 'Institucion'],
                required: true
            },
            referencia: {
                type: Schema.Types.ObjectId,
                required: true,
                refPath: 'beneficiariosOAsistentes.tipo'
            }
        }
    ],
    ubicacion: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordenadas: {
            type: [Number],
        },
    },
    archivos: [
        {
            type: String
        }
    ]
}, {
    collection: 'eventos',
    timestamps: true
});

export const eventoModel = model('Evento', eventoSchema);