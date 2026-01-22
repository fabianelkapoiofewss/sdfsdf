import { model, Schema } from 'mongoose';

const personaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    sexo: {
        type: String,
        enum: ['Masculino', 'Femenino'],
        default: null
    },
    fechaNacimiento: {
        type: Date,
        default: null
    },
    estadoCivil: {
        type: String,
        enum: ['Soltero', 'Casado', 'Viudo', 'Divorciado'],
        default: null
    },
    localidad: {
        type: Schema.Types.ObjectId,
        ref: 'Localidad',
    },
    paisNacimiento: {
        type: String,
    },
    provinciaNacimiento: {
        type: String,
    },
    ciudadNacimiento: {
        type: String,
    },
    direccion: {
        type: String,
    },
    ocupacion: {
        type: String,
    },
    barrio: {
        type: Schema.Types.ObjectId,
        ref: 'Barrio',
    },
    numeroTelefono: {
        type: String,
    },
    cargo: {
        type: String,
        enum: ['Coordinador de Jurisdicción', 'Dirigente', 'Adherente', 'Sin cargo'],
        default: 'Sin cargo'
    },
    votaPor: {
        type: String,
        enum: ['PJ', 'UCR', 'LLA', 'PRO', 'Otros'],
        default: null,
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
    // __v: { type: Number, select: false }
}, {
    collection: 'personas',
    timestamps: false
});

export const personaModel = model('Persona', personaSchema);