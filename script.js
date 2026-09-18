const API_URL = "http://localhost:3000/filmes";

let filmes = [];


// ==========================================
// READ - BUSCAR FILMES
// ==========================================

async function carregarFilmes() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar filmes.");
        }

        filmes = await resposta.json();

        mostrarFilmes(filmes);

    } catch (erro) {

        console.error(erro);

        document.getElementById("lista-filmes").innerHTML = `
            <div class="sem-filmes">
                <h3>Não foi possível carregar os filmes.</h3>
                <p>Verifique se o servidor está funcionando.</p>
            </div>
        `;
    }
}


// ==========================================
// MOSTRAR FILMES NA TELA
// ==========================================

function mostrarFilmes(lista) {

    const container =
        document.getElementById("lista-filmes");

    container.innerHTML = "";

    if (lista.length === 0) {

        container.innerHTML = `
            <div class="sem-filmes">
                <h3>Nenhum filme encontrado.</h3>
                <p>Cadastre um novo filme para começar.</p>
            </div>
        `;

        return;
    }


    lista.forEach(filme => {

        const card =
            document.createElement("div");

        card.classList.add("filme-card");


        card.innerHTML = `

            <div class="poster">
                🎬
            </div>

            <div class="filme-info">

                <h3>
                    ${filme.titulo}
                </h3>

                <span class="genero">
                    ${filme.genero}
                </span>

                <div class="detalhes">

                    <p>
                        📅 Ano: ${filme.ano}
                    </p>

                    <p>
                        🎥 Diretor: ${filme.diretor}
                    </p>

                </div>

                <div class="nota">
                    ⭐ ${Number(filme.nota).toFixed(1)} / 10
                </div>

                <div class="acoes">

                    <button
                        class="btn-editar"
                        onclick="editarFilme(${filme.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirFilme(${filme.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </div>
        `;


        container.appendChild(card);

    });
}


// ==========================================
// CREATE / UPDATE
// FORMULÁRIO
// ==========================================

document
    .getElementById("filme-form")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("filme-id").value;


        const filme = {

            titulo:
                document.getElementById("titulo").value,

            genero:
                document.getElementById("genero").value,

            ano:
                Number(
                    document.getElementById("ano").value
                ),

            diretor:
                document.getElementById("diretor").value,

            nota:
                Number(
                    document.getElementById("nota").value
                )
        };


        try {

            let resposta;


            // ==================================
            // UPDATE
            // ==================================

            if (id) {

                resposta = await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(filme)
                    }
                );

            }


            // ==================================
            // CREATE
            // ==================================

            else {

                resposta = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(filme)
                    }
                );

            }


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                alert(
                    dados.mensagem ||
                    "Ocorreu um erro."
                );

                return;
            }


            alert(dados.mensagem);


            limparFormulario();

            carregarFilmes();


        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao conectar com o servidor."
            );
        }

    });


// ==========================================
// EDITAR FILME
// ==========================================

function editarFilme(id) {

    const filme =
        filmes.find(
            filme => filme.id === id
        );


    if (!filme) {
        return;
    }


    document.getElementById("filme-id").value =
        filme.id;

    document.getElementById("titulo").value =
        filme.titulo;

    document.getElementById("genero").value =
        filme.genero;

    document.getElementById("ano").value =
        filme.ano;

    document.getElementById("diretor").value =
        filme.diretor;

    document.getElementById("nota").value =
        filme.nota;


    document.getElementById("form-titulo").textContent =
        "Editar filme";


    document.getElementById("btn-salvar").textContent =
        "Salvar alterações";


    document.getElementById("btn-cancelar").style.display =
        "inline-block";


    document
        .getElementById("cadastro")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ==========================================
// CANCELAR EDIÇÃO
// ==========================================

function cancelarEdicao() {

    limparFormulario();

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    document
        .getElementById("filme-form")
        .reset();


    document
        .getElementById("filme-id")
        .value = "";


    document
        .getElementById("form-titulo")
        .textContent =
        "Cadastrar novo filme";


    document
        .getElementById("btn-salvar")
        .textContent =
        "Cadastrar filme";


    document
        .getElementById("btn-cancelar")
        .style.display =
        "none";
}


// ==========================================
// DELETE - EXCLUIR FILME
// ==========================================

async function excluirFilme(id) {

    const filme =
        filmes.find(
            filme => filme.id === id
        );


    if (!filme) {
        return;
    }


    const confirmar =
        confirm(
            `Deseja realmente excluir o filme "${filme.titulo}"?`
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                dados.mensagem ||
                "Erro ao excluir filme."
            );

            return;
        }


        alert(dados.mensagem);


        carregarFilmes();


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao conectar com o servidor."
        );
    }
}


// ==========================================
// PESQUISAR FILMES
// ==========================================

function filtrarFilmes() {

    const texto =
        document
            .getElementById("pesquisa")
            .value
            .toLowerCase();


    const resultados =
        filmes.filter(filme =>

            filme.titulo
                .toLowerCase()
                .includes(texto)

            ||

            filme.genero
                .toLowerCase()
                .includes(texto)

            ||

            filme.diretor
                .toLowerCase()
                .includes(texto)
        );


    mostrarFilmes(resultados);
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarFilmes();