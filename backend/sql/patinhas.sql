CREATE DATABASE IF NOT EXISTS patinhas;
USE patinhas;

-- Usuários (quem se cadastra no site)
drop table if EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    foto_url VARCHAR(255) DEFAULT '',
    tipo ENUM('adotante','admin') DEFAULT 'adotante',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 

----------------------------------------
------------ [ANIMAIS] ------------

Drop table if EXISTS cachorros;
-- CACHORROS
CREATE TABLE cachorros(
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
)
 

Drop table if EXISTS gatos;
-- GATOS
CREATE TABLE gatos(
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
)


Drop table if EXISTS adocao;
-- ADOTANTES
CREATE TABLE adocao(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_usuario INT NOT NULL,
    id_gato INT,
    id_cachorro INT,
    tipo_animal ENUM('cachorro','gato') NOT NULL,
    data_adocao DATE,
    status ENUM('em adamento','concluída','cancelada'),
    observacoes TEXT
)
 
----------------------------------------
------------ [DOACOES] ------------

-- DOACOES
CREATE TABLE if not exists doacao(
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    id_usuario INT,
    tipo ENUM('financeira','itens'),
    valor DECIMAL(10,2),
    item_descrico TEXT,
    data_doacao DATE,
    forma_pagamento VARCHAR(50),
    recibo_url VARCHAR(255)
)


----------------------------------------
------------ [DENUNCIAS] ------------
CREATE TABLE denuncia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    local_ocorrencia VARCHAR(255) NOT NULL,
    descricao_situacao TEXT NOT NULL,
    tipo_animal ENUM('Não sei / Outro', 'Cachorro', 'Gato', 'Pássaro', 'Cavalo') DEFAULT 'Não sei / Outro',
    arquivo_prova VARCHAR(255),
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

