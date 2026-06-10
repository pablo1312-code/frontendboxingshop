// ===== USUARIOS =====

async function cargarUsuarios() {
    try {
        const usuarios = await apiFetch("/users");
        renderTablaUsuarios(usuarios);
    } catch (error) {
        mostrarToast("Error al cargar usuarios: " + error.message, true);
    }
}

function renderTablaUsuarios(usuarios) {
    const tbody = document.getElementById("bodyUsuarios");
    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#888">No hay usuarios</td></tr>`;
        return;
    }

    usuarios.forEach(u => {
        const rolClass = u.rol === "ADMIN" ? "rol-admin" : "rol-user";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td><span class="rol-badge ${rolClass}">${u.rol}</span></td>
            <td>${u.categoria || "-"}</td>
            <td>${u.peso || "-"}</td>
            <td>${u.gimnasio || "-"}</td>
            <td>
                <button class="btn btn-edit" onclick="editarUsuario(${u.id})">Editar</button>
                <button class="btn btn-delete" onclick="eliminarUsuario(${u.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalUsuario() {
    document.getElementById("modalUsuarioTitulo").textContent = "Nuevo Usuario";
    document.getElementById("usuarioId").value = "";
    document.getElementById("usuarioNombre").value = "";
    document.getElementById("usuarioEmail").value = "";
    document.getElementById("usuarioPassword").value = "";
    document.getElementById("usuarioRol").value = "USER";
    document.getElementById("usuarioCategoria").value = "";
    document.getElementById("usuarioPeso").value = "";
    document.getElementById("usuarioGimnasio").value = "";
    document.getElementById("usuarioExperiencia").value = "";
    document.getElementById("modalUsuario").style.display = "flex";
}

async function editarUsuario(id) {
    try {
        const u = await apiFetch("/users/" + id);
        document.getElementById("modalUsuarioTitulo").textContent = "Editar Usuario";
        document.getElementById("usuarioId").value = u.id;
        document.getElementById("usuarioNombre").value = u.nombre;
        document.getElementById("usuarioEmail").value = u.email;
        document.getElementById("usuarioPassword").value = "";
        document.getElementById("usuarioRol").value = u.rol;
        document.getElementById("usuarioCategoria").value = u.categoria || "";
        document.getElementById("usuarioPeso").value = u.peso || "";
        document.getElementById("usuarioGimnasio").value = u.gimnasio || "";
        document.getElementById("usuarioExperiencia").value = u.experiencia || "";
        document.getElementById("modalUsuario").style.display = "flex";
    } catch (error) {
        mostrarToast("Error al cargar el usuario", true);
    }
}

async function guardarUsuario() {
    const id          = document.getElementById("usuarioId").value;
    const nombre      = document.getElementById("usuarioNombre").value.trim();
    const email       = document.getElementById("usuarioEmail").value.trim();
    const password    = document.getElementById("usuarioPassword").value;
    const rol         = document.getElementById("usuarioRol").value;
    const categoria   = document.getElementById("usuarioCategoria").value;
    const peso        = document.getElementById("usuarioPeso").value;
    const gimnasio    = document.getElementById("usuarioGimnasio").value.trim();
    const experiencia = parseInt(document.getElementById("usuarioExperiencia").value) || null;

    if (!nombre || !email) {
        mostrarToast("Nombre y email son obligatorios", true);
        return;
    }

    if (!id && !password) {
        mostrarToast("La contraseña es obligatoria al crear un usuario", true);
        return;
    }

    const body = JSON.stringify({ nombre, email, password, rol, categoria, peso, gimnasio, experiencia });

    try {
        if (id) {
            await apiFetch("/users/" + id, { method: "PUT", body });
            mostrarToast("Usuario actualizado ✓");
        } else {
            await apiFetch("/users", { method: "POST", body });
            mostrarToast("Usuario creado ✓");
        }
        cerrarModal("modalUsuario");
        cargarUsuarios();
    } catch (error) {
        mostrarToast("Error: " + error.message, true);
    }
}

async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
        await apiFetch("/users/" + id, { method: "DELETE" });
        mostrarToast("Usuario eliminado ✓");
        cargarUsuarios();
    } catch (error) {
        mostrarToast("Error al eliminar", true);
    }
}
