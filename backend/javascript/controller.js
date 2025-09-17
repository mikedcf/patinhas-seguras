// controller.js
const { conectar, desconectar } = require('./db');
const { validarEmail, validarSenha, validarCaracteres, validarTelefone } = require('./auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// ===================== [ CRIAÇÃO DO BANCO DE DADOS ] =====================

async function setupDatabase(){
   

    let conexao = await conectar()

    let query;


    query = `
        CREATE TABLE IF NOT EXISTS  usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        endereco TEXT,
        foto_url VARCHAR(255) DEFAULT '',
        tipo ENUM('adotante','admin') DEFAULT 'adotante',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await conexao.execute(query)

    query = `
        CREATE TABLE IF NOT EXISTS  cachorros (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nome VARCHAR(100),
        idade INT,
        raca VARCHAR(100),
        sexo ENUM('macho','femea') NOT NULL,
        porte ENUM('pequeno','medio','grande') NOT NULL,
        vacinado BOOLEAN,
        castrado BOOLEAN,
        descricao TEXT,
        foto_url VARCHAR(250),
        localizacao VARCHAR(100),
        status ENUM('disponivel','adotado') NOT NULL
    )`

    await conexao.execute(query)


    query = `
        CREATE TABLE IF NOT EXISTS  gatos (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        nome VARCHAR(100),
        idade INT,
        raca VARCHAR(100),
        sexo ENUM('macho','femea') NOT NULL,
        porte ENUM('pequeno','medio','grande') NOT NULL,
        vacinado BOOLEAN,
        castrado BOOLEAN,
        descricao TEXT,
        foto_url VARCHAR(250),
        localizacao VARCHAR(100),
        status ENUM('disponivel','adotado') NOT NULL
    )`

    await conexao.execute(query)

    query = `
        CREATE TABLE IF NOT EXISTS  adocao (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        id_usuario INT NOT NULL,
        id_gato INT,
        id_cachorro INT,
        tipo_animal ENUM('cachorro','gato') NOT NULL,
        data_adocao DATE,
        status ENUM('em andamento','concluída','cancelada'),
        observacoes TEXT
    )`

    await conexao.execute(query)


    query = `
        CREATE TABLE IF NOT EXISTS  doacao (
        id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
        id_usuario INT,
        tipo ENUM('financeira','itens'),
        valor DECIMAL(10,2),
        item_descricao TEXT,
        data_doacao DATE,
        forma_pagamento VARCHAR(50),
        recibo_url VARCHAR(255)
    )`

    await conexao.execute(query)

    query = `
        CREATE TABLE IF NOT EXISTS  denuncias (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,

        data_denuncia DATE NOT NULL,
        
        nome_denunciante VARCHAR(255),
        telefone VARCHAR(20),
        email VARCHAR(255),
        anonimato ENUM('Sim', 'Não') DEFAULT 'Sim',

        nome_vitima VARCHAR(255),
        idade_vitima VARCHAR(100),
        genero_vitima VARCHAR(50),
        endereco_vitima TEXT,
        relacao_vitima VARCHAR(255),

        nome_agressor VARCHAR(255),
        idade_agressor VARCHAR(100),
        relacao_agressor VARCHAR(255),
        endereco_agressor TEXT,

        local_ocorrido TEXT,
        data_hora_fato VARCHAR(100),

        descricao TEXT NOT NULL,

        provas ENUM('Sim', 'Não') DEFAULT 'Não',
        detalhes_provas TEXT,

        informacoes_adicionais TEXT,

        assinatura VARCHAR(255),

        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
    )`

    await conexao.execute(query)
   
}
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


// ===================== [ PERFIL DE USUÁRIO ] =====================

// ------- GET PERFIL
async function getPerfil(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Usuário não autenticado!' });
    }

    let conexao;
    try {
        conexao = await conectar();
        const [resultado] = await conexao.execute(
            'SELECT id, nome, email, telefone, endereco, foto_url FROM usuarios WHERE id = ?',
            [req.session.user.id]
        );

        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        return res.status(200).json(resultado[0]);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- UPDATE PERFIL
async function updatePerfil(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Usuário não autenticado!' });
    }

    const { telefone, endereco } = req.body;

    if (!telefone && !endereco) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido!' });
    }

    let conexao;
    try {
        conexao = await conectar();
        
        // Constrói a query dinamicamente baseada nos campos fornecidos
        let query = 'UPDATE usuarios SET ';
        let valores = [];
        let campos = [];

        if (telefone) {
            campos.push('telefone = ?');
            valores.push(telefone);
        }

        if (endereco) {
            campos.push('endereco = ?');
            valores.push(endereco);
        }

        query += campos.join(', ') + ' WHERE id = ?';
        valores.push(req.session.user.id);

        await conexao.execute(query, valores);

        // Atualiza a sessão com os novos dados
        if (telefone) req.session.user.telefone = telefone;
        if (endereco) req.session.user.endereco = endereco;

        return res.status(200).json({ 
            message: 'Perfil atualizado com sucesso!',
            usuario: req.session.user
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
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
    const { tipo, nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status } = req.body;
    const presets = ['cachorros', 'gatos'];

    if (!presets.includes(tipo)) {
        return res.status(400).json({ message: 'Tipo de animal inválido!' });
    }

    let conexao;
    try {
        conexao = await conectar();
        const query = `INSERT INTO ${tipo} (nome,idade,raca,sexo,porte,vacinado,castrado,descricao,foto_url,localizacao, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        const parametros = [nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status];
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
async function atualizarAnimal(req, res) {
    const { tipo, id, nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status } = req.body;

    presets = ['cachorros', 'gatos'];

    if (!presets.includes(tipo)) {
        return res.status(400).json({ message: 'Tipo de animal inválido!' });

    }

    let conexao;

    try{
        conexao = await conectar();
        let query = `UPDATE ${tipo} SET nome = ?, idade = ? , raca = ? , sexo = ? , porte = ? , vacinado = ? , castrado = ? , descricao = ? , foto_url = ? , localizacao = ? , status = ? WHERE id = ?`;

        const parametros = [nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status, id];
        await conexao.execute(query, parametros);
        return res.status(200).json({ message: 'Animal atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar animal:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}


// ------- API DELETE
async function deletarAnimal(req, res) {
    const { tipo, id } = req.body;
    let conexao;
    try {
        conexao = await conectar();
        const query = `DELETE FROM ${tipo} WHERE id = ?`;
        const parametros = [id];
        await conexao.execute(query, parametros);
        return res.status(200).json({ message: 'Animal deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar animal:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ===================== [ DENÚNCIA ] =====================

// ------- API GET
async function listarDenuncias(req, res) {
    let conexao;
    try {
        conexao = await conectar();
        const [resultado] = await conexao.execute("SELECT * FROM denuncias");
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao listar denúncias:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

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
async function atualizarDenuncia(req, res) {
    const { id, nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status } = req.body;
    let conexao;
    try {
        conexao = await conectar();
        const query = `UPDATE denuncias SET nome = ?, idade = ? , raca = ? , sexo = ? , porte = ? , vacinado = ? , castrado = ? , descricao = ? , foto_url = ? , localizacao = ? , status = ? WHERE id = ?`;
        const parametros = [nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status, id];
        await conexao.execute(query, parametros);
        return res.status(200).json({ message: 'Denúncia atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar denúncia:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

// ------- API DELETE
async function deletarDenuncia(req, res) {
    const { id } = req.body;
    let conexao;
    try {
        conexao = await conectar();
        const query = `DELETE FROM denuncias WHERE id = ?`;
        const parametros = [id];
        await conexao.execute(query, parametros);
        return res.status(200).json({ message: 'Denúncia deletada com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar denúncia:', error);
        return res.status(500).json({ message: 'Erro interno do servidor!' });
    } finally {
        if (conexao) await desconectar(conexao);
    }
}

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
    deletarDoacao,
    getPerfil,
    updatePerfil,
    setupDatabase
};

