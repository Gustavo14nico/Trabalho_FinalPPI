import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "localhost";
const port = 3000;

const app = express();
const ListaEquipe = [];
const jogadores = [];

function auth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

function generateNavbar(req, activePage = '') {
    return `
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="/home"><i class="bi bi-trophy-fill"></i> Campeonato de LOL Amador da FIPP</a>
                <span class="navbar-text text-light me-3 d-none d-md-block">
                    <i class="bi bi-clock"></i> Último acesso: ${req.cookies.ultimoAcesso || "Primeiro acesso"}
                </span>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="/home"><i class="bi bi-house-door"></i> Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'cadastro-equipe' ? 'active' : ''}" href="/cadastro/equipe"><i class="bi bi-people"></i> Cadastro de Equipes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'cadastro-jogador' ? 'active' : ''}" href="/cadastro/jogador"><i class="bi bi-person-plus"></i> Cadastro de Jogadores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'listagem-equipes' ? 'active' : ''}" href="/listagem/equipes"><i class="bi bi-people-fill"></i> Listagem de Equipes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${activePage === 'listagem-jogadores' ? 'active' : ''}" href="/listagem/jogadores"><i class="bi bi-person-lines-fill"></i> Listagem de Jogadores</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout"><i class="bi bi-box-arrow-right"></i> Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "minh4Chav3S3cr3t4",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 30,
        },
    })
);

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Login - Campeonato de LOL Amador da FIPP</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .login-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    padding: 40px;
                    width: 100%;
                    max-width: 420px;
                    animation: slideUp 0.5s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .logo-container {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo-icon {
                    font-size: 4rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }
                .title {
                    font-weight: 700;
                    color: #2d3748;
                    font-size: 1.75rem;
                    margin-bottom: 5px;
                }
                .subtitle {
                    color: #718096;
                    font-size: 0.9rem;
                }
                .form-label {
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 8px;
                }
                .form-control {
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 12px 15px;
                    transition: all 0.3s ease;
                }
                .form-control:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                }
                .form-text.text-danger {
                    font-size: 0.85rem;
                    margin-top: 5px;
                }
                </style>
                </head>
                <body>
                    <div class="login-container">
                        <div class="logo-container">
                            <i class="bi bi-trophy-fill logo-icon"></i>
                            <h4 class="title">Campeonato de LOL Amador da FIPP</h4>
                            <p class="subtitle">Sistema de Gerenciamento</p>
                        </div>
                        <form method="POST" action="/login">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-person"></i> Usuário</label>
                                <input type="text" class="form-control" name="username" placeholder="Digite seu usuário" />
                            </div>
                            <div class="mb-4">
                                <label class="form-label"><i class="bi bi-lock"></i> Senha</label>
                                <input type="password" class="form-control" name="password" placeholder="Digite sua senha" />
                            </div>
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="bi bi-box-arrow-in-right"></i> Entrar
                            </button>
                        </form>
                    </div>
                </body>
                </html>`);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        req.session.user = {
            nome: "Administrador",
            login: username,
        };

        const dataAtual = new Date();
        res.cookie("ultimoAcesso", dataAtual.toLocaleString());

        res.redirect("/home");
    } else {
        let conteudo = `<!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Login - Campeonato de LOL Amador da FIPP</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .login-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    padding: 40px;
                    width: 100%;
                    max-width: 420px;
                    animation: slideUp 0.5s ease-out;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .logo-container {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo-icon {
                    font-size: 4rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }
                .title {
                    font-weight: 700;
                    color: #2d3748;
                    font-size: 1.75rem;
                    margin-bottom: 5px;
                }
                .subtitle {
                    color: #718096;
                    font-size: 0.9rem;
                }
                .form-label {
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 8px;
                }
                .form-control {
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 12px 15px;
                    transition: all 0.3s ease;
                }
                .form-control:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                }
                .form-text.text-danger {
                    font-size: 0.85rem;
                    margin-top: 5px;
                }
                </style>
                </head>
                <body>
                    <div class="login-container">
                        <div class="logo-container">
                            <i class="bi bi-trophy-fill logo-icon"></i>
                            <h4 class="title">Campeonato de LOL Amador da FIPP</h4>
                            <p class="subtitle">Sistema de Gerenciamento</p>
                        </div>
                        <form method="POST" action="/login">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-person"></i> Usuário</label>
                                <input type="text" class="form-control" name="username" value="${username || ''}" placeholder="Digite seu usuário" />
                                       `
        if (!username) {
            conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo usuário é obrigatório.</div>`;
        }

        conteudo += `</div>
                                    <div class="mb-4">
                                        <label class="form-label"><i class="bi bi-lock"></i> Senha</label>
                                        <input type="password" class="form-control" name="password" placeholder="Digite sua senha" />
                                        `
        if (!password) {
            conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo senha é obrigatório.</div>`;
        }
        conteudo += `  </div >
            <button type="submit" class="btn btn-primary w-100"><i class="bi bi-box-arrow-in-right"></i> Entrar</button>
                                </form >
                        </div >
                    </div >
                </body >
                </html > `;
        res.setHeader("Content-Type", "text/html");
        res.send(conteudo);
    }
});

