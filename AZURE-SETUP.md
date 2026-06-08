# Azure Setup — Space Intelligence Platform
> Tudo que precisa ser criado no Azure via portal ou CLI, sem usar o Bicep.

---

## VISÃO GERAL — O que criar

| # | Recurso | Nome | Por que é obrigatório |
|---|---|---|---|
| 1 | Resource Group | `rg-space-platform` | Agrupa todos os recursos |
| 2 | App Service Plan | `asp-space-platform` | Plano de hospedagem do app |
| 3 | App Service | `space-intelligence-platform` | Onde o site fica no ar |
| 4 | Key Vault | `kv-space-platform` | Cofre de credenciais — critério de segurança |
| 5 | Log Analytics Workspace | `law-space-platform` | Necessário para o Application Insights |
| 6 | Application Insights | `ai-space-platform` | Monitoramento — critério obrigatório |
| 7 | Service Principal | `sp-space-platform-github` | Credencial para o GitHub Actions fazer deploy |
| 8 | GitHub Secrets | 3 secrets | Credenciais seguras no pipeline CI/CD |
| 9 | Key Vault Secrets | 2 secrets | Dados sensíveis no cofre |
| 10 | Role Assignments | 2 papéis | Controle de acesso IAM — critério de segurança |
| 11 | Alert Rule | `alert-failed-requests` | Monitoramento — critério obrigatório |

---

## ETAPA 1 — Resource Group

### Via portal
1. Portal Azure → **Resource groups** → **+ Create**
2. Preencha:
   - **Subscription:** sua subscription educacional FIAP
   - **Resource group:** `rg-space-platform`
   - **Region:** `Brazil South`
3. Clique em **Review + create** → **Create**

### Via CLI
```bash
az login
az group create --name rg-space-platform --location brazilsouth
```

> **PRINT:** Portal → Resource groups → `rg-space-platform` com status **Succeeded**.

---

## ETAPA 2 — App Service Plan

### Via portal
1. Portal Azure → **App Service plans** → **+ Create**
2. Preencha:
   - **Subscription:** sua subscription
   - **Resource Group:** `rg-space-platform`
   - **Name:** `asp-space-platform`
   - **Operating System:** `Linux`
   - **Region:** `Brazil South`
   - **Pricing plan:** `Basic B1`
3. Clique em **Review + create** → **Create**

### Via CLI
```bash
az appservice plan create \
  --name asp-space-platform \
  --resource-group rg-space-platform \
  --location brazilsouth \
  --is-linux \
  --sku B1
```

> **PRINT:** App Service Plan criado com tier **B1** visível.

---

## ETAPA 3 — App Service

### Via portal
1. Portal Azure → **App Services** → **+ Create** → **Web App**
2. Preencha:
   - **Subscription:** sua subscription
   - **Resource Group:** `rg-space-platform`
   - **Name:** `space-intelligence-platform` *(deve ser único globalmente)*
   - **Publish:** `Code`
   - **Runtime stack:** `Node 20 LTS`
   - **Operating System:** `Linux`
   - **Region:** `Brazil South`
   - **App Service Plan:** selecione `asp-space-platform`
3. Aba **Monitoring** → **Enable Application Insights:** deixar `No` por enquanto (vamos conectar depois)
4. Clique em **Review + create** → **Create**

### Após criar — ativar HTTPS obrigatório
1. Vá no App Service criado → **Settings** → **Configuration** → aba **General settings**
2. **HTTPS Only:** mude para **On**
3. Clique em **Save**

### Após criar — ativar Managed Identity
1. App Service → **Settings** → **Identity**
2. Aba **System assigned** → Status: **On**
3. Clique em **Save** → confirme

> **PRINT 1:** App Service criado com URL `https://space-intelligence-platform.azurewebsites.net`.
> **PRINT 2:** Configuration → General settings → HTTPS Only = **On**.
> **PRINT 3:** Identity → System assigned → Status = **On** (mostra o Object ID).

