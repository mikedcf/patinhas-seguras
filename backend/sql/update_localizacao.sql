-- Script para adicionar campo localizacao na tabela cachorros
USE patinhas;

-- Adiciona o campo localizacao se não existir
ALTER TABLE cachorros ADD COLUMN IF NOT EXISTS localizacao VARCHAR(100);

-- Atualiza os registros existentes com localizações
UPDATE cachorros SET localizacao = 'São Paulo, SP' WHERE id = 1;
UPDATE cachorros SET localizacao = 'Rio de Janeiro, RJ' WHERE id = 2;
UPDATE cachorros SET localizacao = 'Belo Horizonte, MG' WHERE id = 3;
UPDATE cachorros SET localizacao = 'Salvador, BA' WHERE id = 4;
UPDATE cachorros SET localizacao = 'Fortaleza, CE' WHERE id = 5;
UPDATE cachorros SET localizacao = 'São Paulo, SP' WHERE id = 6;
UPDATE cachorros SET localizacao = 'Brasília, DF' WHERE id = 7;
UPDATE cachorros SET localizacao = 'Porto Alegre, RS' WHERE id = 8;
UPDATE cachorros SET localizacao = 'Recife, PE' WHERE id = 9;
UPDATE cachorros SET localizacao = 'Curitiba, PR' WHERE id = 10;
