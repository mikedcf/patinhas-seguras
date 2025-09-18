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
 

INSERT INTO cachorros (nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status) VALUES
('Rex', 3, 'Labrador Retriever', 'macho', 'grande', TRUE, TRUE, 'Cachorro dócil, adora brincar e correr.', 'https://exemplo.com/fotos/rex.jpg', 'São Paulo, SP', 'disponivel'),
('Luna', 2, 'Poodle', 'femea', 'pequeno', TRUE, FALSE, 'Muito carinhosa e inteligente, ótima companhia.', 'https://exemplo.com/fotos/luna.jpg', 'Rio de Janeiro, RJ', 'disponivel'),
('Thor', 4, 'Pastor Alemão', 'macho', 'grande', TRUE, TRUE, 'Protetor e leal, ideal para guarda e família.', 'https://exemplo.com/fotos/thor.jpg', 'Belo Horizonte, MG', 'adotado'),
('Mel', 1, 'Vira-lata', 'femea', 'medio', FALSE, FALSE, 'Filhote alegre, precisa de cuidados e carinho.', 'https://exemplo.com/fotos/mel.jpg', 'Salvador, BA', 'disponivel'),
('Bob', 5, 'Bulldog Inglês', 'macho', 'medio', TRUE, TRUE, 'Calmo, adora cochilar e receber carinho.', 'https://exemplo.com/fotos/bob.jpg', 'Fortaleza, CE', 'disponivel'),
('Nina', 3, 'Shih Tzu', 'femea', 'pequeno', TRUE, TRUE, 'Muito dócil, perfeita para apartamento.', 'https://exemplo.com/fotos/nina.jpg', 'São Paulo, SP', 'adotado'),
('Max', 6, 'Golden Retriever', 'macho', 'grande', TRUE, TRUE, 'Companheiro fiel, ama brincar com crianças.', 'https://exemplo.com/fotos/max.jpg', 'Brasília, DF', 'disponivel'),
('Belinha', 2, 'Beagle', 'femea', 'medio', FALSE, TRUE, 'Muito curiosa e energética, precisa de passeios.', 'https://exemplo.com/fotos/belinha.jpg', 'Porto Alegre, RS', 'disponivel'),
('Apolo', 7, 'Rottweiler', 'macho', 'grande', TRUE, FALSE, 'Forte e protetor, precisa de um tutor experiente.', 'https://exemplo.com/fotos/apolo.jpg', 'Recife, PE', 'disponivel'),
('Amora', 1, 'Spitz Alemão', 'femea', 'pequeno', TRUE, FALSE, 'Pequenina e esperta, adora brincar com bolinhas.', 'https://exemplo.com/fotos/amora.jpg', 'Curitiba, PR', 'disponivel');

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


INSERT INTO gatos (nome, idade, raca, sexo, porte, vacinado, castrado, descricao, foto_url, localizacao, status) VALUES
('Mia', 2, 'Siamês', 'femea', 'pequeno', TRUE, TRUE, 'Gata dócil, adora ficar no colo.', 'https://exemplo.com/fotos/mia.jpg', 'São Paulo, SP', 'disponivel'),
('Tom', 3, 'Vira-lata', 'macho', 'medio', FALSE, FALSE, 'Muito brincalhão, adora caçar brinquedos.', 'https://exemplo.com/fotos/tom.jpg', 'Rio de Janeiro, RJ', 'disponivel'),
('Lola', 1, 'Persa', 'femea', 'pequeno', TRUE, FALSE, 'Calminha, ideal para apartamento.', 'https://exemplo.com/fotos/lola.jpg', 'Belo Horizonte, MG', 'adotado'),
('Felix', 4, 'Angorá', 'macho', 'medio', TRUE, TRUE, 'Gato elegante e tranquilo, gosta de silêncio.', 'https://exemplo.com/fotos/felix.jpg', 'Salvador, BA', 'disponivel'),
('Nina', 5, 'Vira-lata', 'femea', 'medio', TRUE, TRUE, 'Muito carinhosa, adora dormir perto do dono.', 'https://exemplo.com/fotos/nina_gata.jpg', 'Fortaleza, CE', 'disponivel'),
('Simba', 2, 'Maine Coon', 'macho', 'grande', TRUE, FALSE, 'Grande e amigável, se dá bem com crianças.', 'https://exemplo.com/fotos/simba.jpg', 'São Paulo, SP', 'disponivel'),
('Mel', 3, 'Vira-lata', 'femea', 'medio', FALSE, FALSE, 'Esperta e curiosa, gosta de explorar.', 'https://exemplo.com/fotos/mel_gata.jpg', 'Brasília, DF', 'adotado'),
('Garfield', 6, 'Exótico', 'macho', 'medio', TRUE, TRUE, 'Preguiçoso e muito comilão, engraçado e único.', 'https://exemplo.com/fotos/garfield.jpg', 'Porto Alegre, RS', 'disponivel'),
('Amora', 1, 'Vira-lata', 'femea', 'pequeno', TRUE, FALSE, 'Filhote alegre, adora correr pela casa.', 'https://exemplo.com/fotos/amora_gata.jpg', 'Recife, PE', 'disponivel'),
('Thor', 7, 'British Shorthair', 'macho', 'medio', TRUE, TRUE, 'Independente e calmo, ótimo para companhia.', 'https://exemplo.com/fotos/thor_gato.jpg', 'Curitiba, PR', 'disponivel');


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

