/**
 * Script principal para a página inicial do BH Ônibus
 * Gerencia busca, sugestões, navegação e funcionalidades gerais
 */

// Importar a biblioteca Lucide
import lucide from "lucide"

// Variáveis globais
let searchTimeout
const searchInput = document.getElementById("search-input")
const searchForm = document.getElementById("search-form")
const suggestionsContainer = document.getElementById("suggestions")
const mobileMenuBtn = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")
const popularLinesContainer = document.getElementById("popular-lines")

/**
 * Inicialização da página
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar ícones Lucide
  lucide.createIcons()

  // Configurar ano atual no footer
  updateCurrentYear()

  // Configurar última atualização
  updateLastUpdateTime()

  // Carregar linhas populares
  loadPopularLines()

  // Configurar event listeners
  setupEventListeners()

  console.log("BH Ônibus - Página inicial carregada com sucesso")
})

/**
 * Configurar todos os event listeners
 */
function setupEventListeners() {
  // Event listener para busca
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput)
    searchInput.addEventListener("focus", handleSearchFocus)
    searchInput.addEventListener("blur", handleSearchBlur)
  }

  // Event listener para formulário de busca
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearchSubmit)
  }

  // Event listener para menu mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu)
  }

  // Event listener para cliques fora do menu
  document.addEventListener("click", handleOutsideClick)

  // Event listener para teclas de navegação
  document.addEventListener("keydown", handleKeyNavigation)
}

/**
 * Manipular entrada de texto na busca
 */
function handleSearchInput(event) {
  const query = event.target.value.trim()

  // Limpar timeout anterior
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Definir novo timeout para evitar muitas buscas
  searchTimeout = setTimeout(() => {
    if (query.length > 0) {
      showSuggestions(query)
    } else {
      hideSuggestions()
    }
  }, 300)
}

/**
 * Manipular foco no campo de busca
 */
function handleSearchFocus(event) {
  const query = event.target.value.trim()
  if (query.length > 0) {
    showSuggestions(query)
  }
}

/**
 * Manipular perda de foco no campo de busca
 */
function handleSearchBlur(event) {
  // Delay para permitir clique nas sugestões
  setTimeout(() => {
    hideSuggestions()
  }, 200)
}

/**
 * Manipular envio do formulário de busca
 */
function handleSearchSubmit(event) {
  event.preventDefault()

  const query = searchInput.value.trim()
  if (!query) return

  // Buscar linha correspondente
  const results = window.BusData.searchLines(query)

  if (results.length > 0) {
    // Redirecionar para a primeira linha encontrada
    window.location.href = `linha.html?id=${results[0].id}`
  } else {
    // Mostrar mensagem de não encontrado
    showNotFoundMessage(query)
  }
}

/**
 * Mostrar sugestões de busca
 */
function showSuggestions(query) {
  const results = window.BusData.searchLines(query)

  if (results.length === 0) {
    hideSuggestions()
    return
  }

  // Limitar a 5 sugestões
  const limitedResults = results.slice(0, 5)

  // Gerar HTML das sugestões
  const suggestionsHTML = limitedResults
    .map(
      (line) => `
        <div class="suggestion-item" onclick="selectSuggestion('${line.id}')">
            <div class="flex items-center justify-between">
                <div>
                    <span class="font-semibold text-blue-400">${line.id}</span>
                    <span class="ml-2 text-gray-100">${line.name}</span>
                </div>
                <span class="text-sm text-gray-400">${line.frequency}</span>
            </div>
            <div class="text-sm text-gray-400 mt-1">${line.route}</div>
        </div>
    `,
    )
    .join("")

  suggestionsContainer.innerHTML = suggestionsHTML
  suggestionsContainer.classList.remove("hidden")
}

/**
 * Esconder sugestões de busca
 */
function hideSuggestions() {
  if (suggestionsContainer) {
    suggestionsContainer.classList.add("hidden")
  }
}

/**
 * Selecionar uma sugestão
 */
function selectSuggestion(lineId) {
  window.location.href = `linha.html?id=${lineId}`
}

/**
 * Mostrar mensagem de não encontrado
 */
function showNotFoundMessage(query) {
  // Implementar modal ou toast de não encontrado
  alert(`Nenhuma linha encontrada para "${query}". Tente buscar por número da linha, nome ou bairro.`)
}

/**
 * Toggle do menu mobile
 */
function toggleMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.toggle("hidden")

    // Atualizar ícone do botão
    const icon = mobileMenuBtn.querySelector("[data-lucide]")
    if (mobileMenu.classList.contains("hidden")) {
      icon.setAttribute("data-lucide", "menu")
    } else {
      icon.setAttribute("data-lucide", "x")
    }

    // Recriar ícones
    lucide.createIcons()
  }
}

/**
 * Manipular cliques fora do menu
 */
function handleOutsideClick(event) {
  // Fechar menu mobile se clicar fora
  if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
    if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      mobileMenu.classList.add("hidden")

      // Resetar ícone
      const icon = mobileMenuBtn.querySelector("[data-lucide]")
      icon.setAttribute("data-lucide", "menu")
      lucide.createIcons()
    }
  }

  // Fechar sugestões se clicar fora
  if (suggestionsContainer && !suggestionsContainer.classList.contains("hidden")) {
    if (!suggestionsContainer.contains(event.target) && !searchInput.contains(event.target)) {
      hideSuggestions()
    }
  }
}

/**
 * Manipular navegação por teclado
 */
function handleKeyNavigation(event) {
  // ESC para fechar sugestões e menu
  if (event.key === "Escape") {
    hideSuggestions()
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      toggleMobileMenu()
    }
  }
}

/**
 * Carregar linhas populares
 */
function loadPopularLines() {
  if (!popularLinesContainer) return

  const popularLines = window.BusData.getPopularLines(6)

  const linesHTML = popularLines
    .map(
      (line) => `
        <div class="line-card" onclick="window.location.href='linha.html?id=${line.id}'">
            <div class="flex items-center justify-between mb-2">
                <span class="text-2xl font-bold text-blue-400">${line.id}</span>
                <span class="text-sm text-gray-400">A cada ${line.frequency}</span>
            </div>
            <h4 class="font-semibold text-gray-100 mb-1">${line.name}</h4>
            <p class="text-sm text-gray-400">${line.route}</p>
            <div class="mt-2">
                <span class="text-xs px-2 py-1 rounded-full ${getOperatorBadgeClass(line.operator)}">${line.operator}</span>
            </div>
        </div>
    `,
    )
    .join("")

  popularLinesContainer.innerHTML = linesHTML
}

/**
 * Obter classe CSS para badge do operador
 */
function getOperatorBadgeClass(operator) {
  switch (operator) {
    case "BHTrans":
      return "bg-blue-500/20 text-blue-400"
    case "DER-MG":
      return "bg-green-500/20 text-green-400"
    default:
      return "bg-gray-500/20 text-gray-400"
  }
}

/**
 * Atualizar ano atual no footer
 */
function updateCurrentYear() {
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }
}

/**
 * Atualizar horário da última atualização
 */
function updateLastUpdateTime() {
  const lastUpdateElement = document.getElementById("last-update")
  if (lastUpdateElement) {
    const now = new Date()
    const dateStr = now.toLocaleDateString("pt-BR")
    const timeStr = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    lastUpdateElement.textContent = `${dateStr} às ${timeStr}`
  }
}

/**
 * Função utilitária para debounce
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Exportar funções para uso global se necessário
if (typeof window !== "undefined") {
  window.MainApp = {
    selectSuggestion,
    toggleMobileMenu,
    updateCurrentYear,
    updateLastUpdateTime,
  }
}
