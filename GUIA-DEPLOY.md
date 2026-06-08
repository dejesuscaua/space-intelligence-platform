# Guia de Deploy — Space Intelligence Platform

> Passo a passo completo para subir o projeto no Azure e configurar tudo que será avaliado.
> Execute na ordem. Cada seção tem o print que você precisa tirar para a documentação.

---

## Pré-requisitos — instalar antes de começar

| Ferramenta | Link | Para que serve |
|---|---|---|
| Node.js 20+ | https://nodejs.org | Rodar e buildar o projeto |
| Azure CLI | https://aka.ms/install-azure-cli | Criar recursos no Azure via terminal |
| Git | https://git-scm.com | Versionar e fazer push |
| GitHub CLI (opcional) | https://cli.github.com | Criar repositório via terminal |

Verifique se estão instalados:
```bash
node --version    # deve mostrar v20.x.x
az --version      # deve mostrar azure-cli 2.x.x
git --version
```

---

## ETAPA 1 — Testar localmente

```bash
cd space-intelligence-platform
npm install
npm run dev
```

Acesse `http://localhost:3000` e confirme que a landing page aparece.

> **Print 1:** Tela do navegador mostrando a landing page rodando em localhost.

---

## ETAPA 2 — Criar repositório no GitHub

### Opção A — Via GitHub CLI (terminal)
```bash
gh auth login
gh repo create space-intelligence-platform --public --source=. --remote=origin --push
```

### Opção B — Via portal GitHub
1. Acesse github.com → New repository
2. Nome: `space-intelligence-platform`
3. Visibilidade: **Public**
4. **Não** inicializar com README (o projeto já tem)
5. Clique em "Create repository"

Depois, no terminal:
```bash
cd space-intelligence-platform
git init
git add .
git commit -m "feat: initial Space Intelligence Platform deployment"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/space-intelligence-platform.git
git push -u origin main
```

> **Print 2:** Repositório criado no GitHub com os arquivos listados.

---

## ETAPA 3 — Login no Azure

```bash
az login
```

Uma janela do navegador vai abrir para autenticar. Após login, confirme que está na subscription correta:

```bash
az account show --query "{nome:name, id:id, status:state}" -o table
```

---

## ETAPA 4 — Criar Resource Group

```bash
az group create \
  --name rg-space-platform \
  --location brazilsouth
```

Resultado esperado: JSON com `"provisioningState": "Succeeded"`.

> **Print 3:** Output do comando ou portal Azure mostrando o Resource Group `rg-space-platform` criado.

---

## ETAPA 5 — Deploy da infraestrutura com Bicep

Este comando cria **tudo de uma vez**: App Service Plan, App Service, Key Vault, Application Insights e Log Analytics Workspace.

```bash
az deployment group create \
  --resource-group rg-space-platform \
  --template-file infrastructure/main.bicep \
  --name "deploy-space-platform"
```

A execução leva cerca de 3–5 minutos. Ao terminar, veja os outputs:

```bash
az deployment group show \
  --resource-group rg-space-platform \
  --name "deploy-space-platform" \
  --query "properties.outputs" \
  -o table
```

Você verá:
- `appServiceUrl` → URL pública da aplicação
- `keyVaultName` → nome do cofre criado
- `appServicePrincipalId` → ID da Managed Identity

> **Print 4:** Output dos recursos criados no portal Azure → Resource Group `rg-space-platform` → Resources (lista mostrando App Service, Key Vault, Application Insights).

---

## ETAPA 6 — Gerar Service Principal para o GitHub Actions

```bash
# Obter ID da subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Criar Service Principal
az ad sp create-for-rbac \
  --name "sp-space-platform-github" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-space-platform \
  --sdk-auth
```

