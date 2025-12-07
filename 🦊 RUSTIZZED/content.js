// CONFIGURACIÓN DE IDIOMA Y RECURSOS
const CONFIG = {
    repo: "https://github.com/CZeta415/my-public-extensions",
    lang: navigator.language.split('-')[0], // 'es', 'en', 'pt'
    dict: {
        es: { title: "🦊 RUSTIZZED v3.2", reload: "Recargar", fast: "⚡ Turbo", alert: "Estilos reaplicados." },
        en: { title: "🦊 RUSTIZZED v3.2", reload: "Reload", fast: "⚡ Turbo", alert: "Styles reapplied." },
        pt: { title: "🦊 RUSTIZZED v3.2", reload: "Recarregar", fast: "⚡ Turbo", alert: "Estilos reaplicados." }
    }
};

class RustFox {
    constructor() {
        this.txt = CONFIG.dict[CONFIG.lang] || CONFIG.dict.en;
        this.observer = null;
        this.iconInterval = null;
        this.isAlive = true;
    }

    init() {
        console.log("🦊 RUSTIZZED: Ready.");
        this.buildHUD();
        this.setFavicon(); // Ejecutar inmediatamente
        this.optimizeInput(true); // Pasada inicial
        this.observeDOM();
        
        // Loop de seguridad para icono y optimización
        this.iconInterval = setInterval(() => {
            if (!this.checkContext()) return;
            this.setFavicon();
            this.optimizeInput();
        }, 4000);
    }

    // Previene error
    checkContext() {
        if (!chrome?.runtime?.id) {
            this.isAlive = false;
            clearInterval(this.iconInterval);
            if (this.observer) this.observer.disconnect();
            console.warn("🦊 Extension actualizada o recargada. Deteniendo script huérfano.");
            return false;
        }
        return true;
    }

    buildHUD() {
        if (document.getElementById('rf-hud')) return;
        
        const hud = document.createElement('div');
        hud.id = 'rf-hud';
        hud.innerHTML = `
            <a href="${CONFIG.repo}" target="_blank" class="rf-link" title="Visit GitHub">${this.txt.title}</a>
            <div class="rf-controls">
                <button id="rf-fix">${this.txt.reload}</button>
                <button id="rf-turbo">${this.txt.fast}</button></div>`;
        document.body.appendChild(hud);

        document.getElementById('rf-fix').onclick = () => { this.styleChat(); alert(this.txt.alert); };
        document.getElementById('rf-turbo').onclick = () => this.optimizeInput(true);
    }

    setFavicon() {
        if (!this.isAlive) return;
        try {
            // Eliminar anteriores para evitar acumulación
            document.querySelectorAll("link[rel*='icon']").forEach(e => e.remove());
            const link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = chrome.runtime.getURL("logo.ico");
            document.head.appendChild(link);
        } catch (e) { this.checkContext(); }
    }

    optimizeInput(force = false) {
        const el = document.querySelector('textarea');
        if (!el || (!force && el.dataset.optimized)) return;
        
        // Desactiva correctores pesados
        ['spellcheck', 'autocomplete', 'autocorrect', 'autocapitalize'].forEach(a => el.setAttribute(a, 'false'));
        el.dataset.optimized = "true";
    }

    styleChat() {
        const bubbles = document.querySelectorAll('ms-chat-bubble, .turn-container');
        bubbles.forEach(b => {
            const isUser = b.innerHTML.includes('user-icon') || b.innerText.includes('You') || b.innerText.includes('Tú') || b.classList.contains('user-turn');
            b.setAttribute('data-role', isUser ? 'user' : 'model');
        });
    }

    observeDOM() {
        this.observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length)) this.styleChat();
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    }
}
// Inicialización segura
setTimeout(() => new RustFox().init(), 1000);