# 📦 MercaFácil — API de Contatos Multi-Loja

API GraphQL construída com **Node.js + TypeScript** que gerencia contatos para duas lojas fictícias — **Macapá** e **Varejão** — cada uma com seu próprio banco de dados e regras de formatação. A comunicação entre a API e a persistência é feita de forma **assíncrona via Apache Kafka**.

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**, separando responsabilidades em três camadas:

```
src/
├── domain/           # Entidades e interfaces (regras de negócio puras)
│   ├── entities/     # User, Contact
│   └── interfaces/   # IUser, IContact (contratos dos repositórios)
│
├── application/      # Casos de uso e lógica de aplicação
│   ├── use-cases/    # CreateContact, FindContacts, CreateUser, Login...
│   ├── dtos/         # Data Transfer Objects
│   └── utils/        # Formatadores de telefone e nome
│
└── infrastructure/   # Frameworks, drivers e detalhes externos
    ├── database/     # Conexões MySQL (TypeORM) e MongoDB (Mongoose)
    ├── graphql/      # Apollo Server, resolvers, inputs, types, middlewares
    ├── kafka/        # Producer e Consumers (Macapá / Varejão)
    ├── repositories/ # Implementações concretas dos repositórios
    └── container/    # Injeção de dependência manual
```

## 🛠️ Tecnologias

| Camada           | Tecnologia                             |
| ---------------- | -------------------------------------- |
| Runtime          | Node.js 20 (Alpine)                    |
| Linguagem        | TypeScript                             |
| API              | GraphQL (Apollo Server + type-graphql) |
| Banco Relacional | MySQL 8.0 (TypeORM)                    |
| Banco NoSQL      | MongoDB 6.0 (Mongoose)                 |
| Mensageria       | Apache Kafka (KafkaJS)                 |
| Autenticação     | JWT (jsonwebtoken + bcrypt)            |
| Containerização  | Docker + Docker Compose                |

---

## 🗄️ Bancos de Dados

### Macapá (MySQL)

Armazena contatos com telefone no formato `+55 (83) 91234-5678`. <br>
Armazena contatos com o nome no formato: `JOÃO SILVA`.

| Tabela     | Campos                                                       |
| ---------- | ------------------------------------------------------------ |
| `users`    | id, name, email, password, is_active, created_at, updated_at |
| `contacts` | id, name, cell_phone, anexo                                  |

### Varejão (MongoDB)

Armazena contatos com telefone apenas dígitos: `5583912345678`.

| Collection | Campos                |
| ---------- | --------------------- |
| `contacts` | \_id, name, cellPhone |

> A loja do usuário é identificada pelo domínio do **e-mail** (contém `macapa` ou `varejao`).

---

## 🔐 Autenticação

A API utiliza **JWT (Bearer Token)**. Fluxo:

1. **Crie um usuário** via mutation `createUser`
2. **Faça login** via mutation `login` → recebe o `token`
3. **Use o token** no header `Authorization: Bearer <token>` para acessar queries e mutations protegidas

---

## 🚀 Como Rodar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd mercafacil
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (ou use o existente):

```env
APP_PORT=3000

MYSQL_ROOT_PASSWORD=root
MYSQL_PORT=3306
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_DB_NAME=macapa

MONGO_PORT=27017
MONGO_DB_NAME=varejao

AUTH_SECRET="sua-chave-secreta"
```

### 3. Suba os containers

```bash
docker compose up --build
```

Isso irá inicializar:

| Serviço   | Container         | Porta |
| --------- | ----------------- | ----- |
| Aplicação | `app_node`        | 3000  |
| MySQL     | `db_mysq`         | 3306  |
| MongoDB   | `db_mongo`        | 27017 |
| Zookeeper | `kafka_zookeeper` | 2181  |
| Kafka     | `kafka_broker`    | 9092  |
| Kafka UI  | `kafka_ui`        | 8080  |

### 4. Acesse a API

- **GraphQL Playground**: [http://localhost:3000](http://localhost:3000)
- **Kafka UI**: [http://localhost:8080](http://localhost:8080)

---

## 📁 Scripts

| Comando         | Descrição                         |
| --------------- | --------------------------------- |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start`     | Inicia a aplicação compilada      |

---

## 📂 Dados de Inicialização

O diretório `data/` contém scripts executados automaticamente na primeira inicialização dos bancos:

| Arquivo                    | Descrição                                                                  |
| -------------------------- | -------------------------------------------------------------------------- |
| `create-table-macapa.sql`  | Cria o database `macapa`, tabelas `users` e `contacts`, e um usuário admin |
| `create-table-varejao.sql` | Cria o database `varejao` e a tabela `contacts` no MySQL                   |
| `mongo-init.js`            | Cria a collection `contacts` no MongoDB (`varejao`)                        |
| `contacts-macapa.json`     | Dados de exemplo de contatos para Macapá                                   |
| `contacts-varejao.json`    | Dados de exemplo de contatos para Varejão                                  |

### Usuário Admin Pré-cadastrado

| Campo | Valor            |
| ----- | ---------------- |
| Email | `test@admin.com` |
| Senha | `admin`          |

---

## 🔄 Regras de Negócio

### Formatação de Telefone

| Loja    | Formato de Entrada    | Formato Salvo         |
| ------- | --------------------- | --------------------- |
| Macapá  | `+5583912345678`      | `+55 (83) 91234-5678` |
| Varejão | `+55 (83) 91234-5678` | `5583912345678`       |

### Formatação de Nome

| Loja    | Entrada          | Saída        |
| ------- | ---------------- | ------------ |
| Macapá  | `Sr. João Silva` | `JOÃO SILVA` |
| Varejão | `Sra. Maria`     | `Maria`      |

- Prefixos `Sr.`, `Sra.`, `Srta.` são removidos automaticamente
- Para Macapá, o nome é convertido para **MAIÚSCULAS**

---

## 🧱 Padrões de Projeto

- **Clean Architecture** — separação em camadas (domain → application → infrastructure)
- **Repository Pattern** — interfaces no domínio, implementações na infraestrutura
- **Dependency Injection** — container manual para injetar dependências nos resolvers
- **DTO Pattern** — objetos de transferência entre camadas
- **Event-Driven Architecture** — Kafka como broker de mensagens para processamento assíncrono
