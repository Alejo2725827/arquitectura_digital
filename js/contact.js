document.addEventListener("click", function (event) {
    if (event.target && event.target.id === "whatsapp") {
        console.log('✅ Botón de WhatsApp presionado');

        console.log('✅ Botón de WhatsApp presionado');

        const name = document.getElementById("name").value.trim();
        const service = document.getElementById("service").value;

        if (!name || !service) {
            alert("⚠️ Por favor, completa todos los campos antes de enviar.");
            return;
        }

        const websiteURL = "https://alejo2725827.github.io/arquitectura_digital";
        const message = `¡Hola! Mi nombre es *${name}* y estoy interesado en el servicio de *${service}*.  
        Puedes ver más información aquí: ${websiteURL}`;

        const whatsappURL = `https://wa.me/573002725827?text=${encodeURIComponent(message)}`;

        console.log('🔗 Abriendo WhatsApp:', whatsappURL);
        window.open(whatsappURL, "_blank");
    }
});
