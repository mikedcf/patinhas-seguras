// ===============================================================
// ===============[ MODULOS ]==================================

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const {
    cadastro,
    login,
    autenticacao,
    logout,
    updateUser,
    listarAnimal,
    inserirAnimal,
    inserirdenuncia,
    listarDoacoes,
    inserirDoacao,
    atualizarDoacao,
    deletarDoacao
} = require('./controller')

// ===============================================================
// ===============[ Configuração da aplicação ]==================================

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5501',
    credentials: true
}));

app.use(session({
    secret: 'patinhas-web-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}))


// ===============================================================
// ===============[ ROTAS ]==================================


// =-==-=-=-=-=-=-=-=-=-=--=-=- [ Rota teste ] =-==-=-=-=-=-=-=-=-=-=--=-=-

app.get('/hello', (req, res) => {
    res.send('ola mundo');
})

// =============================================================================
// =-==-=-=-=-=-=-=-=-=-=--=-=- [ API USER - AUTENTICAÇÃO ] =-==-=-=-=-=-=-=-=-=-=--=-=-

// ------- API GET
// app.get('/api/v1/user/auth', autenticacao);

app.get('/api/v1/user/auth', (req, res) => {
    if (req.session.user) {
        res.json({
            logado: true,
            usuario: req.session.user
        });
    } else {
        res.json({
            logado: false
        });
    }
});

app.get('/api/v1/user/logout', logout);

// // ------- API POST
app.post('/api/v1/user/login', login);


app.post('/api/v1/user/cadastro', cadastro);


// ------- API UPDATE
app.put('/api/v1/user/update', updateUser);


// =============================================================================
// =-==-=-=-=-=-=-=-=-=-=--=-=- [ API DENUNCIA ] =-==-=-=-=-=-=-=-=-=-=--=-=-

// ------- API GET


// ------- API POST
app.post('/api/v1/denuncia', inserirdenuncia);


// ------- API UPDATE


// ------- API DELETE


// =============================================================================
// =-==-=-=-=-=-=-=-=-=-=--=-=- [ API FLEXIVEL PARA ANIMAIS] =-==-=-=-=-=-=-=-=-=-=--=-=-

// ------- API GET
app.get('/api/v1/animal/:tipo', listarAnimal);


// ------- API POST
app.post('/api/v1/animal', inserirAnimal);



// ------- API UPDATE


// ------- API DELETE



// =============================================================================
// =-==-=-=-=-=-=-=-=-=-=--=-=- [ API DENUNCIA ] =-==-=-=-=-=-=-=-=-=-=--=-=-

// ------- API GET
app.get('/doacoes', listarDoacoes);


// ------- API POST
app.post('/doacao', inserirDoacao);



// ------- API UPDATE
app.put('/doacao/:id', atualizarDoacao );


// ------- API DELETE
app.delete('/doacao/:id', deletarDoacao)


// =============================================================================
// =-==-=-=-=-=-=-=-=-=-=--=-=- [ PORTA DA API ] ==================================
app.listen(3000, () => {
    console.log('Servidor está em localhost:3000');
});