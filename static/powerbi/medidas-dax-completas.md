# Medidas DAX Completas — Dashboards Power BI

> **Instruções:** No Power BI Desktop, crie cada medida individualmente:
> `Modelagem → Nova Medida` → cole a fórmula DAX.
> 
> **Importante:** Crie UMA medida por vez (cada bloco abaixo é uma medida separada).

---

## 📅 Tabela Calendário (criar como Nova Tabela, não como medida)

Vá em `Modelagem → Nova Tabela` e cole:

```dax
dCalendario = 
ADDCOLUMNS(
    CALENDAR(DATE(2023,1,1), DATE(2025,12,31)),
    "Ano", YEAR([Date]),
    "Mês", MONTH([Date]),
    "NomeMes", FORMAT([Date], "MMMM", "pt-BR"),
    "MesAbreviado", FORMAT([Date], "MMM", "pt-BR"),
    "Trimestre", "T" & QUARTER([Date]),
    "Semestre", IF(MONTH([Date]) <= 6, "S1", "S2"),
    "AnoMes", FORMAT([Date], "YYYY-MM"),
    "AnoTrimestre", YEAR([Date]) & "-" & "T" & QUARTER([Date]),
    "DiaSemana", WEEKDAY([Date], 2),
    "NomeDiaSemana", FORMAT([Date], "dddd", "pt-BR"),
    "Semana", WEEKNUM([Date], 2),
    "FimDeSemana", IF(WEEKDAY([Date], 2) >= 6, "Sim", "Não")
)
```

Marque esta tabela como **Tabela de Datas**: `Modelagem → Marcar como tabela de datas → Date`

---

## 📈 Dashboard Análise de Vendas

### Medida: Faturamento Total
```dax
Faturamento Total = 
SUMX(
    vendas,
    vendas[Quantidade] * vendas[ValorUnitario] * (1 - vendas[Desconto])
)
```

### Medida: Qtd Vendas
```dax
Qtd Vendas = COUNT(vendas[ID])
```

### Medida: Ticket Médio
```dax
Ticket Médio = DIVIDE([Faturamento Total], [Qtd Vendas], 0)
```

### Medida: Meta
```dax
Meta = [Faturamento Total] * 1.1
```

### Medida: % Meta
```dax
% Meta = DIVIDE([Faturamento Total], [Meta], 0)
```

### Medida: Faturamento MoM%
```dax
Faturamento MoM% = 
VAR FatAtual = [Faturamento Total]
VAR FatAnterior = CALCULATE([Faturamento Total], DATEADD(dCalendario[Date], -1, MONTH))
RETURN
DIVIDE(FatAtual - FatAnterior, FatAnterior, BLANK())
```

### Medida: Faturamento YTD
```dax
Faturamento YTD = TOTALYTD([Faturamento Total], dCalendario[Date])
```

### Medida: Margem Bruta
```dax
Margem Bruta = 
DIVIDE(
    SUMX(vendas, vendas[Quantidade] * (vendas[ValorUnitario] * (1 - vendas[Desconto]) - RELATED(produtos[Custo]))),
    [Faturamento Total],
    0
)
```

### Medida: Faturamento Ano Anterior
```dax
Faturamento Ano Anterior = 
CALCULATE([Faturamento Total], SAMEPERIODLASTYEAR(dCalendario[Date]))
```

### Medida: Faturamento YoY%
```dax
Faturamento YoY% = 
VAR FatAtual = [Faturamento Total]
VAR FatAnoAnterior = [Faturamento Ano Anterior]
RETURN
DIVIDE(FatAtual - FatAnoAnterior, FatAnoAnterior, BLANK())
```

### Medida: Ranking Produtos
```dax
Ranking Produtos = 
RANKX(
    ALL(produtos[Nome]),
    [Faturamento Total],
    ,
    DESC,
    Dense
)
```

---

## 👥 Dashboard Indicadores de RH

### Medida: Headcount Ativo
```dax
Headcount Ativo = 
CALCULATE(COUNTROWS(colaboradores), colaboradores[Status] = "Ativo")
```

### Medida: Total Colaboradores
```dax
Total Colaboradores = COUNTROWS(colaboradores)
```

### Medida: Admissões
```dax
Admissões = 
CALCULATE(COUNTROWS(movimentacoes), movimentacoes[Tipo] = "Admissão")
```

### Medida: Demissões
```dax
Demissões = 
CALCULATE(
    COUNTROWS(movimentacoes),
    movimentacoes[Tipo] IN {"Demissão Voluntária", "Demissão Involuntária"}
)
```

