
const palabrasNoCapitalizar = ["de", "del", "la", "las", "los", "y", "en", "el"];

export const capitalizarNombre = (nombre) => {
    const palabras = nombre.trim().toLowerCase().split(/\s+/);
    if (palabras.length === 2) {
        return palabras
            .map(p => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    } else {
        return palabras
            .map((palabra, index) => {
                if (
                    index === 0 ||
                    index === palabras.length - 1 ||
                    !palabrasNoCapitalizar.includes(palabra)
                ) {
                    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
                } else {
                    return palabra;
                }
            })
            .join(" ");
    }
};