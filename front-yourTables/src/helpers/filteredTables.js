import { format } from 'date-fns';

function formatDateUTC(dateString) {
  const date = new Date(dateString);
  const correctedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return format(correctedDate, "dd/MM/yyyy");
}

export function formatKeyToTitle(key) {
  let formatted = key
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();

  const replacements = {
    "o director": "o director",
    "a cargo": "a cargo",
  };

  formatted = Object.entries(replacements).reduce((acc, [original, replacement]) => {
    return acc.replace(original, replacement);
  }, formatted);

  if (formatted.endsWith(" nacimiento") && !formatted.includes(" de nacimiento")) {
    formatted = formatted.replace(/(\w+)( nacimiento)$/, "$1 de$2");
  }

  return formatted;
}

export const useFilteredTable = (titles, tableContent, excludedFields) => {

  // Filtrar títulos que no deben mostrarse y agregar el título "num" al inicio
  const filteredTitlesRaw = ["num", ...titles.filter(title => !excludedFields.includes(title))];

  const filteredTitles = filteredTitlesRaw.map(title => formatKeyToTitle(title));

  const filteredTitlesWithActions = [...filteredTitles, "acciones"];

  // Filtrar contenido de la tabla y agregar un índice para enumerar las filas
  const filteredTableContent = tableContent.map((row, index) => {

    const filteredRow = { num: index + 1, ...row }; // Agregar num como índice (empezando desde 1)

    excludedFields.forEach(field => delete filteredRow[field]); // Elimina las claves no deseadas

    filteredTitles.forEach(title => {
      if (!(title in filteredRow)) {
        filteredRow[title] = "";
      }
    });

    // Iterar sobre las claves y formatear si la clave es una fecha
    Object.keys(filteredRow).forEach(key => {
      if (key.toLowerCase().includes("fecha") && filteredRow[key]) {
        filteredRow[key] = formatDateUTC(filteredRow[key]);
      }
    });

    return filteredRow;
  });

  return { filteredTitles, filteredTableContent, filteredTitlesWithActions };
};