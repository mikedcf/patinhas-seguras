const api_key = "3b422527-3c3c-49ef-8ea2-c7ee50fd538a"

const nickname = "mikefps1"
let response = fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${api_key}`,
        "x-api-key": api_key
    }
})


.then(response => {
    if (!response.ok) {
    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    console.log("JSON completo retornado pela API:");
    console.log(data);  // <-- aqui imprime tudo, igual ao Python
})

.catch(error => {
    console.error("Erro na requisição:", error.message);
    });





