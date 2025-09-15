// controller.js
const { conectar, desconectar } = require('./db');
const { validarEmail, validarSenha, validarCaracteres, validarTelefone } = require('./auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// ===================== [ AUTENTICAÇÃO ] =====================

// ------- API GET
async function autenticacao(req, res, next) {
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
}

async function logout(req, res) {
    req.session.destroy(error => {
        if (error) return res.status(500).json({ message: 'Erro ao deslogar!' });
        res.json({ message: 'Deslogado com sucesso!' });
    });
}

//------- API POST
async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    let conexao;
    try {
        conexao = await conectar();

        const query = 'SELECT * FROM usuarios WHERE email = ?';
        const parametros = [email];

        const [dados_banco] = await conexao.execute(query, parametros);

        if (!dados_banco || dados_banco.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
        }

        const usuario = dados_banco[0];

        const verificacao_senha = await bcrypt.compare(senha, usuario.senha);

        if (!verificacao_senha) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos!' });
        }

        req.session.user = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            endereco: usuario.endereco,
            foto_url: usuario.foto_url
        };

        res.status(200).json({ message: 'Login realizado com sucesso!', usuario: req.session.user });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

async function cadastro(req, res) {
    const { nome, email, senha, telefone, endereco, foto_url } = req.body;

    if (!nome || !email || !senha || !telefone || !endereco) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ message: 'Email inválido!' });
    }

    if (!validarSenha(senha)) {
        return res.status(400).json({ message: 'Senha inválida!' });
    }

    if (validarCaracteres(nome, email, senha, telefone, endereco, foto_url)) {
        return res.status(400).json({ message: 'Caracteres inválidos!' });
    }

    if (!validarTelefone(telefone)) {
        return res.status(400).json({ message: 'Telefone inválido!' });
    }

    let conexao;
    try {
        conexao = await conectar();

        const query = 'INSERT INTO usuarios (nome, email, senha, telefone, endereco, foto_url) VALUES (?, ?, ?, ?, ?, ?)';
        const hashedsenha = await bcrypt.hash(senha, saltRounds);
        const parametros = [nome, email, hashedsenha, telefone, endereco, foto_url];

        await conexao.execute(query, parametros);
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API UPDATE
async function updateUser(req, res) {
    const { senha, telefone, endereco, foto_url } = req.body;

    if (!senha || !telefone || !endereco) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    if (!validarSenha(senha)) {
        return res.status(400).json({ message: 'Senha inválida!' });
    }

    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    let conexao;
    try {
        conexao = await conectar();

        const hashedsenha = await bcrypt.hash(senha, saltRounds);

        const query = `
            UPDATE usuarios
            SET senha = ?, telefone = ?, endereco = ?, foto_url = ?
            WHERE id = ?
        `;
        const parametros = [hashedsenha, telefone, endereco, foto_url, req.session.user.id];

        const [resultado] = await conexao.execute(query, parametros);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Atualiza sessão com novos dados (sem expor senha)
        req.session.user = {
            ...req.session.user,
            telefone,
            endereco,
            foto_url
        };

        res.status(200).json({ message: 'Usuário atualizado com sucesso', usuario: req.session.user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ===================== [ ANIMAIS ] =====================

// ------- API GET
async function listarAnimal(req, res) {
    const animal = req.params.tipo;
    const presets = ['cachorros', 'gatos'];

    if (!presets.includes(animal)) {
        return res.status(400).json({ message: 'Tipo de animal inválido!' });
    }

    let conexao;
    try {
        conexao = await conectar();
        const [resultado] = await conexao.execute(`SELECT * FROM ${animal}`);
        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao listar animais:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API POST
async function inserirAnimal(req, res) {
    const { tipo, nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, status } = req.body;
    const presets = ['cachorros', 'gatos'];

    if (!presets.includes(tipo)) {
        return res.status(400).json({ message: 'Tipo de animal inválido!' });
    }

    let conexao;
    try {
        conexao = await conectar();
        const query = `INSERT INTO ${tipo} (nome,idade,raca,sexo,porte,vacinado,castrado,descricao,foto_url,status) VALUES (?,?,?,?,?,?,?,?,?,?)`;
        const parametros = [nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, status];
        await conexao.execute(query, parametros);
        return res.status(201).json({ message: 'Animal inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir animal:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API UPDATE


// ------- API DELETE

// ===================== [ DENÚNCIA ] =====================

// ------- API GET

// ------- API POST
async function inserirdenuncia(req, res) {
    const {
        usuario_id,
        data,
        nome_denunciante,
        telefone,
        email,
        anonimato,
        nome_vitima,
        idade_vitima,
        genero_vitima,
        endereco_vitima,
        relacao_vitima,
        nome_agressor,
        idade_agressor,
        relacao_agressor,
        endereco_agressor,
        local_ocorrido,
        data_hora_fato,
        descricao,
        provas,
        detalhes_provas,
        informacoes_adicionais,
        assinatura
    } = req.body;

    console.log(req.body);

    let conexao;
    // try {
    //     conexao = await conectar();
    //     const query = `INSERT INTO denuncias (usuario_id, data, nome_denunciante, telefone, email, anonimato, nome_vitima, idade_vitima, genero_vitima, endereco_vitima, relacao_vitima, nome_agressor, idade_agressor, relacao_agressor, endereco_agressor, local_ocorrido, data_hora_fato, descricao, provas, detalhes_provas, informacoes_adicionais, assinatura)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    //     const params = [
    //         usuario_id,
    //         data,
    //         nome_denunciante,
    //         telefone,
    //         email,
    //         anonimato,
    //         nome_vitima,
    //         idade_vitima,
    //         genero_vitima,
    //         endereco_vitima,
    //         relacao_vitima,
    //         nome_agressor,
    //         idade_agressor,
    //         relacao_agressor,
    //         endereco_agressor,
    //         local_ocorrido,
    //         data_hora_fato,
    //         descricao,
    //         provas,
    //         detalhes_provas,
    //         informacoes_adicionais,
    //         assinatura
    //     ];

    //     await conexao.execute(query, params);
    //     res.status(201).json({ message: 'Denúncia inserida com sucesso' });
    // } catch (error) {
    //     console.error('Erro ao inserir denúncia:', error);
    //     res.status(500).json({ message: 'Erro no servidor' });
    // } finally {
    //     if (conexao) await desconectar(conexao);
    // }
}

// ------- API UPDATE

// ------- API DELETE

// ===================== [ DOAÇÕES ] =====================
// ------- API GET
async function listarDoacoes(req, res) {
    let conexao;
    try {
        conexao = await conectar();
        const [resultado] = await conexao.execute("SELECT * FROM doacao");
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao listar doações:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API POST
async function inserirDoacao(req, res) {
    const doacao = req.body;
    let conexao;
    try {
        conexao = await conectar();
        const query = 'INSERT INTO doacao (id_usuario,tipo,valor,item_descrico,data_doacao,forma_pagamento,recibo_url) VALUES (?,?,?,?,?,?,?)';
        const parametros = [
            doacao.id_usuario,
            doacao.tipo,
            doacao.valor,
            doacao.item_descrico,
            doacao.data_doacao,
            doacao.forma_pagamento,
            doacao.recibo_url
        ];
        await conexao.execute(query, parametros);
        res.status(201).json({ message: 'Doação inserida com sucesso' });
    } catch (error) {
        console.error('Erro ao inserir doação:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API UPDATE
async function atualizarDoacao(req, res) {
    const id = parseInt(req.params.id);
    const dados = req.body;

    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    let conexao;
    try {
        conexao = await conectar();

        const query = `
            UPDATE doacao
            SET id_usuario = ? , tipo = ? , valor = ? , item_descrico = ? , data_doacao = ? , forma_pagamento = ? , recibo_url = ?
            WHERE id = ?
        `;

        const parametros = [
            dados.id_usuario,
            dados.tipo,
            dados.valor,
            dados.item_descrico,
            dados.data_doacao,
            dados.forma_pagamento,
            dados.recibo_url,
            id
        ];

        const [resultado] = await conexao.execute(query, parametros);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: `Nenhuma doação encontrada com id ${id}` });
        }

        res.status(200).json({ message: 'Doação atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar doação:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API DELETE
async function deletarDoacao(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) return res.status(400).json({ message: 'ID inválido' });

    let conexao;
    try {
        conexao = await conectar();
        const query = 'DELETE FROM doacao WHERE id = ?';
        const parametros = [id];
        const [resultado] = await conexao.execute(query, parametros);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Doação não encontrada' });
        }

        res.status(200).json({ message: 'Apagado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar doação:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

module.exports = {
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
};