app.get("/logout", auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get("/home", auth, (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home - Campeonato de LOL Amador da FIPP</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                min-height: 100vh;
            }
            .navbar {
                background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%) !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 1rem 0;
            }
            .navbar-brand {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .nav-link {
                color: #e2e8f0 !important;
                font-weight: 500;
            }
            .nav-link:hover, .nav-link.active {
                color: #667eea !important;
            }
            .dropdown-menu {
                background: #2d3748;
                border: none;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .dropdown-item {
                color: #e2e8f0;
                transition: all 0.3s ease;
            }
            .dropdown-item:hover {
                background: #667eea;
                color: white;
            }
            .main-content {
                padding: 30px 20px;
            }
            .welcome-card {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            .welcome-title {
                font-size: 2rem;
                font-weight: 700;
                color: #667eea;
                margin-bottom: 10px;
            }
            .rules-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }
            .rules-card h5 {
                font-weight: 700;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }
            .rules-card ul {
                list-style: none;
                padding: 0;
            }
            .rules-card li {
                padding: 10px 0;
                padding-left: 30px;
                position: relative;
            }
            .rules-card li:before {
                content: "✓";
                position: absolute;
                left: 0;
                font-weight: bold;
                font-size: 1.2rem;
            }
            .action-card {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 25px;
                height: 100%;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            .action-card:hover {
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
            }
            .action-card .card-title {
                font-weight: 700;
                color: #2d3748;
                margin-bottom: 15px;
                font-size: 1.3rem;
            }
            .action-card .card-text {
                color: #718096;
                margin-bottom: 20px;
            }
            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 8px;
                padding: 10px 25px;
                font-weight: 600;
            }
            .icon-large {
                font-size: 2.5rem;
                color: #667eea;
                margin-bottom: 15px;
            }
            .stats-badge {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            </style>
        </head>
        <body>
        ${generateNavbar(req, 'home')}
        <div class="main-content">
            <div class="container">
                <div class="rules-card">
                    <h5><i class="bi bi-info-circle"></i> Regras do Campeonato</h5>
                    <ul>
                        <li>Cada equipe deve conter exatamente 5 jogadores.</li>
                        <li>Jogadores só podem estar registrados em uma equipe.</li>
                        <li>Somente jogadores cadastrados poderão participar.</li>
                        <li>Cada função (top, jungle, mid, atirador, suporte) deve ser única por equipe.</li>
                    </ul>
                </div>
                
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="action-card">
                            <div class="text-center">
                                <i class="bi bi-people icon-large"></i>
                            </div>
                            <h5 class="card-title text-center">Cadastro de Equipes</h5>
                            <p class="card-text text-center">Cadastre novas equipes participantes do campeonato. Defina o nome da equipe e informações do capitão.</p>
                            <div class="text-center">
                                <a href="/cadastro/equipe" class="btn btn-primary">
                                    <i class="bi bi-plus-circle"></i> Ir para Cadastro de Equipes
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="action-card">
                            <div class="text-center">
                                <i class="bi bi-person-plus icon-large"></i>
                            </div>
                            <h5 class="card-title text-center">Cadastro de Jogadores</h5>
                            <p class="card-text text-center">Adicione jogadores às equipes cadastradas. Informe nome, nickname, função, elo e gênero.</p>
                            <div class="text-center">
                                <a href="/cadastro/jogador" class="btn btn-primary">
                                    <i class="bi bi-plus-circle"></i> Ir para Cadastro de Jogadores
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);

});

// CSS comum simplificado
const commonStyles = `
    body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        min-height: 100vh;
    }
    .navbar {
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%) !important;
    }
    .navbar-brand {
        font-weight: 700;
        color: #667eea !important;
    }
    .main-content {
        padding: 30px 20px;
    }
    .form-card {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        max-width: 700px;
        margin: 0 auto;
    }
    .form-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #667eea;
        text-align: center;
        margin-bottom: 25px;
    }
    .form-label {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 8px;
    }
    .form-control, .form-select {
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px 15px;
    }
    .form-control:focus, .form-select:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 8px;
        padding: 10px 25px;
        font-weight: 600;
    }
    .btn-secondary {
        background: #718096;
        border: none;
        border-radius: 8px;
        padding: 10px 25px;
        font-weight: 600;
    }
    .form-text.text-danger {
        font-size: 0.85rem;
        margin-top: 5px;
        color: #e53e3e !important;
    }
    .alert-danger {
        background: #e53e3e;
        color: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
    }
`;

app.get("/cadastro/equipe", auth, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Equipe - Campeonato de LOL Amador da FIPP</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <style>${commonStyles}</style>
        </head>
        <body>
        ${generateNavbar(req, 'cadastro-equipe')}
        <div class="main-content">
            <div class="container">
                <div class="form-card">
                    <h3 class="form-title"><i class="bi bi-people"></i> Cadastro de Equipe</h3>
                    <form method="POST" action="/cadastro/equipe">
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-trophy"></i> Nome da Equipe</label>
                            <input type="text" class="form-control" name="nomeEquipe" placeholder="Digite o nome da equipe">
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-person-badge"></i> Nome do Capitão Responsável</label>
                            <input type="text" class="form-control" name="capitao" placeholder="Digite o nome do capitão">
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-telephone"></i> Telefone/WhatsApp do Capitão</label>
                            <input type="text" class="form-control" name="telefone" placeholder="(DDD) 9 9999-9999">
                        </div>
                        <div class="d-flex justify-content-between mt-4">
                            <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Cadastrar Equipe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
`);

});

app.post("/cadastro/equipe", auth, (req, res) => {

    const { nomeEquipe, capitao, telefone } = req.body;

    if (nomeEquipe && capitao && telefone) {
        ListaEquipe.push({ nomeEquipe, capitao, telefone });
        return res.redirect(`/cadastro/jogador?equipe=${encodeURIComponent(nomeEquipe)}`);
    } else {
        let conteudo = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Equipe - Campeonato de LOL Amador da FIPP</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <style>${commonStyles}</style>
        </head>
        <body>
        ${generateNavbar(req, 'cadastro-equipe')}
        <div class="main-content">
            <div class="container">
                <div class="form-card">
                    <h3 class="form-title"><i class="bi bi-people"></i> Cadastro de Equipe</h3>
                    <form method="POST" action="/cadastro/equipe">
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-trophy"></i> Nome da Equipe</label>
                            <input type="text" class="form-control" name="nomeEquipe" value="${nomeEquipe || ''}" placeholder="Digite o nome da equipe">
                            `;
        if (!nomeEquipe) {
            conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo nome da equipe é obrigatório.</div>`;
        }
        conteudo += `
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-person-badge"></i> Nome do Capitão Responsável</label>
                            <input type="text" class="form-control" name="capitao" value="${capitao || ''}" placeholder="Digite o nome do capitão">
                            `;
        if (!capitao) {
            conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo nome do capitão é obrigatório.</div>`;
        }
        conteudo += `
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-telephone"></i> Telefone/WhatsApp do Capitão</label>
                            <input type="text" class="form-control" name="telefone" placeholder="(DDD) 9 9999-9999" value="${telefone || ''}">
                            `;
        if (!telefone) {
            conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo telefone/WhatsApp é obrigatório.</div>`;
        }
        conteudo += `
                        </div>
                        <div class="d-flex justify-content-between mt-4">
                            <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Cadastrar Equipe</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>`;
        res.setHeader("Content-Type", "text/html");
        res.send(conteudo);
    }
});

app.get("/listagem/equipes", auth, (req, res) => {
    let conteudo = `<!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Listagem de Equipes - Campeonato de LOL Amador da FIPP</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                        <style>
                        ${commonStyles}
                        .list-card {
                            background: rgba(255, 255, 255, 0.95);
                            backdrop-filter: blur(10px);
                            border-radius: 20px;
                            padding: 30px;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                            animation: fadeIn 0.5s ease-out;
                        }
                        .page-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 30px;
                            flex-wrap: wrap;
                            gap: 15px;
                        }
                        .page-title {
                            font-size: 2rem;
                            font-weight: 700;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                            margin: 0;
                        }
                        .table-container {
                            overflow-x: auto;
                            border-radius: 15px;
                            overflow: hidden;
                        }
                        .table {
                            margin-bottom: 0;
                        }
                        .table thead {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .table thead th {
                            border: none;
                            padding: 15px;
                            font-weight: 600;
                            text-transform: uppercase;
                            font-size: 0.85rem;
                            letter-spacing: 0.5px;
                        }
        .table tbody tr:hover {
            background: rgba(102, 126, 234, 0.1);
        }
                        .table tbody td {
                            padding: 15px;
                            vertical-align: middle;
                            border-color: #e2e8f0;
                        }
                        .empty-state {
                            text-align: center;
                            padding: 60px 20px;
                            color: #718096;
                        }
                        .empty-state i {
                            font-size: 4rem;
                            margin-bottom: 20px;
                            opacity: 0.5;
                        }
                        </style>
                    </head>
                    <body>
                    ${generateNavbar(req, 'listagem-equipes')}
                    <div class="main-content">
                        <div class="container">
                            <div class="list-card">
                                <div class="page-header">
                                    <h3 class="page-title"><i class="bi bi-people-fill"></i> Equipes Cadastradas</h3>
                                    <a href="/cadastro/equipe" class="btn btn-primary"><i class="bi bi-plus-circle"></i> Nova Equipe</a>
                                </div>
                                <div class="table-container">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th><i class="bi bi-trophy"></i> Nome da Equipe</th>
                                                <th><i class="bi bi-person-badge"></i> Capitão</th>
                                                <th><i class="bi bi-telephone"></i> Telefone</th>
                                                <th><i class="bi bi-gear"></i> Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;

    if (ListaEquipe.length === 0) {
        conteudo += `
                                            <tr>
                                                <td colspan="5">
                                                    <div class="empty-state">
                                                        <i class="bi bi-inbox"></i>
                                                        <h5>Nenhuma equipe cadastrada</h5>
                                                        <p>Comece cadastrando sua primeira equipe!</p>
                                                    </div>
                                                </td>
                                            </tr>`;
    } else {
        for (let i = 0; i < ListaEquipe.length; i++) {
            let quantidadeJogadores = 0;
            for (let j = 0; j < jogadores.length; j++) {
                if (jogadores[j].equipe === ListaEquipe[i].nomeEquipe) {
                    quantidadeJogadores++;
                }
            }
            const disabled = quantidadeJogadores >= 5 ? ' disabled' : '';
            const badge = quantidadeJogadores >= 5 ? 'Completa' : `${quantidadeJogadores}/5`;
            conteudo += `
                                            <tr>
                                                <td><strong>${i + 1}</strong></td>
                                                <td><strong>${ListaEquipe[i].nomeEquipe}</strong> <span class="badge bg-secondary ms-2">${badge}</span></td>
                                                <td>${ListaEquipe[i].capitao}</td>
                                                <td><i class="bi bi-whatsapp text-success"></i> ${ListaEquipe[i].telefone}</td>
                                                <td>
                                                    <a href="/cadastro/jogador?equipe=${encodeURIComponent(ListaEquipe[i].nomeEquipe)}" class="btn btn-sm btn-primary"${disabled}>
                                                        <i class="bi bi-person-plus"></i> Adicionar Jogador
                                                    </a>
                                                </td>
                                            </tr>`;
        }
    }
    conteudo += `
                                        </tbody>
                                    </table>
                                </div>
                                <div class="mt-4">
                                    <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.get("/cadastro/jogador", auth, (req, res) => {
    const equipeSelecionada = req.query.equipe;

    // Se não houver equipe selecionada, mostrar página de seleção
    if (!equipeSelecionada) {
        if (ListaEquipe.length === 0) {
            let conteudo = `<!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Selecionar Equipe - Campeonato de LOL Amador da FIPP</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                    <style>${commonStyles}</style>
                </head>
                <body>
                ${generateNavbar(req, 'cadastro-jogador')}
                <div class="main-content">
                    <div class="container">
                        <div class="form-card">
                            <h3 class="form-title"><i class="bi bi-exclamation-triangle"></i> Nenhuma Equipe Cadastrada</h3>
                            <div class="alert alert-warning text-center">
                                <p>Você precisa cadastrar pelo menos uma equipe antes de adicionar jogadores.</p>
                                <a href="/cadastro/equipe" class="btn btn-primary"><i class="bi bi-plus-circle"></i> Cadastrar Equipe</a>
                            </div>
                            <div class="text-center mt-3">
                                <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
                </body>
                </html>
            `;
            res.setHeader("Content-Type", "text/html");
            return res.send(conteudo);
        }

        // Mostrar página de seleção de equipe
        let opcoesEquipes = "";
        for (let i = 0; i < ListaEquipe.length; i++) {
            let quantidadeJogadores = 0;
            for (let j = 0; j < jogadores.length; j++) {
                if (jogadores[j].equipe === ListaEquipe[i].nomeEquipe) {
                    quantidadeJogadores++;
                }
            }
            const disabled = quantidadeJogadores >= 5 ? ' disabled' : '';
            const badge = quantidadeJogadores >= 5 ? ' (Completa)' : ` (${quantidadeJogadores}/5)`;
            opcoesEquipes += `<option value="${ListaEquipe[i].nomeEquipe}"${disabled}>${ListaEquipe[i].nomeEquipe}${badge}</option>`;
        }

        let conteudo = `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Selecionar Equipe - Campeonato de LOL Amador da FIPP</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
                <style>${commonStyles}</style>
            </head>
            <body>
            ${generateNavbar(req, 'cadastro-jogador')}
            <div class="main-content">
                <div class="container">
                    <div class="form-card">
                        <h3 class="form-title"><i class="bi bi-people"></i> Selecione a Equipe</h3>
                        <p class="text-center text-muted mb-4">Escolha a equipe para adicionar um novo jogador</p>
                        <form method="GET" action="/cadastro/jogador">
                            <div class="mb-4">
                                <label class="form-label"><i class="bi bi-trophy"></i> Equipe</label>
                                <select class="form-select" name="equipe" required>
                                    <option value="" disabled selected>Selecione uma equipe</option>
                                    ${opcoesEquipes}
                                </select>
                            </div>
                            <div class="d-flex justify-content-between mt-4">
                                <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                                <button type="submit" class="btn btn-primary"><i class="bi bi-arrow-right"></i> Continuar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `;
        res.setHeader("Content-Type", "text/html");
        return res.send(conteudo);
    }

    // Se houver equipe selecionada, mostrar formulário de cadastro
    let opcoesEquipes = "";
    for (let i = 0; i < ListaEquipe.length; i++) {
        const selected = equipeSelecionada === ListaEquipe[i].nomeEquipe ? ' selected' : '';
        opcoesEquipes += `<option value="${ListaEquipe[i].nomeEquipe}"${selected}>${ListaEquipe[i].nomeEquipe}</option>`;
    }

    let conteudo = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Jogador - Campeonato de LOL Amador da FIPP</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
            <style>${commonStyles}</style>
        </head>
        <body>
        ${generateNavbar(req, 'cadastro-jogador')}
        <div class="main-content">
            <div class="container">
                <div class="form-card">
                    <h3 class="form-title"><i class="bi bi-person-plus"></i> Cadastro de Jogador</h3>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> Equipe selecionada: <strong>${equipeSelecionada}</strong>
                    </div>
                    <form method="POST" action="/cadastro/jogador">
                        <input type="hidden" name="equipe" value="${equipeSelecionada}">
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-person"></i> Nome do Jogador</label>
                            <input type="text" class="form-control" name="nome" placeholder="Digite o nome completo" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-at"></i> Nickname</label>
                            <input type="text" class="form-control" name="nickname" placeholder="Digite o nickname do jogador" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-controller"></i> Função</label>
                            <select class="form-select" name="funcao" required>
                                <option value="" disabled selected>Selecione uma função</option>
                                <option value="top">Top</option>
                                <option value="jungle">Jungle</option>
                                <option value="mid">Mid</option>
                                <option value="atirador">Atirador</option>
                                <option value="suporte">Suporte</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-trophy"></i> Elo</label>
                            <select class="form-select" name="elo" required>
                                <option value="" disabled selected>Selecione o seu elo</option>
                                <option value="Ferro">Ferro</option>
                                <option value="Bronze">Bronze</option>
                                <option value="Prata">Prata</option>
                                <option value="Ouro">Ouro</option>
                                <option value="Platina">Platina</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-gender-ambiguous"></i> Gênero</label>
                            <select class="form-select" name="genero" required>
                                <option value="" disabled selected>Selecione o seu gênero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div class="d-flex justify-content-between mt-4">
                            <a href="/cadastro/jogador" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                            <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Cadastrar Jogador</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.post("/cadastro/jogador", auth, (req, res) => {
    const { nome, equipe, funcao, elo, genero, nickname } = req.body;

    let opcoesEquipes = "";
    for (let i = 0; i < ListaEquipe.length; i++) {
        const selected = equipe === ListaEquipe[i].nomeEquipe ? ' selected' : '';
        opcoesEquipes += `<option value="${ListaEquipe[i].nomeEquipe}"${selected}>${ListaEquipe[i].nomeEquipe}</option>`;
    }

    let quantidadeJogadores = 0;
    for (let i = 0; i < jogadores.length; i++) {
        if (jogadores[i].equipe === equipe) {
            quantidadeJogadores++;
        }
    }

    let erroEquipe = "";
    if (quantidadeJogadores >= 5) {
        erroEquipe = `A equipe ${equipe} já possui 5 jogadores cadastrados.`;
    }

    let funcaoOcupada = false;
    for (let i = 0; i < jogadores.length; i++) {
        if (jogadores[i].equipe === equipe && jogadores[i].funcao === funcao) {
            funcaoOcupada = true;
        }
    }

    if (!erroEquipe && !funcaoOcupada && nome && equipe && funcao && elo && genero && nickname) {
        jogadores.push({ nome, equipe, funcao, elo, genero, nickname });
        return res.redirect(`/cadastro/jogador?equipe=${encodeURIComponent(equipe)}`);
    }

    let conteudo = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Jogador - Campeonato de LOL Amador da FIPP</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>${commonStyles}</style>
    </head>
    <body>
    ${generateNavbar(req, 'cadastro-jogador')}
    <div class="main-content">
        <div class="container">
            <div class="form-card">
                <h3 class="form-title"><i class="bi bi-person-plus"></i> Cadastro de Jogador</h3>
    `;

    if (erroEquipe) {
        conteudo += `
            <div class="alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> ${erroEquipe}
            </div>
        `;
    }

    conteudo += `
                <form method="POST" action="/cadastro/jogador">
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-person"></i> Nome do Jogador</label>
                        <input type="text" class="form-control" name="nome" value="${nome || ''}" placeholder="Digite o nome completo">
    `;

    if (!nome) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo nome do jogador é obrigatório.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-at"></i> Nickname</label>
                        <input type="text" class="form-control" name="nickname" value="${nickname || ''}" placeholder="Digite o nickname do jogador">
    `;

    if (!nickname) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo nickname é obrigatório.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-controller"></i> Função</label>
                        <select class="form-select" name="funcao">
                            <option value="" disabled ${!funcao ? 'selected' : ''}>Selecione uma função</option>
                            <option value="top" ${funcao === 'top' ? 'selected' : ''}>Top</option>
                            <option value="jungle" ${funcao === 'jungle' ? 'selected' : ''}>Jungle</option>
                            <option value="mid" ${funcao === 'mid' ? 'selected' : ''}>Mid</option>
                            <option value="atirador" ${funcao === 'atirador' ? 'selected' : ''}>Atirador</option>
                            <option value="suporte" ${funcao === 'suporte' ? 'selected' : ''}>Suporte</option>
                        </select>
    `;

    if (!funcao) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo função é obrigatório.</div>`;
    } else if (funcaoOcupada) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> A função ${funcao} já está ocupada nessa equipe.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-trophy"></i> Elo</label>
                        <select class="form-select" name="elo">
                            <option value="" disabled ${!elo ? 'selected' : ''}>Selecione o seu elo</option>
                            <option value="Ferro" ${elo === 'Ferro' ? 'selected' : ''}>Ferro</option>
                            <option value="Bronze" ${elo === 'Bronze' ? 'selected' : ''}>Bronze</option>
                            <option value="Prata" ${elo === 'Prata' ? 'selected' : ''}>Prata</option>
                            <option value="Ouro" ${elo === 'Ouro' ? 'selected' : ''}>Ouro</option>
                            <option value="Platina" ${elo === 'Platina' ? 'selected' : ''}>Platina</option>
                        </select>
    `;

    if (!elo) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo elo é obrigatório.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-gender-ambiguous"></i> Gênero</label>
                        <select class="form-select" name="genero">
                            <option value="" disabled ${!genero ? 'selected' : ''}>Selecione o seu gênero</option>
                            <option value="Masculino" ${genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                            <option value="Feminino" ${genero === 'Feminino' ? 'selected' : ''}>Feminino</option>
                            <option value="Outro" ${genero === 'Outro' ? 'selected' : ''}>Outro</option>
                        </select>
    `;

    if (!genero) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo gênero é obrigatório.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="mb-4">
                        <label class="form-label"><i class="bi bi-people"></i> Equipe</label>
                        <select class="form-select" name="equipe">
                            <option value="" disabled ${!equipe ? 'selected' : ''}>Selecione uma equipe</option>
                            ${opcoesEquipes}
                        </select>
    `;

    if (!equipe) {
        conteudo += `<div class="form-text text-danger"><i class="bi bi-exclamation-circle"></i> O campo equipe é obrigatório.</div>`;
    }

    conteudo += `
                    </div>
                    <div class="d-flex justify-content-between mt-4">
                        <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                        <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle"></i> Cadastrar Jogador</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.get("/listagem/jogadores", auth, (req, res) => {
    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listagem de Jogadores - Campeonato de LOL Amador da FIPP</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
        ${commonStyles}
        .list-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
        }
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
        }
        .team-card {
            background: white;
            border-radius: 15px;
            margin-bottom: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .team-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .team-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
        }
        .team-header h5 {
            margin: 0;
            font-weight: 700;
            font-size: 1.3rem;
        }
        .table-container {
            overflow-x: auto;
        }
        .table {
            margin-bottom: 0;
        }
        .table thead {
            background: #f7fafc;
            color: #2d3748;
        }
        .table thead th {
            border: none;
            padding: 15px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            color: #667eea;
        }
        .table tbody tr:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .table tbody td {
            padding: 15px;
            vertical-align: middle;
            border-color: #e2e8f0;
        }
        .empty-team {
            text-align: center;
            padding: 40px 20px;
            color: #718096;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
        }
        .empty-state i {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        .badge-role {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        </style>
    </head>
    <body>
    ${generateNavbar(req, 'listagem-jogadores')}
    <div class="main-content">
        <div class="container">
            <div class="list-card">
                <div class="page-header">
                    <h3 class="page-title"><i class="bi bi-person-lines-fill"></i> Jogadores por Equipe</h3>
                    <a href="/cadastro/jogador" class="btn btn-primary"><i class="bi bi-plus-circle"></i> Novo Jogador</a>
                </div>
    `;

    if (jogadores.length === 0) {
        conteudo += `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <h5>Nenhum jogador cadastrado</h5>
                    <p>Comece cadastrando seu primeiro jogador!</p>
                </div>
        `;
    } else {
        for (let i = 0; i < ListaEquipe.length; i++) {
            const nomeEquipe = ListaEquipe[i].nomeEquipe;
            let jogadoresEquipe = [];
            for (let j = 0; j < jogadores.length; j++) {
                if (jogadores[j].equipe === nomeEquipe) {
                    jogadoresEquipe.push(jogadores[j]);
                }
            }
            conteudo += `
                <div class="team-card">
                    <div class="team-header">
                        <h5><i class="bi bi-trophy"></i> ${nomeEquipe} <span class="badge bg-light text-dark ms-2">${jogadoresEquipe.length}/5</span></h5>
                    </div>
                    <div class="table-container">
            `;
            if (jogadoresEquipe.length === 0) {
                conteudo += `
                        <div class="empty-team">
                            <i class="bi bi-person-x"></i>
                            <p class="mb-0">Nenhum jogador nesta equipe.</p>
                        </div>
                `;
            } else {
                conteudo += `
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th><i class="bi bi-person"></i> Nome</th>
                                    <th><i class="bi bi-at"></i> Nickname</th>
                                    <th><i class="bi bi-controller"></i> Função</th>
                                    <th><i class="bi bi-trophy"></i> Elo</th>
                                    <th><i class="bi bi-gender-ambiguous"></i> Gênero</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                for (let j = 0; j < jogadoresEquipe.length; j++) {
                    conteudo += `
                                <tr>
                                    <td><strong>${j + 1}</strong></td>
                                    <td>${jogadoresEquipe[j].nome}</td>
                                    <td><strong>${jogadoresEquipe[j].nickname}</strong></td>
                                    <td><span class="badge-role">${jogadoresEquipe[j].funcao}</span></td>
                                    <td>${jogadoresEquipe[j].elo}</td>
                                    <td>${jogadoresEquipe[j].genero}</td>
                                </tr>
                    `;
                }
                conteudo += `
                            </tbody>
                        </table>
                `;
            }
            conteudo += `
                    </div>
                </div>
            `;
        }
    }
    conteudo += `
                <div class="mt-4">
                    <a href="/home" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Voltar</a>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});
