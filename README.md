# Space Intelligence Platform

> The Cognitive Infrastructure for a Smarter Planet

**Global Solution 2026 · FIAP · Engenharia de Software · 4º Ano · Disciplina: SDTCC**

URL de produção: `https://space-intelligence-platform.azurewebsites.net` *(atualizar após o deploy)*

---

## Equipe

| Nome | RM |
|---|---|
| Davi Passanha de Sousa Guerra | RM551605 |
| Cauã Gonçalves de Jesus | RM97648 |
| Luan Silveira Macea | RM98290 |
| Rui Amorim Siqueira | RM98436 |
| Luigi Ferrara Sinno | RM98047 |

---

## Sobre o Projeto

A **Space Intelligence Platform** é uma infraestrutura cognitiva que correlaciona dados orbitais, sensores IoT, telemetria industrial e IA multimodal para transformar dados espaciais em inteligência operacional em tempo real.

**ODS Conectados:**
- ODS 9 — Indústria, Inovação e Infraestrutura
- ODS 13 — Ação Climática

**Problema:** Empresas têm acesso a dados satelitais, sensores IoT e telemetria — mas cada sistema opera isolado, gerando baixa previsibilidade, desperdício operacional e dados fragmentados.

**Solução:** Plataforma unificada com 4 camadas (Orbital → Terrestre → Inteligência → Operacional) que correlaciona bilhões de sinais com 82% de acurácia preditiva.

---

## Arquitetura

```
ORBITAL LAYER      → Satélites (Sentinel, Planet Labs, ESA, NASA)
       ↓
GROUND LAYER       → IoT, Drones, LoRaWAN, 4G/5G
       ↓
INTELLIGENCE LAYER → Space Cognitive Engine (Computer Vision, LLMs, Graph AI)
       ↓
ACTION LAYER       → Alertas, Dashboards, APIs, Integração ERP
```

**Infraestrutura Cloud (Azure):**

```
GitHub (código)
    ↓ git push main
GitHub Actions (CI/CD)
    ↓ build + deploy
Azure App Service (Node 20 LTS, HTTPS only)
    ↓ monitoramento
Application Insights + Log Analytics Workspace
    ↓ segredos
Azure Key Vault (SpacePlatformApiKey, AppInsightsConnectionString)
```

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
- Conta Azure (subscription educacional FIAP)
- Conta GitHub

---

## Executar Localmente

```bash
git clone https://github.com/<seu-usuario>/space-intelligence-platform.git
cd space-intelligence-platform
npm install
npm run dev
# Acesse: http://localhost:3000
```

---

## Deploy no Azure — Passo a Passo

### 1. Criar Resource Group e recursos Azure

```bash
# Login no Azure
az login

# Criar Resource Group
az group create --name rg-space-platform --location brazilsouth

# Deploy da infraestrutura (Bicep)
az deployment group create \
  --resource-group rg-space-platform \
  --template-file infrastructure/main.bicep \
  --parameters location=brazilsouth

# Verificar outputs
az deployment group show \
  --resource-group rg-space-platform \
  --name main \
  --query properties.outputs
```

> **Print esperado:** Outputs mostrando `appServiceUrl`, `keyVaultName` e `appServicePrincipalId`.

---

### 2. Gerar Service Principal para o GitHub Actions

```bash
# Obter ID da subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Criar Service Principal com role Contributor no Resource Group
az ad sp create-for-rbac \
  --name "sp-space-platform-github" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-space-platform \
  --sdk-auth
```

> **Copie o JSON inteiro** que aparecer — ele será o valor do secret `AZURE_CREDENTIALS`.

---

### 3. Configurar GitHub Secrets

No repositório GitHub → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `AZURE_CREDENTIALS` | JSON completo gerado no passo 2 |
| `AZURE_APP_NAME` | `space-intelligence-platform` |
| `AZURE_RESOURCE_GROUP` | `rg-space-platform` |

> **Print esperado:** Tela do GitHub com os 3 secrets listados (valores ocultos).

---

### 4. Role Assignment — Documentação IAM

O Bicep já cria automaticamente o role assignment:
- **Role:** `Key Vault Secrets User`
- **Principal:** Managed Identity do App Service
- **Scope:** Azure Key Vault

Para verificar no portal:
> Azure Portal → Key Vault `kv-space-platform` → Access control (IAM) → Role assignments

> **Print esperado:** Lista mostrando a Managed Identity do App Service com role "Key Vault Secrets User".

Para documentar o Service Principal do GitHub Actions:
> Azure Portal → Resource Group `rg-space-platform` → Access control (IAM) → Role assignments

> **Print esperado:** Service Principal `sp-space-platform-github` com role "Contributor".

---

### 5. Configurar Key Vault Secrets

O Bicep cria os secrets automaticamente. Para verificar:

