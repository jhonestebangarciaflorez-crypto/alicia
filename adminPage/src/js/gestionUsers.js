function cambiarRol(correoObjetivo, nuevoRolDeseado) {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        alert("No hay sesión activa.");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarioActivo.rol === 'admin') {
        usuarios = usuarios.map(user => {
            if (user.correo === correoObjetivo) {
                return { ...user, rol: nuevoRolDeseado };
            }
            return user;
        });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert("¡Rol actualizado exitosamente por el Administrador!");
        
    } else if (usuarioActivo.rol === 'instructor') {
        if (nuevoRolDeseado === 'aprendiz') {
            const usuarioTarget = usuarios.find(u => u.correo === correoObjetivo);
            
            if (usuarioTarget && usuarioTarget.rol === 'usuario') {
                usuarios = usuarios.map(user => {
                    if (user.correo === correoObjetivo) {
                        return { ...user, rol: 'aprendiz' };
                    }
                    return user;
                });
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                alert("¡Usuario convertido a Aprendiz exitosamente!");
            } else {
                alert("Los instructores solo pueden convertir a usuarios normales en aprendices.");
            }
        } else {
            alert("No tienes permisos de Administrador para asignar este rol.");
        }
    } else {
        alert("Acción no autorizada.");
    }
}