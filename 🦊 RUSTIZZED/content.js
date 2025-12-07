console.log("RUSTIZZED LOADED! 🦊⚡");

function init() {
    createHUD();
    changeIcon();
    startObserver();
    // Ejecutar una pasada inicial de estilos
    applyRaccoonStyles();
    
    // Configuración para el Input ultra-rápido
    setInterval(optimizeInputArea, 2000); 
}

// 1. CAMBIAR EL ICONO DE LA PESTAÑA (Usando logo.ico)
function changeIcon() {
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = chrome.runtime.getURL("logo.ico");
    
    const head = document.getElementsByTagName('head')[0];
    // Borrar antiguos
    document.querySelectorAll("link[rel*='icon']").forEach(e => e.remove());
    head.appendChild(link);
}

// 2. HUD DEL ZORRO
function createHUD() {
    if(document.getElementById('racco-hud')) return;
    const div = document.createElement('div');
    div.id = 'racco-hud';
    div.innerHTML = `
        <span class="racco-title">🦊 RUSTIZZED v3.1b</span>
        <button id="btn-fix-chat" class="racco-btn">Recargar Chat</button>
        <button id="btn-turbo" class="racco-btn">⚡ Fast Input</button>
    `;
    document.body.appendChild(div);
    
    document.getElementById('btn-fix-chat').onclick = () => {
        applyRaccoonStyles();
        alert("Estilos reaplicados");
    };
    
    document.getElementById('btn-turbo').onclick = () => {
        optimizeInputArea(true);
    };
}

// 3. OPTIMIZAR EL ÁREA DE ESCRITURA (LA CLAVE DEL NO-LAG)
function optimizeInputArea(force = false) {
    const ta = document.querySelector('textarea');
    if (!ta) return;

    // Desactivar funciones costosas del navegador
    // "Spellcheck" y "Autocorrect" consumen MUCHA CPU mientras escribes.
    if (ta.getAttribute('spellcheck') !== 'false' || force) {
        ta.setAttribute('spellcheck', 'false');
        ta.setAttribute('autocomplete', 'off');
        ta.setAttribute('autocorrect', 'off');
        ta.setAttribute('autocapitalize', 'off');
        ta.setAttribute('data-gramm', 'false'); // Intenta desactivar Grammarly
        
        console.log("🦊 Input optimizado para velocidad máxima.");
    }
}

// 4. EL OBSERVER (Asegura que los mensajes nuevos tengan el color naranja)
function startObserver() {
    const observer = new MutationObserver((mutations) => {
        // Solo actuar si se agregan nodos significativos
        const needsUpdate = mutations.some(m => m.addedNodes.length > 0);
        if (needsUpdate) {
            applyRaccoonStyles();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// 5. APLICAR ESTILOS A MENSAJES
function applyRaccoonStyles() {
    // Buscamos cualquier contenedor que parezca un turno
    // ms-chat-bubble, turn-container, o divs genéricos dentro del área de historial
    const bubbles = document.querySelectorAll('ms-chat-bubble, .turn-container');
    
    bubbles.forEach(bubble => {
        // Lógica simple de detección:
        // Si tiene icono de usuario O dice "You"/"Tu" -> Usuario
        const isUser = bubble.innerHTML.includes('user-icon') || 
                       bubble.innerText.includes('You') || 
                       bubble.classList.contains('user-turn');

        if (isUser) {
            bubble.setAttribute('data-role', 'user');
        } else {
            bubble.setAttribute('data-role', 'model');
        }
    });
}

// Iniciar con seguridad
window.onload = init;
// Backup por si ya cargó
setTimeout(init, 1500);
setInterval(changeIcon, 5000); // Forzar icono cada tanto si Google lo cambia