/**
 * Script para a página de detalhes de uma linha de ônibus.
 * Carrega e exibe informações da linha com base no parâmetro da URL.
 */

import { BusData } from "./bus-data.js";

document.addEventListener("DOMContentLoaded", () => {
    loadLineInfo();
});

function loadLineInfo() {
    // Obter o número da linha da URL
    const params = new URLSearchParams(window.location.search);
    const lineNumber = params.get("line");

    if (!lineNumber) {
        // Redirecionar para a página inicial se não houver número da linha
        console.error("Número da linha não encontrado na URL.");
        document.getElementById("line-not-found").style.display = "block";
        document.getElementById("line-info-container").style.display = "none";
        return;
    }

    const lineData = BusData.getLineData(lineNumber);

    if (lineData) {
        // Atualizar o título da página
        document.title = `Linha ${lineData.shortName} - ${lineData.name} | BH Ônibus`;
        
        // Preencher informações na página
        document.getElementById("line-number-display").textContent = lineData.shortName;
        document.getElementById("line-name-display").textContent = lineData.name;
        document.getElementById("line-operator-display").textContent = lineData.operator;

        // Exibir o container de informações e esconder a mensagem de não encontrado
        document.getElementById("line-info-container").style.display = "block";
        document.getElementById("line-not-found").style.display = "none";

        // Exibir o mapa, horários e outros detalhes
        // Nota: A lógica para carregar o mapa e horários não está implementada aqui,
        // mas você pode usar 'lineData.stops' e 'lineData.trips' para isso.

    } else {
        // Exibir mensagem de linha não encontrada
        console.error(`Linha ${lineNumber} não encontrada.`);
        document.getElementById("line-not-found").style.display = "block";
        document.getElementById("line-info-container").style.display = "none";
    }
}
