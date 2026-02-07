# 🚀 Encurtador de URL Serverless (AWS LocalStack)

Este projeto é um microserviço de encurtamento de URLs desenvolvido com Node.js, TypeScript e AWS CDK. A aplicação permite criar URLs curtas, realizar redirecionamentos automáticos e acompanhar métricas de cliques em tempo real.

Toda a infraestrutura é simulada localmente utilizando o LocalStack, permitindo o desenvolvimento e teste de serviços AWS sem custos.

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework de Infraestrutura:** AWS CDK (Cloud Development Kit)
- **Runtime:** Node.js 18.x
- **Serviços AWS (Simulados):**
    Lambda: Processamento da lógica de negócio.
    DynamoDB: Banco de dados NoSQL para persistência de URLs e contador de cliques.
    API Gateway: Gerenciamento de rotas e exposição dos endpoints REST.
- **Ferramentas de Desenvolvimento:**
    localstack & cdklocal
    esbuild (para bundling da Lambda)
    nanoid (para geração de IDs únicos)

## 📌 Funcionalidades

- **[x] POST /:** Encurta uma URL original e gera um código de 6 caracteres.
- **[x] GET /{code}:** Redireciona o usuário para a URL original e incrementa o contador de cliques de forma atômica.
- **[x] GET /stats/{code}:** Retorna os detalhes da URL e o total de cliques acumulados.

## 🔧 Como Executar

1. Pré-requisitos
    Docker e LocalStack instalados.
    Node.js e NPM.
    AWS CDK e cdklocal instalados.
2. Iniciar o Ambiente Local
    `localstack start -d`
3. Instalar Dependências
    `npm install`
4. Deploy da Infraestrutura
    `cdklocal deploy`

## ⚡ Exemplos de Uso
- **Criar URL Encurtada**
`curl -X POST https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/ \-H "Content-Type: application/json" \-d '{"url": "https://google.com"}'`
- **Acessar URL (Redirecionamento)**
`curl -i https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/[CÓDIGO]`
- **Consultar Estatísticas**
`curl -i https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/stats/[CÓDIGO]`

## 🧠 Aprendizados Relevantes

Durante o desenvolvimento deste projeto, foram superados desafios técnicos como:

- **Networking entre Containers:** Configuração do endpoint da Lambda para comunicar com o DynamoDB usando localhost.localstack.cloud.
- **Roteamento Manual:** Implementação de lógica de prioridade de rotas dentro de uma única função Lambda (Single Purpose vs Monolithic Lambda).
- **Operações Atômicas:** Uso do UpdateCommand do DynamoDB para garantir a integridade do contador de cliques em cenários de alta concorrência.

Desenvolvido por Rhulys. 🎯