### Via CLI
```bash
az webapp create \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  --plan asp-space-platform \
  --runtime "NODE:20-lts"

# HTTPS obrigatório
az webapp update \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  --https-only true

# Managed Identity
az webapp identity assign \
  --name space-intelligence-platform \
  --resource-group rg-space-platform
```

---

## ETAPA 4 — Log Analytics Workspace

Necessário para criar o Application Insights no modo workspace-based.

### Via portal
1. Portal Azure → pesquise **Log Analytics workspaces** → **+ Create**
2. Preencha:
   - **Subscription:** sua subscription
   - **Resource Group:** `rg-space-platform`
   - **Name:** `law-space-platform`
   - **Region:** `Brazil South`
3. Clique em **Review + create** → **Create**

### Via CLI
```bash
az monitor log-analytics workspace create \
  --workspace-name law-space-platform \
  --resource-group rg-space-platform \
  --location brazilsouth
```

---

## ETAPA 5 — Application Insights

### Via portal
1. Portal Azure → pesquise **Application Insights** → **+ Create**
2. Preencha:
   - **Subscription:** sua subscription
   - **Resource Group:** `rg-space-platform`
   - **Name:** `ai-space-platform`
   - **Region:** `Brazil South`
   - **Resource Mode:** `Workspace-based`
   - **Log Analytics Workspace:** selecione `law-space-platform`
3. Clique em **Review + create** → **Create**

### Conectar ao App Service
1. App Service `space-intelligence-platform` → **Settings** → **Configuration** → **Application settings**
2. Clique em **+ New application setting** e adicione:

| Name | Value |
|---|---|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | *(cole a connection string — ver abaixo)* |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~3` |
| `NODE_ENV` | `production` |
| `WEBSITES_PORT` | `3000` |

**Como pegar a connection string:**
> Application Insights `ai-space-platform` → **Overview** → copie o campo **Connection String**

3. Clique em **Save**

### Via CLI
```bash
# Criar Application Insights
az monitor app-insights component create \
  --app ai-space-platform \
  --resource-group rg-space-platform \
  --location brazilsouth \
  --workspace law-space-platform

# Pegar connection string
az monitor app-insights component show \
  --app ai-space-platform \
  --resource-group rg-space-platform \
  --query connectionString \
  -o tsv
```

> **PRINT:** Application Insights → Overview mostrando o recurso ativo com Connection String visível.

---

## ETAPA 6 — Key Vault

### Via portal
1. Portal Azure → **Key vaults** → **+ Create**
2. Aba **Basics:**
   - **Subscription:** sua subscription
   - **Resource Group:** `rg-space-platform`
   - **Key vault name:** `kv-space-platform`
   - **Region:** `Brazil South`
   - **Pricing tier:** `Standard`
3. Aba **Access configuration:**
   - **Permission model:** `Azure role-based access control (RBAC)`
4. Clique em **Review + create** → **Create**

### Via CLI
```bash
az keyvault create \
  --name kv-space-platform \
  --resource-group rg-space-platform \
  --location brazilsouth \
  --enable-rbac-authorization true
```

> **PRINT:** Key Vault criado com **Permission model: Azure role-based access control** visível em Access configuration.

---

## ETAPA 7 — Key Vault Secrets

Crie 2 secrets dentro do Key Vault:

### Via portal
1. Key Vault `kv-space-platform` → **Objects** → **Secrets** → **+ Generate/Import**

**Secret 1:**
- **Upload options:** Manual
- **Name:** `SpacePlatformApiKey`
- **Secret value:** `sp-demo-key-2026-fiap-sdtcc`
- Clique em **Create**

**Secret 2:**
- **Upload options:** Manual
- **Name:** `AppInsightsConnectionString`
- **Secret value:** *(cole a connection string do Application Insights — mesma copiada na Etapa 5)*
- Clique em **Create**

### Via CLI
```bash
# Primeiro obtenha a connection string
CONN_STR=$(az monitor app-insights component show \
  --app ai-space-platform \
  --resource-group rg-space-platform \
  --query connectionString -o tsv)

