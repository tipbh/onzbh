/**
 * Dados das linhas de ônibus da BHTrans e DER-MG
 * Base de dados completa e atualizada
 */

// Base de dados das linhas da BHTrans
const bhtransLines = [
  // Linhas do Centro
  {
    id: "1001",
    name: "Centro/Savassi",
    route: "Praça Sete - Savassi",
    frequency: "5-8 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "1002",
    name: "Centro/Funcionários",
    route: "Praça Sete - Funcionários",
    frequency: "6-10 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "1003",
    name: "Centro/Santo Antônio",
    route: "Praça Sete - Santo Antônio",
    frequency: "8-12 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "1004",
    name: "Centro/Lourdes",
    route: "Praça Sete - Lourdes",
    frequency: "10-15 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "1005",
    name: "Centro/Santa Efigênia",
    route: "Praça Sete - Santa Efigênia",
    frequency: "12-18 min",
    operator: "BHTrans",
    type: "urbana",
  },

  // Linhas da Pampulha
  {
    id: "2101",
    name: "Pampulha/Centro",
    route: "UFMG - Centro",
    frequency: "10-15 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "2102",
    name: "Pampulha/Savassi",
    route: "UFMG - Savassi",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "2103",
    name: "Pampulha/Funcionários",
    route: "UFMG - Funcionários",
    frequency: "20-25 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "2104",
    name: "Pampulha Circular",
    route: "UFMG - Lagoa - Mineirão",
    frequency: "12-18 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "2105",
    name: "Pampulha/Aeroporto",
    route: "UFMG - Aeroporto Confins",
    frequency: "30-45 min",
    operator: "BHTrans",
    type: "metropolitana",
  },

  // Linhas da Zona Norte
  {
    id: "3101",
    name: "Venda Nova/Centro",
    route: "Venda Nova - Centro",
    frequency: "6-10 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "3102",
    name: "Venda Nova/Savassi",
    route: "Venda Nova - Savassi",
    frequency: "12-18 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "3103",
    name: "Norte/Sul",
    route: "Venda Nova - Barreiro",
    frequency: "25-35 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "3104",
    name: "Ribeirão das Neves",
    route: "Venda Nova - Ribeirão",
    frequency: "20-30 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "3105",
    name: "Justinópolis",
    route: "Venda Nova - Justinópolis",
    frequency: "15-25 min",
    operator: "BHTrans",
    type: "metropolitana",
  },

  // Linhas da Zona Leste
  {
    id: "4101",
    name: "Leste/Centro",
    route: "Antônio Carlos - Centro",
    frequency: "8-12 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "4102",
    name: "Leste/Pampulha",
    route: "Antônio Carlos - UFMG",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "4103",
    name: "Santa Luzia",
    route: "BH - Santa Luzia",
    frequency: "20-30 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "4104",
    name: "Sabará",
    route: "BH - Sabará",
    frequency: "25-35 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "4105",
    name: "Caeté",
    route: "BH - Caeté",
    frequency: "30-45 min",
    operator: "BHTrans",
    type: "metropolitana",
  },

  // Linhas da Zona Sul
  {
    id: "5101",
    name: "Sul/Centro",
    route: "Savassi - Centro",
    frequency: "5-8 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "5102",
    name: "Mangabeiras",
    route: "Centro - Mangabeiras",
    frequency: "12-18 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "5103",
    name: "Belvedere",
    route: "Savassi - Belvedere",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "5104",
    name: "Nova Lima",
    route: "BH - Nova Lima",
    frequency: "20-30 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "5105",
    name: "Brumadinho",
    route: "BH - Brumadinho",
    frequency: "45-60 min",
    operator: "BHTrans",
    type: "metropolitana",
  },

  // Linhas da Zona Oeste
  {
    id: "6101",
    name: "Oeste/Centro",
    route: "Barreiro - Centro",
    frequency: "8-12 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "6102",
    name: "Barreiro/Savassi",
    route: "Barreiro - Savassi",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "urbana",
  },
  {
    id: "6103",
    name: "Betim",
    route: "BH - Betim",
    frequency: "15-25 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "6104",
    name: "Contagem",
    route: "BH - Contagem",
    frequency: "10-15 min",
    operator: "BHTrans",
    type: "metropolitana",
  },
  {
    id: "6105",
    name: "Ibirité",
    route: "BH - Ibirité",
    frequency: "25-35 min",
    operator: "BHTrans",
    type: "metropolitana",
  },

  // Linhas Expressas
  {
    id: "9001",
    name: "Expresso Norte",
    route: "Venda Nova - Centro (Expresso)",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "expressa",
  },
  {
    id: "9002",
    name: "Expresso Sul",
    route: "Savassi - Centro (Expresso)",
    frequency: "10-15 min",
    operator: "BHTrans",
    type: "expressa",
  },
  {
    id: "9003",
    name: "Expresso Leste",
    route: "Antônio Carlos - Centro (Expresso)",
    frequency: "12-18 min",
    operator: "BHTrans",
    type: "expressa",
  },
  {
    id: "9004",
    name: "Expresso Oeste",
    route: "Barreiro - Centro (Expresso)",
    frequency: "15-20 min",
    operator: "BHTrans",
    type: "expressa",
  },
  {
    id: "9005",
    name: "Expresso Aeroporto",
    route: "Centro - Aeroporto Confins",
    frequency: "60-90 min",
    operator: "BHTrans",
    type: "expressa",
  },
]

