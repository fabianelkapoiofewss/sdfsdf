import { Schema, model } from "mongoose";

const usuarioSchema = new Schema({
    nombreUsuario: {
        type: String,
        required: true,
    },
    contrasena: {
        type: String,
        required: true,
    }
}, {
    collection: 'usuarios',
    timestamps: false,
});

export const usuarioModel = model('usuario', usuarioSchema);