# Criar secrets
az keyvault secret set \
  --vault-name kv-space-platform \
  --name SpacePlatformApiKey \
  --value "sp-demo-key-2026-fiap-sdtcc"

az keyvault secret set \
  --vault-name kv-space-platform \
  --name AppInsightsConnectionString \
  --value "$CONN_STR"
```

> **PRINT:** Key Vault → Secrets mostrando `SpacePlatformApiKey` e `AppInsightsConnectionString` listados com status **Enabled**.

---

## ETAPA 8 — Role Assignments (IAM)

Dois role assignments precisam ser criados e documentados.

---

### Role Assignment 1 — Managed Identity do App Service lê o Key Vault

Permite que o App Service leia os secrets do Key Vault sem expor senha no código.

**Via portal:**
1. Key Vault `kv-space-platform` → **Access control (IAM)** → **+ Add** → **Add role assignment**
2. Aba **Role:** busque e selecione **Key Vault Secrets User**
3. Clique em **Next**
4. Aba **Members:**
   - **Assign access to:** `Managed identity`
   - Clique em **+ Select members**
   - Selecione sua subscription → **Managed identity:** `App Service`
   - Selecione `space-intelligence-platform`
5. Clique em **Review + assign** → **Review + assign**

**Via CLI:**
```bash
# Obter o Object ID da Managed Identity do App Service
PRINCIPAL_ID=$(az webapp identity show \
  --name space-intelligence-platform \
  --resource-group rg-space-platform \
  --query principalId -o tsv)

# Obter o ID do Key Vault
KV_ID=$(az keyvault show \
  --name kv-space-platform \
  --resource-group rg-space-platform \
  --query id -o tsv)

# Criar role assignment
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee-object-id $PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --scope $KV_ID
```

> **PRINT:** Key Vault → Access control (IAM) → Role assignments → mostrando **Key Vault Secrets User** atribuído à Managed Identity do App Service.

---

### Role Assignment 2 — Service Principal do GitHub tem acesso ao Resource Group

Primeiro, crie o Service Principal (necessário para o GitHub Actions fazer deploy):

**Via CLI:**
```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az ad sp create-for-rbac \
  --name "sp-space-platform-github" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-space-platform \
  --sdk-auth
```

**ATENÇÃO: Copie o JSON completo que aparecer.** Exemplo de formato:
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  ...
}
```

> **PRINT:** Resource Group `rg-space-platform` → Access control (IAM) → Role assignments → mostrando `sp-space-platform-github` com role **Contributor**.

---

## ETAPA 9 — GitHub Secrets

No repositório GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Crie os 3 secrets abaixo:

| Secret | Valor |
|---|---|
| `AZURE_CREDENTIALS` | JSON completo gerado na Etapa 8 (Role Assignment 2) |
| `AZURE_APP_NAME` | `space-intelligence-platform` |
| `AZURE_RESOURCE_GROUP` | `rg-space-platform` |

> **PRINT:** GitHub → Settings → Secrets → Actions → mostrando os 3 secrets com valores ocultos `***`.

---

## ETAPA 10 — Alert Rule

1. Portal Azure → Application Insights `ai-space-platform` → **Alerts** → **+ Create** → **Alert rule**

2. Aba **Condition:**
   - Clique em **+ Add condition**
   - Busque e selecione **Failed requests**
   - **Threshold:** `5`
   - **Aggregation type:** `Count`
   - **Operator:** `Greater than`
   - **Check every:** `5 minutes`
   - **Lookback period:** `5 minutes`
   - Clique em **Done**

