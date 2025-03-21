// ia.js - Lógica de IA para reducir gastos

// Función para analizar gastos y generar recomendaciones
function analizarGastos(gastos, ingresos) {
    const categorias = {
        servicios: 0,
        transporte: 0,
        alimentacion: 0,
        tarjeta: 0,
        educacion: 0,
        salud: 0,
        ocio: 0,
        otros: 0,
    };

    // Calcular el total gastado por categoría
    gastos.forEach(gasto => {
        categorias[gasto.categoria] += gasto.monto;
    });

    // Calcular el porcentaje de gastos por categoría
    const porcentajes = {};
    for (const categoria in categorias) {
        porcentajes[categoria] = (categorias[categoria] / ingresos) * 100;
    }

    // Generar recomendaciones basadas en reglas
    const recomendaciones = [];
    if (porcentajes.servicios > 15) {
        recomendaciones.push("Considera reducir gastos en servicios. Revisa tus suscripciones y elimina las que no uses.");
    }
    if (porcentajes.transporte > 10) {
        recomendaciones.push("Podrías ahorrar en transporte usando opciones más económicas o compartiendo viajes.");
    }
    if (porcentajes.alimentacion > 20) {
        recomendaciones.push("Intenta cocinar en casa más seguido para reducir gastos en alimentación.");
    }
    if (porcentajes.tarjeta > 30) {
        recomendaciones.push("Revisa tus deudas de tarjeta y considera consolidarlas o refinanciarlas.");
    }
    if (porcentajes.ocio > 15) {
        recomendaciones.push("Reduce gastos en ocio. Busca actividades gratuitas o de bajo costo.");
    }
    if (porcentajes.otros > 10) {
        recomendaciones.push("Revisa tus gastos en 'otros'. Identifica áreas donde puedas recortar.");
    }

    return recomendaciones;
}

// Función para mostrar recomendaciones en la interfaz
function mostrarRecomendaciones(recomendaciones) {
    const contenedorRecomendaciones = document.getElementById('recomendaciones-ia');
    contenedorRecomendaciones.innerHTML = '<h3>Recomendaciones de IA</h3>';

    if (recomendaciones.length === 0) {
        contenedorRecomendaciones.innerHTML += '<p>¡Tus gastos están bien balanceados! Sigue así.</p>';
    } else {
        const lista = document.createElement('ul');
        recomendaciones.forEach(recomendacion => {
            const item = document.createElement('li');
            item.textContent = recomendacion;
            lista.appendChild(item);
        });
        contenedorRecomendaciones.appendChild(lista);
    }
}

// Exportar funciones para usarlas en scripts.js
export { analizarGastos, mostrarRecomendaciones };