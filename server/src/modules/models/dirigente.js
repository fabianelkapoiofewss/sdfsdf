import { model, Schema } from "mongoose"

const dirigenteSchema = new Schema({
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    barriosACargo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Barrio',
            required: true
        }
    ],
    personasACargo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Persona',
        }
    ],
    superioresACargo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Persona',
        }
    ],
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        required: true
    },
    fechaDesde: {
        type: Date,
    },
    fechaHasta: {
        type: Date,
        default: null
    }
}, {
    collection: 'dirigentes',
    timestamps: true
})

export const dirigenteModel = model('Dirigente', dirigenteSchema);