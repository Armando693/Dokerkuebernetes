document.addEventListener('DOMContentLoaded', async function () {
    const recomendacionesList = document.getElementById('recomendaciones-list');
    const btnBuscar = document.getElementById('btn-buscar');
    const clienteIdInput = document.getElementById('cliente-id');

    // 🟢 Obtener ID del usuario logueado desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const clienteId = usuario ? usuario.id : null;

    // Si no hay usuario logueado
    if (!clienteId) {
        recomendacionesList.innerHTML = `
            <div class="error">
                <h3>No se encontró un usuario logueado</h3>
                <p>Por favor, inicia sesión para ver tus recomendaciones personalizadas.</p>
            </div>
        `;
        return;
    }

    // 🧩 Función para obtener recomendaciones
    async function obtenerRecomendaciones(id) {
        try {
            recomendacionesList.innerHTML = '<div class="loading">Cargando recomendaciones...</div>';

            const response = await fetch(`http://57.152.12.59/recommendations/user/${id}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const recomendaciones = await response.json();
            mostrarRecomendaciones(recomendaciones);

        } catch (error) {
            console.error('Error al obtener recomendaciones:', error);
            recomendacionesList.innerHTML = `
                <div class="error">
                    <h3>Error al cargar las recomendaciones</h3>
                    <p>${error.message}</p>
                    <p>Por favor, intenta nuevamente más tarde.</p>
                </div>
            `;
        }
    }

    // 🧩 Función para mostrar recomendaciones
    function mostrarRecomendaciones(recomendaciones) {
        if (!recomendaciones || recomendaciones.length === 0) {
            recomendacionesList.innerHTML = '<div class="error">No se encontraron recomendaciones para este cliente.</div>';
            return;
        }

        let html = '<div class="recomendaciones-grid">';
        recomendaciones.forEach(item => {
            html += `
            <div class="recomendacion">
                <div class="producto-imagen">
                    <img src="${item.imagen_url || 'https://via.placeholder.com/200x200?text=Sin+Imagen'}" alt="${item.nombre}">
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${item.nombre}</h3>
                    <p class="producto-descripcion">${item.descripcion}</p>
                    <p class="producto-marca">${item.marca}</p>
                    <p class="producto-precio">${item.precio_venta}</p>
                    <button class="add-to-cart"
                        data-id="${item.id}"
                        data-product="${item.nombre}"
                        data-price="${item.precio_venta}"
                        data-image="${item.imagen_url || 'https://via.placeholder.com/250x200?text=Sin+Imagen'}">
                        Añadir al Carrito
                    </button>
                </div>
            </div>
            `;
        });
        html += '</div>';
        recomendacionesList.innerHTML = html;
    }

    // 🟢 Ejecutar automáticamente cuando el usuario esté logueado
    obtenerRecomendaciones(clienteId);

});