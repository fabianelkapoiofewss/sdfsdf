import { model, Schema } from "mongoose";

const coordinadorJurisdiccionSchema = new Schema({
    persona: {
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: true
    },
    jurisdiccionACargo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Jurisdiccion',
            
            // required: true
        }
    ],
    personasACargo: [
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
    collection: 'coordinador_jurisdicciones',
    timestamps: true
})

export const coordinadorJurisdiccionModel = model('CoordinadorJurisdiccion', coordinadorJurisdiccionSchema);