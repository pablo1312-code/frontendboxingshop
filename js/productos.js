// ===== PRODUCTOS =====

async function cargarProductos() {
    const search      = document.getElementById("search").value.trim();
    const categoria   = document.getElementById("filtroCategoria").value;
    const minPrecio   = document.getElementById("minPrecio").value;
    const maxPrecio   = document.getElementById("maxPrecio").value;
    const soloStock   = document.getElementById("soloStock").checked;
    const sortBy      = document.getElementById("sortBy").value;
    const sortDir     = document.getElementById("sortDir").value;

    const params = new URLSearchParams();
    if (search)    params.append("search", search);
    if (categoria) params.append("categoria", categoria);
    if (minPrecio) params.append("minPrecio", minPrecio);
    if (maxPrecio) params.append("maxPrecio", maxPrecio);
    if (soloStock) params.append("soloStock", "true");
    if (sortBy)    params.append("sortBy", sortBy);
    if (sortDir)   params.append("sortDir", sortDir);

    try {
        const productos = await apiFetch("/products?" + params.toString());
        renderTablaProductos(productos);
    } catch (error) {
        mostrarToast("Error al cargar productos: " + error.message, true);
    }
}

function renderTablaProductos(productos) {
    const tbody = document.getElementById("bodyProductos");
    tbody.innerHTML = "";

    if (productos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#888">No hay productos</td></tr>`;
        return;
    }

    productos.forEach(p => {
        const stockClass = p.stock === 0 ? "stock-empty" : p.stock < 5 ? "stock-low" : "stock-ok";
        const stockLabel = p.stock === 0 ? "Sin stock" : p.stock;

        const imgHtml = p.imagen
            ? `<img src="${p.imagen}" alt="${p.nombre}" class="producto-img" onerror="this.src='https://placehold.co/60x60/1a1a2e/888?text=Sin+imagen'">`
            : `<img src="https://placehold.co/60x60/1a1a2e/888?text=Sin+imagen" alt="Sin imagen" class="producto-img">`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${imgHtml}</td>
            <td><strong>${p.nombre}</strong><br><small style="color:#888">${p.descripcion || ""}</small></td>
            <td>${p.categoria}</td>
            <td>${p.precio.toFixed(2)} €</td>
            <td><span class="stock-badge ${stockClass}">${stockLabel}</span></td>
            <td>
                <button class="btn btn-edit" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn btn-delete" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalProducto() {
    document.getElementById("modalProductoTitulo").textContent = "Nuevo Producto";
    document.getElementById("productoId").value = "";
    document.getElementById("productoNombre").value = "";
    document.getElementById("productoDescripcion").value = "";
    document.getElementById("productoPrecio").value = "";
    document.getElementById("productoStock").value = "";
    document.getElementById("productoCategoria").value = "";
    document.getElementById("productoImagen").value = "";
    document.getElementById("previewImagen").style.display = "none";
    document.getElementById("modalProducto").style.display = "flex";
}

async function editarProducto(id) {
    try {
        const p = await apiFetch("/products/" + id);
        document.getElementById("modalProductoTitulo").textContent = "Editar Producto";
        document.getElementById("productoId").value = p.id;
        document.getElementById("productoNombre").value = p.nombre;
        document.getElementById("productoDescripcion").value = p.descripcion || "";
        document.getElementById("productoPrecio").value = p.precio;
        document.getElementById("productoStock").value = p.stock;
        document.getElementById("productoCategoria").value = p.categoria;
        document.getElementById("productoImagen").value = p.imagen || "";
        if (p.imagen) {
            document.getElementById("imgPreview").src = p.imagen;
            document.getElementById("previewImagen").style.display = "block";
        } else {
            document.getElementById("previewImagen").style.display = "none";
        }
        document.getElementById("modalProducto").style.display = "flex";
    } catch (error) {
        mostrarToast("Error al cargar el producto", true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("productoImagen").addEventListener("input", function() {
        const url = this.value.trim();
        const preview = document.getElementById("previewImagen");
        const img = document.getElementById("imgPreview");
        if (url) {
            img.src = url;
            preview.style.display = "block";
        } else {
            preview.style.display = "none";
        }
    });
});

async function guardarProducto() {
    const id          = document.getElementById("productoId").value;
    const nombre      = document.getElementById("productoNombre").value.trim();
    const descripcion = document.getElementById("productoDescripcion").value.trim();
    const precio      = parseFloat(document.getElementById("productoPrecio").value);
    const stock       = parseInt(document.getElementById("productoStock").value);
    const categoria   = document.getElementById("productoCategoria").value;
    const imagen      = document.getElementById("productoImagen").value.trim() || null;

    if (!nombre || isNaN(precio) || isNaN(stock) || !categoria) {
        mostrarToast("Rellena todos los campos obligatorios", true);
        return;
    }

    const body = JSON.stringify({ nombre, descripcion, precio, stock, categoria, imagen });

    try {
        if (id) {
            await apiFetch("/products/" + id, { method: "PUT", body });
            mostrarToast("Producto actualizado ✓");
        } else {
            await apiFetch("/products", { method: "POST", body });
            mostrarToast("Producto creado ✓");
        }
        cerrarModal("modalProducto");
        cargarProductos();
    } catch (error) {
        mostrarToast("Error al guardar: " + error.message, true);
    }
}

async function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
        await apiFetch("/products/" + id, { method: "DELETE" });
        mostrarToast("Producto eliminado ✓");
        cargarProductos();
    } catch (error) {
        mostrarToast("Error al eliminar", true);
    }
}