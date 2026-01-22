const jerarquiaColores = {
    'Coordinador de Jurisdicción': 'red',
    'Dirigente': 'green',
    'Adherente': 'yellow',
}

const partidoColores = {
    'PJ': 'blue',
    'UCR': 'red',
    'PRO': 'yellow',
    'LLA': 'purple',
    'Otros': 'green',
};

const votaPorColores = {
    'PJ': '#0969b9',
    'UCR': 'red',
    'PRO': 'yellow',
    'LLA': '#6d35f0',
    'Otros': '#00ff00',
    'Indefinido': '#b833ff'
};

const iconMarkerJerarquia = (cargo) => ({
    url: `http://maps.google.com/mapfiles/ms/icons/${jerarquiaColores[cargo]}-dot.png`
})

const iconMarkerPartido = (partido) => ({
    url: `http://maps.google.com/mapfiles/ms/icons/${partidoColores[partido] || 'pink'}-dot.png`,
});

export { iconMarkerJerarquia, iconMarkerPartido, jerarquiaColores, partidoColores, votaPorColores };