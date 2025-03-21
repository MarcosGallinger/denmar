// scripts.js - Archivo principal de JavaScript

// Importar funciones de IA
import { analizarGastos, mostrarRecomendaciones } from './ia.js';

// Datos iniciales
let ingresos = 0;
let gastos = [];
let presupuesto = {};
let metas = [];
let ahorroTotal = 0;

// Cargar datos desde LocalStorage al iniciar
function cargarDatos() {
    const datosGuardados = JSON.parse(localStorage.getItem('finanzasData'));
    if (datosGuardados) {
        ingresos = datosGuardados.ingresos || 0;
        gastos = datosGuardados.gastos || [];
        presupuesto = datosGuardados.presupuesto || {};
        metas = datosGuardados.metas || [];
        ahorroTotal = datosGuardados.ahorroTotal || 0;

        // Mostrar gastos en la lista
        const listaGastos = document.getElementById('lista-gastos').querySelector('ul');
        listaGastos.innerHTML = ''; // Limpiar lista
        gastos.forEach((gasto, index) => {
            const nuevoGasto = document.createElement('li');
            nuevoGasto.innerHTML = `${gasto.categoria}: $${gasto.monto} <button data-index="${index}">Eliminar</button>`;
            listaGastos.appendChild(nuevoGasto);
        });

        // Mostrar presupuesto sugerido
        calcularPresupuesto();

        // Mostrar metas de ahorro
        if (metas.length > 0) {
            const metaActual = metas[metas.length - 1];
            document.getElementById('progreso-ahorro').querySelector('progress').max = metaActual.monto;
        }

        // Actualizar gráfico de gastos
        actualizarGrafico();

        // Mostrar recomendaciones de IA
        const recomendaciones = analizarGastos(gastos, ingresos);
        mostrarRecomendaciones(recomendaciones);
    }
}

// Guardar datos en LocalStorage
function guardarDatos() {
    const datos = {
        ingresos,
        gastos,
        presupuesto,
        metas,
        ahorroTotal,
    };
    localStorage.setItem('finanzasData', JSON.stringify(datos));
}

// Función para eliminar un gasto
function eliminarGasto(index) {
    gastos.splice(index, 1); // Eliminar el gasto del array
    guardarDatos(); // Guardar los datos actualizados
    cargarDatos(); // Recargar la lista de gastos
}

// Registrar ingresos y gastos
document.getElementById('gastos-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Solo cargar ingresos si no se han cargado previamente
    if (ingresos === 0) {
        ingresos = parseFloat(document.getElementById('ingresos').value);
    }

    const categoria = document.getElementById('categoria').value;
    const monto = parseFloat(document.getElementById('monto').value);

    gastos.push({ categoria, monto });

    const listaGastos = document.getElementById('lista-gastos').querySelector('ul');
    const nuevoGasto = document.createElement('li');
    nuevoGasto.innerHTML = `${categoria}: $${monto} <button data-index="${gastos.length - 1}">Eliminar</button>`;
    listaGastos.appendChild(nuevoGasto);

    // Calcular presupuesto sugerido
    calcularPresupuesto();

    // Limpiar solo los campos de categoría y monto
    document.getElementById('categoria').value = 'servicios'; // Resetear a la primera opción
    document.getElementById('monto').value = '';

    // Guardar datos
    guardarDatos();

    // Mostrar recomendaciones de IA
    const recomendaciones = analizarGastos(gastos, ingresos);
    mostrarRecomendaciones(recomendaciones);
});

// Event delegation para eliminar gastos
document.getElementById('lista-gastos').addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        const index = e.target.getAttribute('data-index');
        eliminarGasto(index);
    }
});

// Calcular presupuesto sugerido
function calcularPresupuesto() {
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const presupuestoSugerido = {
        servicios: ingresos * 0.10,
        transporte: ingresos * 0.10,
        alimentacion: ingresos * 0.15,
        tarjeta: ingresos * 0.4,
        educacion: ingresos * 0.05,
        salud: ingresos * 0.05,
        ocio: ingresos * 0.05,
        otros: ingresos * 0.10,
    };

    document.getElementById('presupuesto-sugerido').textContent = JSON.stringify(presupuestoSugerido, null, 2);
}

// Ajustar límites de presupuesto
document.getElementById('ajuste-presupuesto-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const categoria = document.getElementById('limite-categoria').value;
    const limite = parseFloat(document.getElementById('limite-gasto').value);

    presupuesto[categoria] = limite;
    document.getElementById('mensaje-alerta').textContent = `Límite ajustado para ${categoria}: $${limite}`;
    document.getElementById('ajuste-presupuesto-form').reset();

    // Guardar datos
    guardarDatos();
});

// Establecer metas de ahorro
document.getElementById('meta-ahorro-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre-meta').value;
    const monto = parseFloat(document.getElementById('monto-meta').value);
    const plazo = parseFloat(document.getElementById('plazo-meta').value);

    const ahorroMensual = monto / plazo;
    metas.push({ nombre, monto, plazo, ahorroMensual });

    document.getElementById('progreso-ahorro').querySelector('progress').max = monto;
    document.getElementById('meta-ahorro-form').reset();

    // Guardar datos
    guardarDatos();
});

// Consejos del día
const consejos = [
    "Ahorra el 20% de tus ingresos cada mes.",
    "Evita gastos innecesarios en suscripciones que no usas.",
    "Crea un fondo de emergencia con al menos 3 meses de gastos.",
    "Invierte en tu educación financiera.",
];

document.getElementById('consejo').textContent = consejos[Math.floor(Math.random() * consejos.length)];

// Gráfico de gastos
const ctx = document.getElementById('grafico-gastos').getContext('2d');
const graficoGastos = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['servicios', 'Transporte', 'Alimentación', 'tarjeta', 'educación', 'salud', 'Ocio', 'Otros'],
        datasets: [{
            label: 'Gastos por Categoría',
            data: [0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(0, 255, 204, 0.2)',
            borderColor: 'rgba(0, 255, 204, 1)',
            borderWidth: 1,
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            }
        }
    }
});

// Actualizar gráfico de gastos
function actualizarGrafico() {
    const datos = [0, 0, 0, 0, 0, 0, 0, 0];
    gastos.forEach(gasto => {
        switch (gasto.categoria) {
            case 'servicios': datos[0] += gasto.monto; break;
            case 'transporte': datos[1] += gasto.monto; break;
            case 'alimentacion': datos[2] += gasto.monto; break;
            case 'tarjeta': datos[3] += gasto.monto; break;
            case 'educación': datos[4] += gasto.monto; break;
            case 'salud': datos[5] += gasto.monto; break;
            case 'ocio': datos[6] += gasto.monto; break;
            case 'otros': datos[7] += gasto.monto; break;
        }
    });
    graficoGastos.data.datasets[0].data = datos;
    graficoGastos.update();
}

// Planificación a largo plazo
document.getElementById('planificacion-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const meta = document.getElementById('meta-futura').value;
    const monto = parseFloat(document.getElementById('monto-meta-futura').value);
    const plazo = parseFloat(document.getElementById('plazo-futuro').value);

    const ahorroMensual = monto / (plazo * 12);
    document.getElementById('ahorro-mensual').textContent = `Debes ahorrar $${ahorroMensual.toFixed(2)} mensuales para ${meta}.`;
});

// Cargar datos al iniciar la página
cargarDatos();