```bash
# Listar secrets do Key Vault
az keyvault secret list --vault-name kv-space-platform --query "[].name" -o table
```

> **Print esperado:** `SpacePlatformApiKey` e `AppInsightsConnectionString` listados.

---

### 6. Primeiro Deploy (1º commit)

```bash
# Criar repositório no GitHub (via GitHub CLI ou portal)
gh repo create space-intelligence-platform --public

# Inicializar git e fazer push
git init
git add .
git commit -m "feat: initial Space Intelligence Platform deployment"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/space-intelligence-platform.git
git push -u origin main
```

> **O GitHub Actions dispara automaticamente.**
> 
> **Print esperado:** GitHub → Actions → workflow "Deploy Space Intelligence Platform to Azure" com status verde ✅.

---

### 7. Segundo Deploy (2º commit)

Faça uma pequena alteração para evidenciar o 2º deploy automático:

```bash
# Exemplo: alterar versão no footer em src/components/Team.tsx
# Mude "v1.0.0" para "v1.0.1" ou similar

git add src/components/Team.tsx
git commit -m "chore: bump version to v1.0.1 — second deployment evidence"
git push
```

> **Print esperado:** GitHub → Actions → 2 execuções do workflow com status verde ✅.
>
> **Print esperado:** Azure Portal → App Service → Deployment Center → 2 deploys registrados.

---

### 8. Configurar Alert Rule no Azure

> Azure Portal → Application Insights `ai-space-platform` → Alerts → Create → Alert rule

Configuração:
- **Signal:** `Failed requests`
- **Condição:** Count > 5 (janela de 5 minutos)
- **Action group:** Criar novo → adicionar email da equipe
- **Severity:** Sev 2 — Warning
- **Nome:** `alert-high-failed-requests`

> **Print esperado:** Alert Rule listada com signal, condição, ação e severidade visíveis.

---

### 9. Evidenciar Monitoramento

**Log Stream:**
> Azure Portal → App Service `space-intelligence-platform` → Log stream

Acesse `https://space-intelligence-platform.azurewebsites.net` algumas vezes e capture o Log Stream ativo.

**Live Metrics:**
> Application Insights `ai-space-platform` → Live Metrics

> **Print esperado:** Live Metrics mostrando requests/sec, server response time e failed requests.

**Health Check endpoint:**
```bash
curl https://space-intelligence-platform.azurewebsites.net/api/status
# Resposta esperada: {"status":"ok","platform":"Space Intelligence Platform",...}
```

---

## Estrutura do Projeto

```
space-intelligence-platform/
├── .github/workflows/azure-deploy.yml   # CI/CD pipeline
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/status/route.ts          # GET /api/status — health check
│   └── components/
│       ├── Hero.tsx
│       ├── Problem.tsx
│       ├── Platform.tsx
│       ├── CorrelationExample.tsx
│       ├── UseCases.tsx
│       ├── Dashboard.tsx
│       ├── Roadmap.tsx
│       ├── BusinessModel.tsx
│       └── Team.tsx
├── infrastructure/main.bicep             # IaC: App Service + Key Vault + App Insights
├── package.json
└── README.md
```

---

## Segurança

| Prática | Como aplicada |
|---|---|
| Credenciais no GitHub Secrets | `AZURE_CREDENTIALS`, `AZURE_APP_NAME`, `AZURE_RESOURCE_GROUP` |
| Azure Key Vault | `SpacePlatformApiKey`, `AppInsightsConnectionString` |
| HTTPS obrigatório | `httpsOnly: true` no Bicep |
| Managed Identity | App Service acessa Key Vault sem senha hardcoded |
| Role Assignment documentado | Key Vault Secrets User + Contributor (ver seção IAM) |
| Sem credenciais no código | Verificado com `git log --all --grep="password\|secret\|key"` |

---

## Checklist de Entrega

- [ ] App acessível em `https://space-intelligence-platform.azurewebsites.net`
- [ ] `/api/status` retorna JSON 200
- [ ] 2 execuções do workflow no GitHub Actions com status verde
- [ ] Key Vault com `SpacePlatformApiKey` e `AppInsightsConnectionString`
- [ ] Application Insights ativo em Live Metrics
- [ ] Alert Rule configurada (signal + condição + ação + Sev 2)
- [ ] Role assignment documentado com print (IAM)
- [ ] Nenhuma credencial no histórico git
- [ ] HTTPS ativo (HTTPSOnly = true)
- [ ] Print do Deployment Center com 2 deploys

---

## Tecnologias

- **Frontend:** Next.js 14, React 18, TypeScript, Recharts
- **Cloud:** Microsoft Azure (App Service, Key Vault, Application Insights)
- **CI/CD:** GitHub Actions
- **IaC:** Azure Bicep
- **Monitoramento:** Azure Monitor, Application Insights

---

*Global Solution 2026 · FIAP · SDTCC · ODS 9 + ODS 13*
