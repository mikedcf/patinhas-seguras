const {conectar, desconectar} = require('./db')

async function listar_tabelas_banco(query){
    const conexao = await conectar();
    const [resultado] = await conexao.execute(query);
    console.log(resultado)
    await desconectar(conexao)

}


async function inserir_animal(nome_tabela,nome,idade,raca,sexo, porte,vacinado,castrado,descricao,foto_url){
    const conexao = await conectar();

    const tabelas = ['cachorros', 'gatos']

    if (!tabelas.includes(nome_tabela)){
        console.log(`Erro tabela mencionada ${nome_tabela} não existe criada na tabelas`)
    }
    else{
        parametros = [ nome,idade,raca,sexo, porte,vacinado,castrado,descricao,foto_url]
        let query = `INSERT INTO ${nome_tabela} ( nome,idade,raca,sexo,porte,vacinado,castrado,descricao,foto_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [resultado] = await conexao.execute(query, parametros);
        console.log(resultado)
        await desconectar(conexao)
    }
}

inserir_animal(
    'cachorros',
    'dudu',
    '5',
    'pincher',
    'macho',
    'pequeno',
    true,
    true,
    'doado a pouco tempo',
    'https://images.amigonaosecompra.com.br/unsafe/460x440/1042a08a-be60-4fe8-b8e8-8052a16f9092/009a5625-2eef-48f3-9287-11279f1972a3/009a5625-2eef-48f3-9287-11279f1972a3.jpg?v=63818318419'
)