**ATENÇÃO:** Vai aparecer um JSON no terminal assim:
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  ...
}
```

**Copie esse JSON completo** — você vai precisar no próximo passo. Ele não aparece novamente.

---

## ETAPA 7 — Configurar GitHub Secrets

No repositório GitHub:
1. Vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret** para cada um:

| Nome do Secret | Valor |
|---|---|
| `AZURE_CREDENTIALS` | Cole o JSON completo do passo anterior |
| `AZURE_APP_NAME` | `space-intelligence-platform` |
| `AZURE_RESOURCE_GROUP` | `rg-space-platform` |

> **Print 5:** Tela do GitHub → Settings → Secrets → Actions mostrando os 3 secrets listados (valores ocultos com `***`).

---

## ETAPA 8 — Primeiro Deploy Automático (1º deploy)

O workflow do GitHub Actions já está configurado para disparar no `git push main`. Se você fez o push na Etapa 2, o pipeline já está rodando.

Verifique em: **github.com/SEU-USUARIO/space-intelligence-platform → Actions**

Aguarde o workflow "Deploy Space Intelligence Platform to Azure" completar (3–5 minutos).

Se o push foi antes de configurar os secrets, faça um novo commit pequeno:
```bash
# Só para disparar o pipeline novamente
git commit --allow-empty -m "ci: trigger first Azure deployment"
git push
```

> **Print 6:** GitHub Actions mostrando o workflow com status verde ✅ e todos os steps concluídos.

---

## ETAPA 9 — Segundo Deploy Automático (2º deploy — evidência obrigatória)

Faça uma alteração pequena para gerar o 2º deploy:

```bash
# Abra src/components/Team.tsx e altere o texto no rodapé
# Mude "v1.0.0" por "v1.0.1" ou adicione qualquer texto pequeno
```

Depois:
```bash
git add src/components/Team.tsx
git commit -m "chore: bump version to v1.0.1 - second deployment evidence"
git push
```

Aguarde o workflow completar novamente.

> **Print 7:** GitHub Actions mostrando **2 execuções** do workflow com status verde ✅.
>
> **Print 8:** Azure Portal → App Service `space-intelligence-platform` → **Deployment Center** → lista mostrando 2 deploys registrados.

---

## ETAPA 10 — Verificar App em Produção

```bash
# Testar a landing page
curl -I https://space-intelligence-platform.azurewebsites.net
# Deve retornar: HTTP/2 200

# Testar o health check
curl https://space-intelligence-platform.azurewebsites.net/api/status
# Deve retornar: {"status":"ok","platform":"Space Intelligence Platform",...}
```

Também acesse pelo navegador para confirmar que a página carrega.

> **Print 9:** Navegador mostrando a landing page em produção na URL `*.azurewebsites.net`.

---

## ETAPA 11 — Verificar Key Vault e Secrets

```bash
# Listar secrets no Key Vault
az keyvault secret list \
  --vault-name kv-space-platform \
  --query "[].name" \
  -o table
```

Deve listar:
- `SpacePlatformApiKey`
- `AppInsightsConnectionString`

> **Print 10:** Portal Azure → Key Vault `kv-space-platform` → Secrets → lista mostrando os 2 secrets.

---

## ETAPA 12 — Verificar IAM (Role Assignment)

### Role Assignment 1 — Managed Identity → Key Vault

> Portal Azure → Key Vault `kv-space-platform` → **Access control (IAM)** → **Role assignments**
>
> Deve aparecer a Managed Identity do App Service com role **Key Vault Secrets User**.

### Role Assignment 2 — Service Principal → Resource Group

> Portal Azure → Resource Group `rg-space-platform` → **Access control (IAM)** → **Role assignments**
>
> Deve aparecer `sp-space-platform-github` com role **Contributor**.

> **Print 11:** Tela IAM do Key Vault com a Managed Identity listada.
> **Print 12:** Tela IAM do Resource Group com o Service Principal listado.

---

## ETAPA 13 — Configurar Alert Rule no Application Insights

1. Portal Azure → **Application Insights** `ai-space-platform`
2. Menu lateral → **Alerts** → **+ Create** → **Alert rule**
3. Configure:

| Campo | Valor |
|---|---|
| **Signal** | `Failed requests` |
| **Condition** | Count > 5 |
| **Aggregation period** | 5 minutes |
| **Action group** | Criar novo → nome: `ag-space-team` → adicionar email da equipe |
| **Severity** | **2 - Warning** |
| **Alert rule name** | `alert-high-failed-requests` |

4. Clique em **Review + create** → **Create**

> **Print 13:** Alert Rule listada no portal com signal, condição, ação e severidade visíveis.

---

## ETAPA 14 — Evidenciar Monitoramento

### Log Stream
> Portal Azure → App Service `space-intelligence-platform` → **Log stream**

Acesse a landing page algumas vezes enquanto o Log Stream está aberto para gerar logs.

> **Print 14:** Log Stream mostrando linhas de log com requests chegando.

### Live Metrics
> Portal Azure → Application Insights `ai-space-platform` → **Live Metrics**

Acesse a aplicação no navegador enquanto essa tela está aberta.

> **Print 15:** Live Metrics mostrando Incoming Requests/sec e Server Response Time.

### Metrics
> Application Insights → **Metrics** → selecione métrica `Server requests`

> **Print 16:** Gráfico de métricas mostrando requests registrados.

---

## ETAPA 15 — Verificar HTTPS

```bash
az webapp show \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  --query "httpsOnly" \
  -o tsv
