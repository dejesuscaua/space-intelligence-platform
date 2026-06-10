# Guia de Documentação — Space Intelligence Platform

Use este arquivo para pedir ao Claude que gere ou atualize cada documento do projeto.
Copie o prompt da seção desejada e cole diretamente no chat.

---

## Status dos documentos

| Documento | Arquivo | Status |
|---|---|---|
| README principal | `README.md` | Feito |
| Guia de documentação | `DOCUMENTACAO.md` | Feito |
| Arquitetura técnica | `docs/ARCHITECTURE.md` | Pendente |
| Documentação da API | `docs/API.md` | Pendente |
| Infraestrutura (Bicep) | `docs/INFRASTRUCTURE.md` | Pendente |
| Pipeline CI/CD | `docs/CICD.md` | Pendente |
| Roteiro de evidências | `docs/EVIDENCIAS.md` | Pendente |

---

## Prompts prontos

### Arquitetura técnica

```
Crie o arquivo docs/ARCHITECTURE.md com a documentação da arquitetura técnica
do projeto Space Intelligence Platform. O projeto é uma aplicação Next.js 14
deployada no Azure App Service via GitHub Actions. Inclua:
- Diagrama em texto (ASCII) das camadas da plataforma (Orbital, Ground, Intelligence, Action)
- Diagrama da infraestrutura Azure (App Service, Application Insights, Key Vault)
- Fluxo de dados entre os componentes
- Decisões de arquitetura e justificativas
- Stack tecnológica com versões
```

---

### Documentação da API

```
Crie o arquivo docs/API.md documentando os endpoints da API do projeto
Space Intelligence Platform. Leia os arquivos em src/app/api/ para extrair
os endpoints existentes. Para cada endpoint inclua:
- Método HTTP e rota
- Descrição do que faz
- Parâmetros (query, body, headers)
- Exemplo de request e response
- Códigos de status possíveis
```

---

### Infraestrutura (Bicep)

```
Crie o arquivo docs/INFRASTRUCTURE.md documentando a infraestrutura Azure
do projeto Space Intelligence Platform. Leia o arquivo infrastructure/main.bicep
e documente:
- Recursos criados (App Service, Key Vault, Application Insights, etc.)
- Parâmetros do template e seus valores padrão
- Outputs gerados
- Dependências entre recursos
- Comandos az CLI para provisionar e destruir o ambiente
```

---

### Pipeline CI/CD

```
Crie o arquivo docs/CICD.md documentando o pipeline GitHub Actions do projeto
Space Intelligence Platform. Leia .github/workflows/azure-deploy.yml e documente:
- Visão geral do pipeline (trigger, jobs, dependências)
- Job build: passos, artefato gerado, tamanho esperado
- Job deploy: passos, método de autenticação (Publish Profile), destino Azure
- Secret necessário: AZURE_WEBAPP_PUBLISH_PROFILE — como obter e configurar
- Configurações do Azure App Service necessárias (Startup Command, SCM_DO_BUILD_DURING_DEPLOYMENT)
- Como re-executar manualmente via workflow_dispatch
```

---

### Roteiro de evidências para entrega

```
Crie o arquivo docs/EVIDENCIAS.md com um roteiro detalhado de prints e
evidências que preciso coletar para a entrega do Global Solution 2026 FIAP.
Para cada evidência inclua: onde tirar o print, o que deve estar visível,
e qual item do checklist de entrega ela cobre. Baseie-se no checklist
que está no README.md e no contexto do projeto Azure + GitHub Actions.
```

---

### Atualizar README completo

```
Revise e atualize o README.md do projeto Space Intelligence Platform com base
no estado atual do projeto. Corrija qualquer informação desatualizada, ajuste
os prints esperados para refletir o fluxo real (Publish Profile, Node 22,
standalone build), e garanta que o checklist de entrega esteja completo
e correto.
```

---

## Contexto do projeto (para referência)

- **Curso:** Engenharia de Software · 4º Ano · FIAP · Disciplina SDTCC
- **Cloud:** Azure App Service (Node 22, centralus)
- **CI/CD:** GitHub Actions — build job + deploy job com `needs: build`
- **Autenticação Azure:** Publish Profile (`AZURE_WEBAPP_PUBLISH_PROFILE`)
- **Build:** Next.js 14 standalone (`output: 'standalone'` em next.config.js)
- **Startup Command:** `node server.js`
- **App Settings Azure:** `SCM_DO_BUILD_DURING_DEPLOYMENT=false`, `WEBSITES_PORT=3000`
- **Monitoramento:** Application Insights + Log Analytics Workspace
- **IaC:** Azure Bicep (`infrastructure/main.bicep`)
- **URL produção:** `https://space-intelligence-platform-hwevhub5h4geh5fu.centralus-01.azurewebsites.net`
