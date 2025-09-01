/**
 * Script principal para a página inicial do BH Ônibus
 * Gerencia busca, sugestões, navegação e funcionalidades gerais
 */

// Importa a biblioteca Lucide e o módulo de dados das linhas
import lucide from "lucide";
import { BusData } from "./bus-data.js";

// Variáveis globais
let searchTimeout;
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
// ID corrigido para 'suggestions-container' para coincidir com o HTML
const suggestionsContainer = document.getElementById("suggestions-container");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const popularLinesContainer = document.getElementById("popular-lines");

/**
 * Inicialização da página
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar ícones Lucide
  lucide.createIcons();

  // Configurar ano atual no footer
  updateCurrentYear();

  // Configurar última atualização
  updateLastUpdateTime();

  // Carregar linhas populares
  loadPopularLines();

  // Configurar event listeners
  setupEventListeners();

  console.log("BH Ônibus - Página inicial carregada com sucesso");
});

/**
 * Configurar todos os event listeners
 */
function setupEventListeners() {
  // Event listener para busca com debounce para evitar múltiplas chamadas rápidas
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearchInput, 300));
    searchInput.addEventListener("focus", handleSearchFocus);
    searchInput.addEventListener("blur", handleSearchBlur);
  }

  // Event listener para o formulário de busca
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearchSubmit);
  }

  // Event listener para cliques nas sugestões
  if (suggestionsContainer) {
    suggestionsContainer.addEventListener("click", handleSuggestionClick);
  }

  // Event listener para menu mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }
}

/**
 * Lidar com a entrada do usuário no campo de busca
 */
function handleSearchInput(event) {
  const query = event.target.value.trim();
  if (query.length > 0) {
    const results = BusData.searchLines(query);
    renderSuggestions(results);
    suggestionsContainer.style.display = "block";
  } else {
    // Esconde as sugestões se o campo estiver vazio
    suggestionsContainer.style.display = "none";
  }
}

/**
 * Lidar com o foco no campo de busca
 */
function handleSearchFocus() {
  if (searchInput.value.trim().length > 0) {
    suggestionsContainer.style.display = "block";
  }
}

/**
 * Lidar com a perda de foco no campo de busca
 */
function handleSearchBlur() {
  // Timeout para permitir o clique em uma sugestão antes de esconder
  setTimeout(() => {
    suggestionsContainer.style.display = "none";
  }, 200);
}

/**
 * Lidar com o envio do formulário de busca
 */
function handleSearchSubmit(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query.length > 0) {
    // Redireciona para a página da linha com o número na URL
    window.location.href = `linha.html?line=${encodeURIComponent(query)}`;
  }
}

/**
 * Lidar com o clique em uma sugestão
 */
function handleSuggestionClick(event) {
  const suggestionItem = event.target.closest(".suggestion-item");
  if (suggestionItem) {
    const lineNumber = suggestionItem.dataset.lineNumber;
    // Redireciona para a página da linha
    window.location.href = `linha.html?line=${encodeURIComponent(lineNumber)}`;
  }
}

/**
 * Renderizar as sugestões de busca
 */
function renderSuggestions(lines) {
  if (!suggestionsContainer) return;
  
  const suggestionsHTML = lines.map(line => `
    <li class="suggestion-item p-3 border-b border-gray-800 hover:bg-white/5 cursor-pointer" data-line-number="${line.shortName}">
      <span class="font-bold">${line.shortName}</span> - ${line.longName}
    </li>
  `).join("");
  
  suggestionsContainer.innerHTML = `
    <ul class="divide-y divide-gray-600/50">
      ${suggestionsHTML}
    </ul>
  `;
}

/**
 * Carregar e renderizar as linhas populares
 */
function loadPopularLines() {
  if (!popularLinesContainer) return;

  const popularLines = BusData.getPopularLines();
  const linesHTML = popularLines
    .map(
      (line) => `
    <a href="linha.html?line=${encodeURIComponent(line.shortName)}" class="flex items-center space-x-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div class="flex-shrink-0">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
          ${line.shortName}
        </span>
      </div>
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold truncate">${line.name}</h4>
        <p class="text-xs text-gray-400 truncate">${line.operator}</p>
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-gray-500"><path d="m9 18 6-6-6-6"/></svg>
      </div>
    </a>
  `
    )
    .join("");

  popularLinesContainer.innerHTML = linesHTML;
}

/**
 * Obter classe CSS para badge do operador
 */
function getOperatorBadgeClass(operator) {
  switch (operator) {
    case "BHTrans":
      return "bg-blue-500/20 text-blue-400";
    case "DER-MG":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

/**
 * Atualizar ano atual no footer
 */
function updateCurrentYear() {
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Atualizar horário da última atualização
 */
function updateLastUpdateTime() {
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR");
    const timeStr = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    lastUpdateElement.textContent = `${dateStr} às ${timeStr}`;
  }
}

/**
 * Função utilitária para debounce
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
