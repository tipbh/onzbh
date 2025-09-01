/**
 * Script para a página de detalhes de uma linha de ônibus.
 * Carrega e exibe informações da linha com base no parâmetro da URL.
 */

// Importa o módulo de dados para buscar as informações da linha
import { BusData } from "./bus-data.js";

// Espera o carregamento do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
    loadLineInfo();
});

/**
 * Função principal para carregar e exibir as informações da linha.
 */
function loadLineInfo() {
    // Obtém o parâmetro 'line' da URL
    const params = new URLSearchParams(window.location.search);
    const lineNumber = params.get("line");

    // Verifica se o número da linha foi fornecido
    if (!lineNumber) {
        console.error("Número da linha não encontrado na URL.");
        // Mostra a mensagem de erro
        document.getElementById("line-not-found").style.display = "block";
        document.getElementById("line-info-container").style.display = "none";
        return;
    }

    // Busca os dados da linha
    const lineData = BusData.getLineData(lineNumber);

    if (lineData) {
        // Se a linha for encontrada, preenche os elementos do HTML
        document.title = `Linha ${lineData.shortName} - ${lineData.name} | BH Ônibus`;
        
        document.getElementById("line-number-display").textContent = lineData.shortName;
        document.getElementById("line-name-display").textContent = lineData.name;
        document.getElementById("line-operator-display").textContent = lineData.operator;

        // Exibe o container de informações e esconde a mensagem de não encontrado
        document.getElementById("line-info-container").style.display = "block";
        document.getElementById("line-not-found").style.display = "none";
        
        // Exibe os horários
        renderTrips(lineData.trips);
        
        // Exibe os pontos de parada
        renderStops(lineData.stops);
        
    } else {
        // Se a linha não for encontrada, mostra a mensagem de erro
        console.error(`Linha ${lineNumber} não encontrada.`);
        document.getElementById("line-not-found").style.display = "block";
        document.getElementById("line-info-container").style.display = "none";
    }
}

/**
 * Renderiza a lista de horários.
 */
function renderTrips(trips) {
    const schedulesContainer = document.getElementById("line-schedules");
    if (!schedulesContainer) return;
    
    const tripsHTML = trips.map(trip => `
        <div class="bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-400">Partida: ${trip.departure}</p>
            <p class="text-sm text-gray-400">Chegada: ${trip.arrival}</p>
        </div>
    `).join("");
    
    schedulesContainer.innerHTML = tripsHTML;
}

/**
 * Renderiza a lista de pontos de parada.
 * Nota: Como o GeoJSON original não contém dados de parada, esta função é um placeholder.
 */
function renderStops(stops) {
  // A lógica de renderização dos stops pode ser implementada aqui.
  // Por exemplo, criando uma lista de pontos.
  console.log("Pontos de parada:", stops);
}
