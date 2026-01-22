import { Schema, model } from "mongoose";
import { asignarColor } from "../../middlewares/asignarColor.js";
import { liberarColor } from "../../middlewares/liberarColor.js";

const accionSchema = new Schema({
    nombreAccion: {
        type: String,
        required: true,
    },
    colorMarcador: {
        type: String,
        default: null,
    }
}, {
    collection: 'acciones',
    timestamps: false,
});

accionSchema.pre('save', asignarColor);
accionSchema.post('remove', liberarColor);
    
const accionModel = model('Accion', accionSchema);
export { accionModel };
/*
accionSchema.statics.initializeAcciones = async function () {
    try {
        const count = await this.countDocuments();
        if (count === 0) {
            await this.insertMany([
                { nombreAccion: 'Mercadería' },
                { nombreAccion: 'Baño' },
                { nombreAccion: 'Huerta' },
                { nombreAccion: 'Pan pulce y Sidra'}
            ]);
            console.log('Acciones por defecto cargadas');
        }
    } catch (error) {
        console.error('Error al inicializar acciones:', error);
    }
};

(async () => {
    try {
        await accionModel.initializeAcciones();
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
})();

*/