# Entreno
### Website para encontrar parceiros para praticar esportes de raquete.
<img src="/github/apresentacao-entreno.png">
Sistema web para auxiliar a comunidade de esportistas com um foco maior nos esportes de raquetes. A aplicação foi desenvolvida utilizando TypeScript e Node.js para o back-end e React com Typescript para o front-end e MongoDb para o banco de dado. Com isso, o objetivo principal do sistema é simplificar as interações entre praticantes, permitindo que eles encontrem novas pessoas com quem possam praticar esportes, promovendo a criação de novas conexões e experiências.

# Modelo de dados
- Collection User
- Collection Profile
- Collection Match

# Como iniciar a aplicação
## API
- É necessário ter Node 18 instalado.
- É necessário criar o banco de dados no mongoDB local ou no cloud.mongodb.com.

- Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no arquivo `.env`.
```cl
PORT= (padrão: 3030)
IP= (padrão: 0.0.0.0)

MONGODB_USERNAME=
MONGODB_URL_ATLAS=
```
- Para que o funcionamento do envio de emails ocorra, neste caso foi utilizado o provedor Gmail, deve ser preenchido as seguintes variáveis de ambiente.
```cl
GMAIL=
GMAIL_PASSWORD=
```
### Executando o projeto
- Dentro da pasta `./api`, instale as dependências do projeto.

```cl
npm install
```

- É importante também buildar o projeto.

```cl
npm run build
```

- Em seguida, inicie o projeto.

```cl
npm start
```
## APP
- É necessário ter o Node 18 instalado.

### Executando o projeto
- Dentro da pasta `./app`, instale as dependências do projeto.

```cl
npm install
```

- É importante também buildar o projeto.

```cl
npm run build
```

- Em seguida, inicie o projeto.

```cl
npm start
```

- Lembre-se de trocar a variável **apiURL** que fica dentro do arquivo na pasta `./app/src/util/getDotEnv.ts` para acessar a api local, caso contrário irá acessar a api usada em produção.

 ```cl
apiURL = "http://localhost:3030"
```

## Rotas (REST)
| Rota | Descrição |
| --- | --- |
| `POST /login` | Realizar o login |
| `POST /register` | Cadastrar usuário |
| `POST /forgot-email` | Enviar email para recuperação de senha |
| `GET /token-password` | Retornar se o usuário está autenticado para alterar a senha do cadastro |
| `POST /reset-password` | Atualizar senha do cadastro |
| --- | --- |
| `POST /matches` | Cadastrar informações de partida |
| `POST /matches-update` | Atualizar informações de partida |
| `GET /matches` | Listar partidas cadastradas pelo usuário |
| `DELETE /matches/:id` | Apagar partida pelo id|
| `POST /matches-refused` | Salvar partida recusada pelo usuário |
| `POST /matches-exit` | Sair da partida |
| `GET /matches-default` | Listar partidas que correspondem ao perfil do usuário (esporte, categoria, estado e cidade) |
| `GET /matches-funnel` | Listar partidas que atendam aos critérios de filtragem especificados pelo usuário |
| `POST /matches-favorite` | Salvar partidas fixadas pelo usuário |
| `GET /matches-favorite` | Listar partidas fixadas pelo usuário |
| `DELETE /matches-favorite/:id` | Remover partidas fixadas pelo id |
| `POST /matches-accepted` | Salvar partidas aceitas pelo usuário |
| `GET /matches-accepted` | Listar partidas aceitas pelo usuário |
| --- | --- |
| `POST /profile` | Salvar informações do perfil |
| `GET /profile` | Listar informações do perfil |
| `POST /image-profile` | Salvar a imagem de perfil |
| `GET /image-profile` | Exibir a imagem de perfil |
| --- | --- |
