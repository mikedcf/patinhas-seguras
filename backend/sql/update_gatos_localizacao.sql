USE patinhas;

-- Adiciona a coluna localizacao na tabela gatos
ALTER TABLE gatos ADD COLUMN IF NOT EXISTS localizacao VARCHAR(100);

-- Atualiza os gatos existentes com localizações
UPDATE gatos SET localizacao = 'São Paulo, SP' WHERE id = 1;
UPDATE gatos SET localizacao = 'Rio de Janeiro, RJ' WHERE id = 2;
UPDATE gatos SET localizacao = 'Belo Horizonte, MG' WHERE id = 3;
UPDATE gatos SET localizacao = 'Salvador, BA' WHERE id = 4;
UPDATE gatos SET localizacao = 'Fortaleza, CE' WHERE id = 5;
UPDATE gatos SET localizacao = 'São Paulo, SP' WHERE id = 6;
UPDATE gatos SET localizacao = 'Brasília, DF' WHERE id = 7;
UPDATE gatos SET localizacao = 'Porto Alegre, RS' WHERE id = 8;
UPDATE gatos SET localizacao = 'Recife, PE' WHERE id = 9;
UPDATE gatos SET localizacao = 'Curitiba, PR' WHERE id = 10;
