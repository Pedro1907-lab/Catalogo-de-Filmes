const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// ARRAY - ESTRUTURA DE ARMAZENAMENTO
// ==========================================

let filmes = [
    {
        id: 1,
        titulo: "Interestelar",
        genero: "Ficção Científica",
        ano: 2014,
        diretor: "Christopher Nolan",
        nota: 8.7
    },
    {
        id: 2,
        titulo: "O Poderoso Chefão",
        genero: "Drama",
        ano: 1972,
        diretor: "Francis Ford Coppola",
        nota: 9.2
    },
    {
        id: 3,
        titulo: "Homem-Aranha: Sem Volta Para Casa",
        genero: "Ação",
        ano: 2021,
        diretor: "Jon Watts",
        nota: 8.2
    }
];

// ==========================================
// CREATE - CRIAR FILME
// ==========================================

function criarFilme(dados) {
    const novoId = filmes.length > 0
        ? Math.max(...filmes.map(filme => filme.id)) + 1
        : 1;

    const novoFilme = {
        id: novoId,
        titulo: dados.titulo,
        genero: dados.genero,
        ano: Number(dados.ano),
        diretor: dados.diretor,
        nota: Number(dados.nota)
    };

    filmes.push(novoFilme);

    return novoFilme;
}

// ==========================================
// READ - LISTAR FILMES
// ==========================================

function listarFilmes() {
    return filmes;
}

// ==========================================
// READ - BUSCAR FILME POR ID
// ==========================================

function buscarFilmePorId(id) {
    return filmes.find(filme => filme.id === Number(id));
}

// ==========================================
// UPDATE - ATUALIZAR FILME
// ==========================================

function atualizarFilme(id, dados) {
    const indice = filmes.findIndex(
        filme => filme.id === Number(id)
    );

    if (indice === -1) {
        return null;
    }

    filmes[indice] = {
        id: Number(id),
        titulo: dados.titulo,
        genero: dados.genero,
        ano: Number(dados.ano),
        diretor: dados.diretor,
        nota: Number(dados.nota)
    };

    return filmes[indice];
}

// ==========================================
// DELETE - EXCLUIR FILME
// ==========================================

function excluirFilme(id) {
    const indice = filmes.findIndex(
        filme => filme.id === Number(id)
    );

    if (indice === -1) {
        return null;
    }

    const filmeExcluido = filmes[indice];

    filmes.splice(indice, 1);

    return filmeExcluido;
}

// ==========================================
// ROTAS DA API
// ==========================================

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API do Catálogo de Filmes funcionando!"
    });
});

// ==========================================
// GET /filmes
// READ - Lista todos os filmes
// ==========================================

app.get("/filmes", (req, res) => {
    res.json(listarFilmes());
});

// ==========================================
// GET /filmes/:id
// READ - Busca um filme específico
// ==========================================

app.get("/filmes/:id", (req, res) => {
    const filme = buscarFilmePorId(req.params.id);

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    res.json(filme);
});

// ==========================================
// POST /filmes
// CREATE - Cadastra um filme
// ==========================================

app.post("/filmes", (req, res) => {
    const { titulo, genero, ano, diretor, nota } = req.body;

    if (!titulo || !genero || !ano || !diretor || nota === undefined) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios."
        });
    }

    const novoFilme = criarFilme(req.body);

    res.status(201).json({
        mensagem: "Filme cadastrado com sucesso!",
        filme: novoFilme
    });
});

// ==========================================
// PUT /filmes/:id
// UPDATE - Atualiza um filme
// ==========================================

app.put("/filmes/:id", (req, res) => {
    const { titulo, genero, ano, diretor, nota } = req.body;

    if (!titulo || !genero || !ano || !diretor || nota === undefined) {
        return res.status(400).json({
            mensagem: "Todos os campos são obrigatórios."
        });
    }

    const filmeAtualizado = atualizarFilme(
        req.params.id,
        req.body
    );

    if (!filmeAtualizado) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    res.json({
        mensagem: "Filme atualizado com sucesso!",
        filme: filmeAtualizado
    });
});

// ==========================================
// DELETE /filmes/:id
// DELETE - Exclui um filme
// ==========================================

app.delete("/filmes/:id", (req, res) => {
    const filmeExcluido = excluirFilme(req.params.id);

    if (!filmeExcluido) {
        return res.status(404).json({
            mensagem: "Filme não encontrado."
        });
    }

    res.json({
        mensagem: "Filme excluído com sucesso!",
        filme: filmeExcluido
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});