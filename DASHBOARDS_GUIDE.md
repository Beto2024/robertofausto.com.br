# Guia Completo — Dashboards Power BI

> **Roberto Fausto** · Currículo Analytics & BI  
> Guia em português brasileiro para criação e publicação dos 3 dashboards profissionais.

---

## Sumário

1. [Requisitos](#1-requisitos)
2. [Dashboard Análise de Vendas](#2-dashboard-análise-de-vendas)
3. [Dashboard Indicadores de RH](#3-dashboard-indicadores-de-rh)
4. [Dashboard Financeiro](#4-dashboard-financeiro)
5. [Publicar e Incorporar no Site](#5-publicar-e-incorporar-no-site)
6. [Dicas de Design Profissional](#6-dicas-de-design-profissional)

---

## 1. Requisitos

### Power BI Desktop (gratuito)

- Baixe gratuitamente em: <https://powerbi.microsoft.com/pt-br/desktop/>
- Disponível para Windows (64-bit recomendado)
- Também disponível na Microsoft Store

### Power BI Service + Licença para "Publicar na Web"

O recurso **"Publicar na Web"** (que gera o iframe para incorporar no site) exige uma licença **Power BI Pro** ou superior.

| Opção | Custo | Observação |
|-------|-------|-----------|
| **Trial Power BI Pro — 60 dias** | Grátis | Recomendado! Tempo suficiente para criar e publicar os dashboards |
| Power BI Pro | ~R$ 52/mês/usuário | Assinatura mensal via Microsoft 365 — *preço sujeito a alteração, verifique em [microsoft.com](https://www.microsoft.com/pt-br/microsoft-365/business/compare-all-plans)* |
| Fabric Free | Gratuito | **Não** inclui "Publicar na Web" |

**Como ativar o trial gratuito de 60 dias:**
1. Acesse <https://app.powerbi.com>
2. Clique no seu avatar (canto superior direito)
3. Selecione **"Iniciar avaliação gratuita"** ou acesse `Configurações → Assinatura`
4. Siga as instruções para ativar o Power BI Pro por 60 dias

> ⚠️ **Importante:** Os links gerados pelo "Publicar na Web" **continuam funcionando mesmo após o trial expirar**, desde que você não os revogue manualmente.

---

## 2. Dashboard Análise de Vendas

### 2.1 Arquivos CSV a importar

| Arquivo | Caminho | Descrição |
|---------|---------|-----------|
| `vendas.csv` | `static/data/vendas/vendas.csv` | Tabela fato (~591 registros) |
| `produtos.csv` | `static/data/vendas/produtos.csv` | Dimensão produtos (30 itens) |
| `vendedores.csv` | `static/data/vendas/vendedores.csv` | Dimensão vendedores (10) |
| `regioes.csv` | `static/data/vendas/regioes.csv` | Dimensão regiões (8) |

**Como importar:**
1. Abra o Power BI Desktop
2. Clique em **Obter Dados → Texto/CSV**
3. Selecione cada arquivo, visualize e confirme com **Carregar**
4. Repita para os 4 arquivos

### 2.2 Relacionamentos (Star Schema)

No Power BI Desktop, vá em **Modo de Exibição de Modelo** e configure:

```
vendas[ProdutoID]  → produtos[ID]   (Muitos-para-Um)
vendas[VendedorID] → vendedores[ID] (Muitos-para-Um)
vendas[RegiaoID]   → regioes[ID]    (Muitos-para-Um)
```

> Dica: Crie também uma tabela calendário usando DAX para análise temporal.

**Tabela Calendário (DAX):**
```dax
dCalendario = 
ADDCOLUMNS(
    CALENDAR(DATE(2023,1,1), DATE(2025,12,31)),
    "Ano", YEAR([Date]),
    "Mês", MONTH([Date]),
    "NomeMes", FORMAT([Date], "MMMM", "pt-BR"),
    "Trimestre", "T" & QUARTER([Date]),
    "Semestre", IF(MONTH([Date]) <= 6, "S1", "S2"),
    "AnoMes", FORMAT([Date], "YYYY-MM"),
    "DiaSemana", WEEKDAY([Date], 2),
    "NomeDiaSemana", FORMAT([Date], "dddd", "pt-BR")
)
```

Relacione: `vendas[Data]` → `dCalendario[Date]`

### 2.3 Medidas DAX

Crie uma tabela de medidas em branco (`Inserir → Nova Tabela`) chamada `_Medidas_Vendas`:

```dax
-- Faturamento Total
Faturamento Total = 
SUMX(
    vendas,
    vendas[Quantidade] * vendas[ValorUnitario] * (1 - vendas[Desconto])
)

-- Quantidade de Vendas
Qtd Vendas = COUNT(vendas[ID])

-- Ticket Médio
Ticket Médio = DIVIDE([Faturamento Total], [Qtd Vendas], 0)

-- Meta (110% do faturamento)
Meta = [Faturamento Total] * 1.1

-- % Atingimento de Meta
% Meta = DIVIDE([Faturamento Total], [Meta], 0)

-- Variação Mês a Mês (MoM%)
Faturamento MoM% = 
VAR FatAtual = [Faturamento Total]
VAR FatAnterior = CALCULATE([Faturamento Total], DATEADD(dCalendario[Date], -1, MONTH))
RETURN
DIVIDE(FatAtual - FatAnterior, FatAnterior, BLANK())

-- Faturamento Acumulado no Ano (YTD)
Faturamento YTD = TOTALYTD([Faturamento Total], dCalendario[Date])

-- Margem Bruta
Margem Bruta = 
DIVIDE(
    SUMX(vendas, vendas[Quantidade] * (vendas[ValorUnitario] * (1 - vendas[Desconto]) - RELATED(produtos[Custo]))),
    [Faturamento Total],
    0
)
```

### 2.4 Layout Sugerido

**Página 1 — Visão Geral:**
- 4 KPI Cards no topo: Faturamento Total | Qtd Vendas | Ticket Médio | % Meta
- Gráfico de linhas (tendência mensal de faturamento)
- Barras horizontais (Top 10 Produtos por Faturamento)
- Mapa preenchido (Faturamento por Estado)

**Página 2 — Análise de Produtos:**
- Treemap por Categoria
- Tabela com ranking de produtos (Faturamento, Margem, Qtd)
- Gráfico de dispersão (Faturamento × Margem por produto)

**Página 3 — Performance de Vendedores:**
- Barras empilhadas (Vendedor × Categoria)
- Gauge de % Meta por vendedor
- Segmentação por Equipe

**Filtros globais (slicers):** Ano, Trimestre, Região, Categoria de Produto

### 2.5 Paleta de Cores

Tons de azul para combinar com o badge "Comercial" do site:

| Elemento | Cor HEX |
|----------|---------|
| Cor principal | `#3B82F6` (blue-500) |
| Cor secundária | `#1D4ED8` (blue-700) |
| Destaque positivo | `#10B981` (green-500) |
| Destaque negativo | `#EF4444` (red-500) |
| Background | `#0F172A` |
| Texto | `#F1F5F9` |

---

## 3. Dashboard Indicadores de RH

### 3.1 Arquivos CSV a importar

| Arquivo | Caminho | Descrição |
|---------|---------|-----------|
| `colaboradores.csv` | `static/data/rh/colaboradores.csv` | Tabela dimensão (~80 colaboradores) |
| `movimentacoes.csv` | `static/data/rh/movimentacoes.csv` | Fato movimentações (~120 registros) |
| `absenteismo.csv` | `static/data/rh/absenteismo.csv` | Fato absenteísmo (~200 registros) |
| `treinamentos.csv` | `static/data/rh/treinamentos.csv` | Fato treinamentos (~150 registros) |

### 3.2 Relacionamentos

```
movimentacoes[ColaboradorID]  → colaboradores[ID]  (Muitos-para-Um)
absenteismo[ColaboradorID]    → colaboradores[ID]  (Muitos-para-Um)
treinamentos[ColaboradorID]   → colaboradores[ID]  (Muitos-para-Um)
movimentacoes[Data]           → dCalendario[Date]  (Muitos-para-Um)
absenteismo[Data]             → dCalendario[Date]  (Muitos-para-Um)
treinamentos[Data]            → dCalendario[Date]  (Muitos-para-Um)
```

> Use a mesma tabela `dCalendario` criada no dashboard de Vendas (se estiver em arquivos separados, crie novamente).

### 3.3 Medidas DAX

```dax
-- Headcount Ativo
Headcount Ativo = 
CALCULATE(COUNTROWS(colaboradores), colaboradores[Status] = "Ativo")

-- Total de Colaboradores
Total Colaboradores = COUNTROWS(colaboradores)

-- Admissões no Período
Admissões = 
CALCULATE(COUNTROWS(movimentacoes), movimentacoes[Tipo] = "Admissão")

-- Demissões no Período
Demissões = 
CALCULATE(
    COUNTROWS(movimentacoes),
    movimentacoes[Tipo] IN {"Demissão Voluntária", "Demissão Involuntária"}
)

-- Taxa de Turnover (anualizada)
Taxa Turnover = 
VAR Demissoes = [Demissões]
VAR HeadcountMedio = ([Headcount Ativo] + [Total Colaboradores]) / 2
RETURN
DIVIDE(Demissoes, HeadcountMedio, 0)

-- Horas Perdidas por Absenteísmo
Total Horas Perdidas = SUM(absenteismo[HorasPerdidas])

-- Taxa de Absenteísmo (horas perdidas / horas totais esperadas)
Taxa Absenteísmo = 
VAR HorasTotaisEsperadas = [Headcount Ativo] * 220  -- 220h/mês aprox.
RETURN
DIVIDE([Total Horas Perdidas], HorasTotaisEsperadas, 0)

-- Investimento Total em T&D
Investimento T&D = SUM(treinamentos[Investimento])

-- Horas de Treinamento Per Capita
Horas Treinamento Per Capita = 
DIVIDE(SUM(treinamentos[Horas]), [Headcount Ativo], 0)

-- Salário Médio por Departamento
Salário Médio = AVERAGE(colaboradores[Salario])

-- Massa Salarial
Massa Salarial = SUMX(
    FILTER(colaboradores, colaboradores[Status] = "Ativo"),
    colaboradores[Salario]
)
```

### 3.4 Layout Sugerido

**Página 1 — Headcount & Distribuição:**
- 4 KPI Cards: Headcount Ativo | Admissões | Demissões | Taxa Turnover
- Gráfico de rosca (Headcount por Departamento)
- Barras horizontais (Headcount por Cargo)
- Treemap (distribuição salarial por departamento)

**Página 2 — Absenteísmo:**
- KPI Card: Taxa Absenteísmo | Total Horas Perdidas
- Heatmap de calendário (horas perdidas por mês/dia da semana)
- Barras (Motivos de Ausência)
- Linha de tendência mensal

**Página 3 — Treinamento & Desenvolvimento:**
- KPI Cards: Investimento T&D | Horas Per Capita
- Barras empilhadas (Treinamentos por Departamento)
- Linha de investimento ao longo do tempo
- Tabela de cursos mais realizados

**Filtros globais:** Departamento, Ano, Status do Colaborador

### 3.5 Paleta de Cores

Tons de roxo para combinar com o badge "Recursos Humanos":

| Elemento | Cor HEX |
|----------|---------|
| Cor principal | `#A855F7` (purple-500) |
| Cor secundária | `#7C3AED` (purple-700) |
| Destaque positivo | `#10B981` |
| Destaque negativo | `#EF4444` |
| Background | `#0F172A` |

---

## 4. Dashboard Financeiro

### 4.1 Arquivos CSV a importar

| Arquivo | Caminho | Descrição |
|---------|---------|-----------|
| `lancamentos.csv` | `static/data/financeiro/lancamentos.csv` | Tabela fato (~465 registros) |
| `categorias.csv` | `static/data/financeiro/categorias.csv` | Dimensão categorias (20) |
| `centros_custo.csv` | `static/data/financeiro/centros_custo.csv` | Dimensão centros de custo (8) |

### 4.2 Relacionamentos

```
lancamentos[Categoria]   → categorias[Nome]      (Muitos-para-Um)
lancamentos[CentroCusto] → centros_custo[Nome]   (Muitos-para-Um)
lancamentos[Data]        → dCalendario[Date]      (Muitos-para-Um)
```

### 4.3 Medidas DAX

```dax
-- Receita Total
Receita Total = 
CALCULATE(SUM(lancamentos[Valor]), lancamentos[Tipo] = "Receita")

-- Despesa Total
Despesa Total = 
CALCULATE(SUM(lancamentos[Valor]), lancamentos[Tipo] = "Despesa")

-- Lucro Líquido
Lucro Líquido = [Receita Total] - [Despesa Total]

-- Margem Líquida %
Margem Líquida % = DIVIDE([Lucro Líquido], [Receita Total], 0)

-- Margem Bruta % (Receita - Custos Variáveis e Fixos)
Margem Bruta % = 
VAR Custos = 
    CALCULATE(
        SUM(lancamentos[Valor]),
        lancamentos[Tipo] = "Despesa",
        RELATED(categorias[Grupo]) IN {"Custo Fixo", "Custo Variável"}
    )
RETURN
DIVIDE([Receita Total] - Custos, [Receita Total], 0)

-- Fluxo de Caixa Acumulado (YTD)
Fluxo Acumulado = 
CALCULATE(
    [Receita Total] - [Despesa Total],
    DATESYTD(dCalendario[Date])
)

-- Variação MoM de Despesas
Despesa MoM% = 
VAR DepAtual = [Despesa Total]
VAR DepAnterior = CALCULATE([Despesa Total], DATEADD(dCalendario[Date], -1, MONTH))
RETURN
DIVIDE(DepAtual - DepAnterior, DepAnterior, BLANK())

-- Receita por Centro de Custo
Receita por CC = 
CALCULATE([Receita Total], ALLEXCEPT(lancamentos, lancamentos[CentroCusto]))

-- EBITDA (simplificado — Lucro + Depreciação estimada)
EBITDA = [Lucro Líquido] * 1.08  -- simplificação sem depreciação real

-- Margem EBITDA %
Margem EBITDA % = DIVIDE([EBITDA], [Receita Total], 0)
```

### 4.4 Layout Sugerido

**Página 1 — DRE (Demonstração de Resultado):**
- Gráfico Waterfall: Receita Bruta → Custos → Despesas → Lucro Líquido
- 4 KPI Cards: Receita Total | Despesa Total | Lucro Líquido | Margem Líquida%
- Tabela DRE por categoria

**Página 2 — Fluxo de Caixa:**
- Gráfico de linha + área (Fluxo Acumulado ao longo do tempo)
- Barras agrupadas (Receitas × Despesas por mês)
- KPI Card de Saldo Atual

**Página 3 — Despesas:**
- Treemap (Despesas por Categoria/Grupo)
- Linha de tendência de despesas por mês
- Barras horizontais (Top centros de custo por despesa)
- Gauge de % despesa sobre receita

**Página 4 — Indicadores:**
- Gauges: Margem Bruta % | Margem EBITDA % | Margem Líquida %
- Linha de tendência de margens ao longo do tempo
- Comparativo Ano a Ano

**Filtros globais:** Ano, Mês, Centro de Custo, Grupo de Categoria

### 4.5 Paleta de Cores

Tons de verde para combinar com o badge "Financeiro":

| Elemento | Cor HEX |
|----------|---------|
| Cor principal | `#22C55E` (green-500) |
| Cor secundária | `#16A34A` (green-600) |
| Receita (positivo) | `#10B981` (emerald-500) |
| Despesa (negativo) | `#EF4444` (red-500) |
| Neutro/Investimento | `#F59E0B` (amber-500) |
| Background | `#0F172A` |

---

## 5. Publicar e Incorporar no Site

### 5.1 Publicar do Power BI Desktop para o Power BI Service

1. Com o relatório aberto no Power BI Desktop, clique em **Publicar** (menu "Página Inicial" → grupo "Compartilhar")
2. Faça login com sua conta Microsoft/Power BI se solicitado
3. Selecione o workspace de destino (use "Meu workspace" para testes)
4. Aguarde a publicação. Clique em **"Abrir no Power BI"** ao finalizar

### 5.2 Ativar Trial Power BI Pro (se necessário)

1. Acesse <https://app.powerbi.com>
2. Clique no seu **avatar** (canto superior direito)
3. Selecione **"Iniciar avaliação gratuita"**
4. Confirme a ativação do Power BI Pro (60 dias gratuitos)

> Com a conta Fabric Free, o trial Pro pode ser ativado diretamente nas configurações de conta.

### 5.3 Gerar o link "Publicar na Web"

1. No Power BI Service, abra o relatório publicado
2. Clique em **Arquivo** (menu superior)
3. Selecione **"Incorporar relatório"** → **"Publicar na Web (público)"**
4. Leia o aviso de segurança e clique em **"Criar código de inserção"**
5. Selecione o tamanho desejado (recomendado: `1280 x 720` ou maior)
6. Copie o código do **iframe** gerado

> ⚠️ **Segurança:** "Publicar na Web" torna o relatório **público e acessível por qualquer pessoa** com o link. Use apenas dados fictícios ou aprovados para divulgação pública. **Nunca** publique dados pessoais, financeiros reais ou sensíveis.

### 5.4 Copiar a URL do iframe

O código gerado terá este formato:

```html
<iframe title="Nome do Relatório"
    width="1140" height="541.25"
    src="https://app.powerbi.com/reportEmbed?reportId=XXXX&autoAuth=true&ctid=YYYY"
    frameborder="0" allowFullScreen="true">
</iframe>
```

Anote a **URL completa** do atributo `src`.

### 5.5 Editar `templates/dashboards.html`

Para cada dashboard, localize o bloco de comentário HTML com as instruções do iframe e substitua o bloco `<!-- Placeholder visual -->` pelo iframe real.

**Exemplo completo para o Dashboard de Vendas:**

```html
<!-- Container do Dashboard 1 -->
<div class="relative w-full rounded-2xl overflow-hidden border border-gray-700" style="aspect-ratio: 16/9;">
    <iframe
        title="Análise de Vendas"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=SEU_REPORT_ID&autoAuth=true&ctid=SEU_TENANT_ID"
        frameborder="0"
        allowFullScreen="true"
        style="border: none; display: block;">
    </iframe>
</div>
```

Repita substituindo `title` e `src` para os dashboards de RH e Financeiro.

---

## 6. Dicas de Design Profissional

### 6.1 Tema Escuro no Power BI

Para combinar com o design do site (fundo `#0F172A`):

1. No Power BI Desktop, vá em **Exibição → Temas → Personalizar tema atual**
2. Configure:
   - **Cor de fundo do relatório:** `#0F172A`
   - **Cor de fundo do visual:** `#1E293B`
   - **Cor do título do visual:** `#F1F5F9`
   - **Cor do texto:** `#94A3B8`
   - **Cor do primeiro dado (data color 1):** conforme paleta do dashboard

Ou use o tema JSON personalizado abaixo (salve como `.json` e importe em `Exibição → Temas → Procurar temas`):

```json
{
  "name": "Roberto Fausto Theme",
  "dataColors": ["#3B82F6","#A855F7","#22C55E","#F59E0B","#EF4444","#06B6D4"],
  "background": "#0F172A",
  "foreground": "#F1F5F9",
  "tableAccent": "#3B82F6",
  "visualStyles": {
    "*": {
      "*": {
        "background": [{"color": "#1E293B"}],
        "fontFamily": [{"value": "Segoe UI"}]
      }
    }
  }
}
```

### 6.2 Fontes

- **Principal:** Segoe UI (padrão do Power BI, boa legibilidade)
- **Alternativa:** Calibri
- **Títulos dos KPIs:** Bold, 28-36pt
- **Subtítulos:** Regular, 14-16pt
- **Rótulos de dados:** Regular, 10-12pt

### 6.3 Layout e Organização

- **Título** no canto superior esquerdo (altura ~5% do canvas)
- **KPIs/Cards** na linha superior (30% do canvas)
- **Visuais principais** no centro (50% do canvas)
- **Filtros (slicers)** no painel direito ou superior (discretos, sem bordas chamativas)
- **Rodapé** com data de atualização e fonte dos dados

### 6.4 Dimensões do Canvas

Para incorporação em `aspect-ratio: 16/9`:
- **Resolução recomendada:** 1280 × 720px ou 1920 × 1080px
- Em Power BI Desktop: `Exibição → Configurações de página → Tipo de página: Personalizado`
  - Largura: `1280`, Altura: `720`

### 6.5 Responsividade Mobile

1. Em Power BI Desktop, selecione **Exibição → Layout de telefone**
2. Arraste os visuais mais importantes para o layout mobile
3. Priorize: KPI Cards, 1 gráfico principal
4. O iframe do site será responsivo com `width="100%"`

---

*Guia criado para o site-currículo de Roberto Fausto — `github.com/Beto2024/robertofausto.com.br`*