# Deve retornar: true
```

> **Print 17:** Portal Azure → App Service → **Configuration** → **General settings** → HTTPS Only = **On**.

---

## Checklist Final — conferir antes de entregar

- [ ] Landing page acessível em `https://space-intelligence-platform.azurewebsites.net`
- [ ] `/api/status` retorna JSON 200 com `"status": "ok"`
- [ ] 2 execuções do workflow no GitHub Actions com status verde
- [ ] Deployment Center com 2 deploys registrados
- [ ] Key Vault com `SpacePlatformApiKey` e `AppInsightsConnectionString`
- [ ] Application Insights ativo (Live Metrics funcionando)
- [ ] Alert Rule configurada (signal + condição + ação + Sev 2)
- [ ] Role assignment IAM documentado (Managed Identity + Service Principal)
- [ ] HTTPS Only = On no App Service
- [ ] Nenhuma credencial no código (`git log` limpo)

---

## Resumo de Prints para a Documentação

| # | Print | Onde tirar |
|---|---|---|
| 1 | Landing page local | `http://localhost:3000` |
| 2 | Repositório no GitHub | github.com/SEU-USUARIO/space-intelligence-platform |
| 3 | Resource Group criado | Portal → Resource Groups |
| 4 | Recursos Azure listados | Portal → rg-space-platform → Resources |
| 5 | GitHub Secrets configurados | GitHub → Settings → Secrets → Actions |
| 6 | 1º workflow verde | GitHub → Actions |
| 7 | 2 workflows verdes | GitHub → Actions |
| 8 | Deployment Center com 2 deploys | Portal → App Service → Deployment Center |
| 9 | App em produção no navegador | `https://space-intelligence-platform.azurewebsites.net` |
| 10 | Key Vault com 2 secrets | Portal → Key Vault → Secrets |
| 11 | IAM Key Vault (Managed Identity) | Portal → Key Vault → Access control (IAM) |
| 12 | IAM Resource Group (Service Principal) | Portal → RG → Access control (IAM) |
| 13 | Alert Rule configurada | Portal → App Insights → Alerts |
| 14 | Log Stream ativo | Portal → App Service → Log stream |
| 15 | Live Metrics com requests | Portal → App Insights → Live Metrics |
| 16 | Gráfico de Metrics | Portal → App Insights → Metrics |
| 17 | HTTPS Only ativo | Portal → App Service → Configuration |

---

## Comandos de diagnóstico úteis

```bash
# Ver logs do App Service em tempo real
az webapp log tail \
  --name space-intelligence-platform \
  --resource-group rg-space-platform

# Reiniciar App Service (se necessário)
az webapp restart \
  --name space-intelligence-platform \
  --resource-group rg-space-platform

# Ver configurações do App Service
az webapp config appsettings list \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  -o table

# Verificar se HTTPS está ativo
az webapp show \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  --query "httpsOnly"
```

---

*Global Solution 2026 · FIAP · SDTCC · Equipe: Davi RM551605 | Cauã RM97648 | Luan RM98290 | Rui RM98436 | Luigi RM98047*
