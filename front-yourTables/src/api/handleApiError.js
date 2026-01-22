import { toast } from "sonner";

export const handleApiError = (error, defaultMessage = "Ocurrió un error inesperado") => {
    let errorMessage = defaultMessage;

    if (error.response?.data) {
        const { data } = error.response;

        if (Array.isArray(data.errors)) {
            const mensajes = data.errors.map(err => `• ${err.msg}`).join('\n');
            errorMessage = mensajes;
        }

        if (typeof data === 'string') {
            const match = data.match(/AppError:\s*(.*?)<br>/);
            if (match) {
                errorMessage = match[1];
            }
        }
    }

    toast.error(defaultMessage, { description: errorMessage, duration: 6000 });
    return errorMessage;
};