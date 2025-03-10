function navigate(event, section) {
    if (event) event.preventDefault();

    const page = `pages/${section}.html`;


    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error('Página no encontrada');
            return response.text();
        })
        .then(html => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = html;
            window.history.pushState({ section }, '', '#' + section);

            // Si es la sección de contacto, cargar el script solo si aún no ha sido agregado
            if (section === "contact" && !document.getElementById("contact-script")) {
                const script = document.createElement("script");
                script.src = "js/contact.js";
                script.id = "contact-script"; // Asignamos un ID para identificarlo
                // script.onload = () => console.log("✅ Script contact.js cargado correctamente");
                document.body.appendChild(script);
            }
        })
        .catch(error => {
            console.error('Error cargando la página:', error);
            document.getElementById('content').innerHTML = '<h2>Error al cargar la página</h2>';
        });
}


window.addEventListener('popstate', (event) => {
    const section = event.state?.section || 'home';
    navigate(null, section);
});

window.onload = () => {
    const section = location.hash.replace('#', '') || 'home';

    setTimeout(() => {

        navigate(null, section);
    }, 3000)

};

function toggleMenu() {
    document.querySelector(".navbar").classList.toggle("show");
}

function toggleChat() {
    const chat = document.getElementById("chatContainer");
    chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

// function sendMessage() {
//     const input = document.getElementById("chatInput");
//     const message = input.value.trim();
//     if (message === "") return;

//     const chatBody = document.getElementById("chatBody");

//     // Agregar mensaje del usuario
//     const userMessage = document.createElement("p");
//     userMessage.innerHTML = `<strong>Tú:</strong> ${message}`;
//     chatBody.appendChild(userMessage);

//     // Simular respuesta del bot
//     setTimeout(() => {
//         const botMessage = document.createElement("p");
//         botMessage.innerHTML = `<strong>Melissa:</strong> ¡Gracias por tu mensaje!`;
//         chatBody.appendChild(botMessage);

//         chatBody.scrollTop = chatBody.scrollHeight; // Desplazar hacia abajo
//     }, 1000);

//     input.value = "";
// }

async function sendMessageChatGPT(userMessage = null, isButton = false, questionId = null) {
    const API_URL = window.location.hostname === "127.0.0.1"
        ? "http://localhost:8000/chat"
        : "https://chatbot.n7bq4a2jrnjtg.us-east-1.cs.amazonlightsail.com/chat";


    const input = document.getElementById("chatInput");
    const message = userMessage || input.value.trim();
    if (message === "") return;

    const chatBody = document.getElementById("chatBody");
    chatBody.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;

    input.value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                is_button_response: isButton,
                question_id: questionId // Asegurar que se envía el question_id correcto
            })
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();

        chatBody.innerHTML += data.response;

        scrollToBottom();

    } catch (error) {
        console.error("Error en la solicitud:", error);
        chatBody.innerHTML += `Error en el servidor.`;
    }
}

// Capturar "Enter" correctamente
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessageChatGPT(); // Solo enviamos el mensaje del input
    }
}

function enviarMensajeWhatsApp() {

    const websiteURL = "https://alejo2725827.github.io/arquitectura_digital";
    const message = `¡Hola! Estoy interesado en el servicios de Arquitectura Digital. Puedes ver más información aquí: ${websiteURL}`;

    const whatsappURL = `https://wa.me/573002725827?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}


function scrollToBottom() {
    const chatBody = document.getElementById("chatBody");
    setTimeout(() => {
        const lastMessage = chatBody.lastElementChild;
        if (lastMessage) {
            lastMessage.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
}