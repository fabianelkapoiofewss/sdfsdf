import { model, Schema } from "mongoose"

const adherenteSchema = new Schema({
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    barriosACargo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Barrio',
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
    timestamps: true,
    collection: 'adherentes'
})

export const adherenteModel = model('Adherente', adherenteSchema);