### Medida: Taxa Turnover
```dax
Taxa Turnover = 
VAR Demissoes = [Demissões]
VAR HeadcountMedio = ([Headcount Ativo] + [Total Colaboradores]) / 2
RETURN
DIVIDE(Demissoes, HeadcountMedio, 0)
```

### Medida: Total Horas Perdidas
```dax
Total Horas Perdidas = SUM(absenteismo[HorasPerdidas])
```

### Medida: Taxa Absenteísmo
```dax
Taxa Absenteísmo = 
VAR HorasTotaisEsperadas = [Headcount Ativo] * 220
RETURN
DIVIDE([Total Horas Perdidas], HorasTotaisEsperadas, 0)
```

### Medida: Investimento T&D
```dax
Investimento T&D = SUM(treinamentos[Investimento])
```

### Medida: Horas Treinamento Per Capita
```dax
Horas Treinamento Per Capita = 
DIVIDE(SUM(treinamentos[Horas]), [Headcount Ativo], 0)
```

### Medida: Salário Médio
```dax
Salário Médio = AVERAGE(colaboradores[Salario])
```

### Medida: Massa Salarial
```dax
Massa Salarial = SUMX(
    FILTER(colaboradores, colaboradores[Status] = "Ativo"),
    colaboradores[Salario]
)
```

### Medida: % Demissão Voluntária
```dax
% Demissão Voluntária = 
VAR DemVol = CALCULATE(COUNTROWS(movimentacoes), movimentacoes[Tipo] = "Demissão Voluntária")
VAR DemTotal = [Demissões]
RETURN
DIVIDE(DemVol, DemTotal, 0)
```

---

## 💰 Dashboard Financeiro

### Medida: Receita Total
```dax
Receita Total = 
CALCULATE(SUM(lancamentos[Valor]), lancamentos[Tipo] = "Receita")
```

### Medida: Despesa Total
```dax
Despesa Total = 
CALCULATE(SUM(lancamentos[Valor]), lancamentos[Tipo] = "Despesa")
```

### Medida: Lucro Líquido
```dax
Lucro Líquido = [Receita Total] - [Despesa Total]
```

### Medida: Margem Líquida %
```dax
Margem Líquida % = DIVIDE([Lucro Líquido], [Receita Total], 0)
```

### Medida: Margem Bruta %
```dax
Margem Bruta % = 
VAR Custos = 
    CALCULATE(
        SUM(lancamentos[Valor]),
        lancamentos[Tipo] = "Despesa",
        RELATED(categorias[Grupo]) IN {"Custo Fixo", "Custo Variável"}
    )
RETURN
DIVIDE([Receita Total] - Custos, [Receita Total], 0)
```

### Medida: Fluxo Acumulado
```dax
Fluxo Acumulado = 
CALCULATE(
    [Receita Total] - [Despesa Total],
    DATESYTD(dCalendario[Date])
)
```

### Medida: Despesa MoM%
```dax
Despesa MoM% = 
VAR DepAtual = [Despesa Total]
VAR DepAnterior = CALCULATE([Despesa Total], DATEADD(dCalendario[Date], -1, MONTH))
RETURN
DIVIDE(DepAtual - DepAnterior, DepAnterior, BLANK())
```

### Medida: Receita por CC
```dax
Receita por CC = 
CALCULATE([Receita Total], ALLEXCEPT(lancamentos, lancamentos[CentroCusto]))
```

### Medida: EBITDA
```dax
EBITDA = [Lucro Líquido] * 1.08
```

### Medida: Margem EBITDA %
```dax
Margem EBITDA % = DIVIDE([EBITDA], [Receita Total], 0)
```

### Medida: % Despesa sobre Receita
```dax
% Despesa sobre Receita = DIVIDE([Despesa Total], [Receita Total], 0)
```

### Medida: Receita YTD
```dax
Receita YTD = TOTALYTD([Receita Total], dCalendario[Date])
```

### Medida: Despesa YTD
```dax
Despesa YTD = TOTALYTD([Despesa Total], dCalendario[Date])
```

---

## 📝 Dicas de Implementação

1. **Organize suas medidas** em pastas de exibição:
   - Clique com botão direito na medida → `Pasta de exibição`
   - Use nomes como: `_Vendas`, `_RH`, `_Financeiro`, `_Calendário`

2. **Formate suas medidas**:
   - Medidas monetárias: `Formato → Moeda → R$ Português (Brasil)`
   - Porcentagens: `Formato → Porcentagem → 1 casa decimal`
   - Inteiros: `Formato → Número inteiro`

3. **Teste cada medida** arrastando-a para um visual de Cartão (Card) antes de montar o layout final.

---

*Arquivo criado para o site-currículo de Roberto Fausto — github.com/Beto2024/robertofausto.com.br*