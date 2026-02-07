# 🚀 Encurtador de URL Serverless (AWS LocalStack)

Este projeto é um microserviço de encurtamento de URLs desenvolvido com Node.js, TypeScript e AWS CDK. A aplicação permite criar URLs curtas, realizar redirecionamentos automáticos e acompanhar métricas de cliques em tempo real.

Toda a infraestrutura é simulada localmente utilizando o LocalStack, permitindo o desenvolvimento e teste de serviços AWS sem custos.

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Framework de Infraestrutura:** AWS CDK (Cloud Development Kit)
- **Runtime:** Node.js 18.x
- **Serviços AWS (Simulados):** <br>
    Lambda: Processamento da lógica de negócio.<br>
    DynamoDB: Banco de dados NoSQL para persistência de URLs e contador de cliques.<br>
    API Gateway: Gerenciamento de rotas e exposição dos endpoints REST.
- **Ferramentas de Desenvolvimento:**<br>
    localstack & cdklocal<br>
    esbuild (para bundling da Lambda)<br>
    nanoid (para geração de IDs únicos)

## 📌 Funcionalidades

- **[x] POST /:** Encurta uma URL original e gera um código de 6 caracteres.
- **[x] GET /{code}:** Redireciona o usuário para a URL original e incrementa o contador de cliques de forma atômica.
- **[x] GET /stats/{code}:** Retorna os detalhes da URL e o total de cliques acumulados.

## 🔧 Como Executar

1. Pré-requisitos<br>
    Docker e LocalStack instalados.<br>
    Node.js e NPM.<br>
    AWS CDK e cdklocal instalados.<br>
2. Iniciar o Ambiente Local<br>
    `localstack start -d`<br>
3. Instalar Dependências<br>
    `npm install`<br>
4. Deploy da Infraestrutura<br>
    `cdklocal deploy`

## ⚡ Exemplos de Uso
- **Criar URL Encurtada**<br>
`curl -X POST https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/ \-H "Content-Type: application/json" \-d '{"url": "https://google.com"}'`
- **Acessar URL (Redirecionamento)**<br>
`curl -i https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/[CÓDIGO]`
- **Consultar Estatísticas**<br>
`curl -i https://[API-ID].execute-api.localhost.localstack.cloud:4566/prod/stats/[CÓDIGO]`

## 🧠 Aprendizados Relevantes

Durante o desenvolvimento deste projeto, foram superados desafios técnicos como:

- **Networking entre Containers:** Configuração do endpoint da Lambda para comunicar com o DynamoDB usando localhost.localstack.cloud.
- **Roteamento Manual:** Implementação de lógica de prioridade de rotas dentro de uma única função Lambda (Single Purpose vs Monolithic Lambda).
- **Operações Atômicas:** Uso do UpdateCommand do DynamoDB para garantir a integridade do contador de cliques em cenários de alta concorrência.

Desenvolvido por Rhulys. 🎯
