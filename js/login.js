document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    const tokenInput = document.getElementById("token");
    const emailStep = document.getElementById("email-step");
    const tokenStep = document.getElementById("token-step");
    const btnVerifyEmail = document.getElementById("verify-email");
    const btnVerifyToken = document.getElementById("verify-token");

    const API_USUARIOS = "http://34.58.87.183/api/usuarios";
    const API_AUTENTICACION = "http://34.56.85.127/test-email";

    let userEmail = "";
    let usuario = {};
    let generatedToken = ""; // se simula el token que envía la API

    // 1️⃣ Paso 1: Verificar si el correo existe
    btnVerifyEmail.addEventListener("click", async () => {
        userEmail = emailInput.value.trim();

        if (!userEmail) {
            alert("Por favor, ingresa tu correo electrónico.");
            return;
        }

        try {
            const response = await fetch(API_USUARIOS);
            if (!response.ok) throw new Error("No se pudo conectar con la API de usuarios.");

            const data = await response.json();

            // Buscar si el correo existe en la lista
            usuario = data.data.find(u => u.email === userEmail);

            if (!usuario) {
                alert("El correo no está registrado. Verifica tu correo o regístrate.");
                return;
            }

            // 2️⃣ Enviar solicitud para mandar el token al correo
            const sendToken = await fetch(API_AUTENTICACION, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, nombre: usuario.nombre_completo })
            });

            if (!sendToken.ok) throw new Error("Error al enviar el token al correo.");

            alert(`Se ha enviado un token a tu correo (${userEmail}).`);
            generatedToken = generarToken(); // Simulamos el token localmente

            // Mostrar campo de token y botón de verificación
            tokenStep.style.display = "block";
            btnVerifyToken.style.display = "block";

            // Ocultar paso de correo y su botón
            emailStep.style.display = "none";
            btnVerifyEmail.style.display = "none";

        } catch (error) {
            console.error("Error al verificar el correo:", error);
            alert(error.message);
        }
    });

    // 3️⃣ Paso 2: Verificar token
    btnVerifyToken.addEventListener("click", () => {
        const tokenIngresado = tokenInput.value.trim();

        if (!tokenIngresado) {
            alert("Por favor, ingresa el token enviado a tu correo.");
            return;
        }

        // Aquí normalmente harías un POST a /verificar-token, pero lo simulamos:
        if (tokenIngresado === generatedToken) {
            alert("Inicio de sesión exitoso 🎉");
            localStorage.setItem("usuario", JSON.stringify({
                nombre: usuario.nombre_completo,
                email: usuario.email
            }));
            window.location.href = "index.html";
        } else {
            alert("Token incorrecto. Verifica e inténtalo de nuevo.");
        }
    });

    // 🔢 Función para simular token aleatorio
    function generarToken() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let token = "";
        for (let i = 0; i < 8; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log("Token simulado (para pruebas):", token);
        return token;
    }
});