3. Aba **Actions:**
   - Clique em **+ Create action group**
   - **Action group name:** `ag-space-team`
   - **Display name:** `SpaceTeam`
   - Aba **Notifications:**
     - **Notification type:** `Email/SMS message/Push/Voice`
     - **Name:** `email-equipe`
     - Marque **Email** e coloque o email da equipe
   - Clique em **Review + create** → **Create**

4. Aba **Details:**
   - **Severity:** `2 - Warning`
   - **Alert rule name:** `alert-high-failed-requests`
   - **Description:** `Dispara quando requisições falhas ultrapassam 5 em 5 minutos`

5. Clique em **Review + create** → **Create**

> **PRINT:** Alerts → lista mostrando `alert-high-failed-requests` com **Severity 2**, signal **Failed requests** e action group visíveis.

---

## ETAPA 11 — App Settings finais no App Service

Certifique-se de que as seguintes configurações estão no App Service antes do primeiro deploy:

1. App Service → **Configuration** → **Application settings**
2. Confirme que existem (adicione os que faltam):

| Name | Value |
|---|---|
| `NODE_ENV` | `production` |
| `WEBSITES_PORT` | `3000` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | *(connection string do App Insights)* |
| `ApplicationInsightsAgent_EXTENSION_VERSION` | `~3` |

3. Clique em **Save**

---

## CHECKLIST FINAL

### Recursos criados
- [ ] Resource Group `rg-space-platform` — Brazil South
- [ ] App Service Plan `asp-space-platform` — B1, Linux
- [ ] App Service `space-intelligence-platform` — Node 20, HTTPS Only ON
- [ ] Managed Identity ativada no App Service
- [ ] Log Analytics Workspace `law-space-platform`
- [ ] Application Insights `ai-space-platform` — conectado ao App Service
- [ ] Key Vault `kv-space-platform` — RBAC habilitado
- [ ] Secret `SpacePlatformApiKey` no Key Vault
- [ ] Secret `AppInsightsConnectionString` no Key Vault

### Segurança
- [ ] Role Assignment: Managed Identity → Key Vault Secrets User
- [ ] Service Principal `sp-space-platform-github` criado com role Contributor
- [ ] 3 GitHub Secrets configurados (`AZURE_CREDENTIALS`, `AZURE_APP_NAME`, `AZURE_RESOURCE_GROUP`)
- [ ] HTTPS Only = On no App Service

### Monitoramento
- [ ] Application Insights ativo e conectado ao App Service
- [ ] Alert Rule `alert-high-failed-requests` criada (Sev 2, Failed requests > 5)

---

## PRINTS NECESSÁRIOS PARA A DOCUMENTAÇÃO

| # | Print | Onde tirar |
|---|---|---|
| 1 | Resource Group criado | Portal → Resource Groups → `rg-space-platform` |
| 2 | App Service online | App Service → Overview (URL visível) |
| 3 | HTTPS Only ativado | App Service → Configuration → General settings |
| 4 | Managed Identity ativa | App Service → Identity (Object ID visível) |
| 5 | Application Insights | App Insights → Overview (Connection String visível) |
| 6 | Key Vault criado | Key Vault → Overview |
| 7 | Key Vault secrets | Key Vault → Secrets (2 secrets listados) |
| 8 | IAM Key Vault | Key Vault → Access control (IAM) → Role assignments |
| 9 | IAM Resource Group | Resource Group → Access control (IAM) → Role assignments |
| 10 | GitHub Secrets | GitHub → Settings → Secrets → Actions |
| 11 | Alert Rule configurada | App Insights → Alerts (signal + condição + severidade) |
| 12 | Live Metrics com requests | App Insights → Live Metrics (após abrir o site) |
| 13 | Log Stream ativo | App Service → Log stream |
| 14 | 1º workflow verde | GitHub → Actions (1ª execução) |
| 15 | 2º workflow verde | GitHub → Actions (2ª execução) |
| 16 | Deployment Center | App Service → Deployment Center (2 deploys) |
| 17 | App em produção | Navegador em `https://space-intelligence-platform.azurewebsites.net` |