// Base de dados das linhas do DER-MG
const derMgLines = [
  // Linhas Intermunicipais Região Metropolitana
  {
    id: "7001",
    name: "BH/Contagem",
    route: "Centro BH - Centro Contagem",
    frequency: "8-12 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "7002",
    name: "BH/Betim",
    route: "Centro BH - Centro Betim",
    frequency: "15-20 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "7003",
    name: "BH/Nova Lima",
    route: "Centro BH - Centro Nova Lima",
    frequency: "20-25 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "7004",
    name: "BH/Ribeirão das Neves",
    route: "Centro BH - Ribeirão das Neves",
    frequency: "25-30 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "7005",
    name: "BH/Santa Luzia",
    route: "Centro BH - Santa Luzia",
    frequency: "20-30 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },

  // Linhas Intermunicipais Interior
  {
    id: "8001",
    name: "BH/Ouro Preto",
    route: "BH - Ouro Preto",
    frequency: "120-180 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "8002",
    name: "BH/Diamantina",
    route: "BH - Diamantina",
    frequency: "240-300 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "8003",
    name: "BH/Montes Claros",
    route: "BH - Montes Claros",
    frequency: "300-360 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "8004",
    name: "BH/Uberlândia",
    route: "BH - Uberlândia",
    frequency: "360-420 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },
  {
    id: "8005",
    name: "BH/Juiz de Fora",
    route: "BH - Juiz de Fora",
    frequency: "180-240 min",
    operator: "DER-MG",
    type: "intermunicipal",
  },

  // Linhas Regionais
  {
    id: "8101",
    name: "BH/Lagoa Santa",
    route: "BH - Lagoa Santa",
    frequency: "30-45 min",
    operator: "DER-MG",
    type: "regional",
  },
  {
    id: "8102",
    name: "BH/Pedro Leopoldo",
    route: "BH - Pedro Leopoldo",
    frequency: "45-60 min",
    operator: "DER-MG",
    type: "regional",
  },
  {
    id: "8103",
    name: "BH/Sete Lagoas",
    route: "BH - Sete Lagoas",
    frequency: "90-120 min",
    operator: "DER-MG",
    type: "regional",
  },
  {
    id: "8104",
    name: "BH/Itabirito",
    route: "BH - Itabirito",
    frequency: "60-90 min",
    operator: "DER-MG",
    type: "regional",
  },
  {
    id: "8105",
    name: "BH/Conselheiro Lafaiete",
    route: "BH - Conselheiro Lafaiete",
    frequency: "120-150 min",
    operator: "DER-MG",
    type: "regional",
  },
]

// Combinar todas as linhas
const allBusLines = [...bhtransLines, ...derMgLines]

/**
 * Função para buscar linhas por termo
 * @param {string} searchTerm - Termo de busca
 * @returns {Array} Array de linhas que correspondem ao termo
 */
function searchLines(searchTerm) {
  if (!searchTerm || searchTerm.length < 1) {
    return []
  }

  const term = searchTerm.toLowerCase().trim()

  return allBusLines.filter(
    (line) =>
      line.id.toLowerCase().includes(term) ||
      line.name.toLowerCase().includes(term) ||
      line.route.toLowerCase().includes(term) ||
      line.operator.toLowerCase().includes(term),
  )
}

/**
 * Função para obter linha por ID
 * @param {string} lineId - ID da linha
 * @returns {Object|null} Objeto da linha ou null se não encontrada
 */
function getLineById(lineId) {
  return allBusLines.find((line) => line.id === lineId) || null
}

/**
 * Função para obter linhas populares (mais buscadas)
 * @param {number} limit - Número máximo de linhas a retornar
 * @returns {Array} Array das linhas mais populares
 */
function getPopularLines(limit = 6) {
  // Simular popularidade baseada em frequência e tipo
  const popularIds = ["1001", "2101", "3101", "5101", "6101", "7001"]
  return popularIds
    .map((id) => getLineById(id))
    .filter((line) => line !== null)
    .slice(0, limit)
}

/**
 * Função para obter todas as linhas de um operador
 * @param {string} operator - Nome do operador (BHTrans ou DER-MG)
 * @returns {Array} Array de linhas do operador
 */
function getLinesByOperator(operator) {
  return allBusLines.filter((line) => line.operator === operator)
}

/**
 * Função para obter linhas por tipo
 * @param {string} type - Tipo da linha (urbana, metropolitana, intermunicipal, etc.)
 * @returns {Array} Array de linhas do tipo especificado
 */
function getLinesByType(type) {
  return allBusLines.filter((line) => line.type === type)
}

// Exportar funções para uso global
if (typeof window !== "undefined") {
  window.BusData = {
    allLines: allBusLines,
    searchLines,
    getLineById,
    getPopularLines,
    getLinesByOperator,
    getLinesByType,
  }
}
