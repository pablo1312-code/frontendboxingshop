// ===== APP PRINCIPAL =====

function showSection(seccion) {
    document.getElementById("section-productos").style.display = seccion === "productos" ? "block" : "none";
    document.getElementById("section-usuarios").style.display  = seccion === "usuarios"  ? "block" : "none";

    // Actualizar botones de navegación
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    // Cargar datos de la sección
    if (seccion === "productos") cargarProductos();
    else cargarUsuarios();
}

function cerrarModal(id) {
    document.getElementById(id).style.display = "none";
}

// Cerrar modal al hacer clic fuera
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
        if (e.target === modal) cerrarModal(modal.id);
    });
});

function mostrarToast(mensaje, esError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show" + (esError ? " error" : "");
    setTimeout(() => { toast.className = "toast"; }, 3000);
}

// Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", cargarProductos);
