// ============================================================
// Variáveis globais
// ============================================================

let paginaAtual = 1;
const ITENS_POR_PAGINA = 5;
let usuariosGlobais = [];
let usuariosFiltrados = [];

// ============================================================
// Renderização de usuários com paginação
// ============================================================

function mostrarUsuarios(usuarios) {
    const lista = document.getElementById("lista");
    const contador = document.getElementById("contador");

    lista.innerHTML = "";

    const totalPaginas = Math.ceil(usuarios.length / ITENS_POR_PAGINA);
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const usuariosPagina = usuarios.slice(inicio, fim);

    usuariosPagina.forEach((usuario) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <strong>${usuario.name}</strong><br>
            📧 ${usuario.email}<br>
            🌍 ${usuario.website}
        `;

        li.addEventListener("click", () => abrirModal(usuario));

        lista.appendChild(li);
    });

    // Atualiza o contador
    contador.textContent = usuarios.length === 0
        ? "Nenhum usuário encontrado"
        : `Exibindo ${usuariosPagina.length} de ${usuarios.length} usuário(s) — Página ${paginaAtual} de ${totalPaginas}`;

    // Atualiza botões de paginação
    atualizarBotoesPaginacao(usuarios);
}

// ============================================================
// Paginação
// ============================================================

function atualizarBotoesPaginacao(usuarios) {
    const totalPaginas = Math.ceil(usuarios.length / ITENS_POR_PAGINA);
    const paginacao = document.getElementById("paginacao");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");

    if (!paginacao || !btnAnterior || !btnProximo) return;

    paginacao.style.display = usuarios.length === 0 ? "none" : "flex";
    btnAnterior.disabled = paginaAtual <= 1;
    btnProximo.disabled = paginaAtual >= totalPaginas;
}

function irParaPagina(direcao, usuarios) {
    const totalPaginas = Math.ceil(usuarios.length / ITENS_POR_PAGINA);

    paginaAtual = Math.min(Math.max(paginaAtual + direcao, 1), totalPaginas);

    mostrarUsuarios(usuarios);
}

// ============================================================
// Detalhes do usuário
// ============================================================

function abrirModal(usuario) {
    const modal = document.getElementById("modal");
    const detalhes = document.getElementById("detalhes");

    detalhes.innerHTML = `
        <h3>${usuario.name}</h3>
        📧 ${usuario.email}<br>
        📱 ${usuario.phone}<br>
        🏢 ${usuario.company.name}
    `;

    modal.style.display = "block";
}

// ============================================================
// Busca de usuários na API
// ============////////////////////////////////////////////////

async function buscarUsuarios() {
    const status = document.getElementById("status");
    const lista = document.getElementById("lista");
    const loading = document.getElementById("loading");
    const botao = document.querySelector("button");

    botao.disabled = true;
    status.textContent = "Carregando...";
    lista.innerHTML = "";
    loading.style.display = "block";

    try {
        const resposta = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados");
        }

        usuariosGlobais = await resposta.json();

        status.textContent = "";
        mostrarUsuarios(usuariosGlobais);

    } catch (erro) {
        status.textContent = "Erro ao carregar usuários";
        console.error(erro);

    } finally {
        loading.style.display = "none";
        botao.disabled = false;
    }
}

// ============================================================
// Lista
// ============================================================

document.getElementById("btnBuscar")
    .addEventListener("click", buscarUsuarios);

document.getElementById("filtro")
    .addEventListener("input", function () {
        const texto = this.value.toLowerCase();

        usuariosFiltrados = usuariosGlobais.filter((usuario) =>
            usuario.name.toLowerCase().includes(texto)
        );

        paginaAtual = 1;
        mostrarUsuarios(usuariosFiltrados);
    });

document.getElementById("btnAnterior")
    ?.addEventListener("click", () => irParaPagina(-1, usuariosFiltrados.length ? usuariosFiltrados : usuariosGlobais));

document.getElementById("btnProximo")
    ?.addEventListener("click", () => irParaPagina(1, usuariosFiltrados.length ? usuariosFiltrados : usuariosGlobais));

document.getElementById("modoTema")
    .addEventListener("click", function () {
        document.body.classList.toggle("dark");
    });

document.getElementById("fechar")
    .addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });