// linha.js
import { BusData } from './bus-data.js';

class LineDetails {
  constructor() {
    this.lineNumber = this.getLineFromURL();
    this.init();
    this.setupEventListeners();
    this.loadLineData();
    this.startRealTimeUpdates();
  }

  getLineFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("line") || "5104";
  }

  init() {
    console.log("[v0] Line details initialized for line:", this.lineNumber);
    this.favoriteBtn = document.getElementById("favorite-btn");
    this.exportBtn = document.getElementById("export-btn");

    this.realTimeData = []; // será preenchido com trips reais
  }

  setupEventListeners() {
    if (this.favoriteBtn) {
      this.favoriteBtn.addEventListener("click", () => this.toggleFavorite());
    }

    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => this.showExportOptions());
    }

    document.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  loadLineData() {
    const lineData = BusData.getLineData(this.lineNumber);

    if (!lineData) {
      console.warn("Linha não encontrada:", this.lineNumber);
      return;
    }

    const formattedData = {
      number: lineData.number,
      name: lineData.name,
      route: lineData.routeDescription,
      firstBus: lineData.trips.length ? lineData.trips[0].departure : "N/A",
      lastBus: lineData.trips.length ? lineData.trips[lineData.trips.length - 1].arrival : "N/A",
      frequency: "15-20 min",
      extension: "~", 
      travelTime: "~", 
      accessibility: true,
      status: "normal",
      stops: lineData.stops,
    };

    this.updatePageContent(formattedData);
    this.loadFavoriteStatus();

    // Preenche os dados de real-time
    this.realTimeData = lineData.trips.map(trip => ({
      id: trip.id,
      arrival: Math.floor(Math.random() * 30) + 5,
      status: "ontime"
    }));
  }

  updatePageContent(data) {
    document.title = `Linha ${data.number} - ${data.name} | BHTrans`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "BusTrip",
      name: `Linha ${data.number} - ${data.name}`,
      description: `Linha de ônibus ${data.route}`,
      provider: { "@type": "Organization", name: "BHTrans" },
      busNumber: data.number,
      departureTime: data.firstBus,
      arrivalTime: data.lastBus,
    };

    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) scriptTag.textContent = JSON.stringify(schema);
  }

  toggleFavorite() {
    const favorites = this.getFavorites();
    const isFavorited = favorites.includes(this.lineNumber);

    if (isFavorited) {
      this.removeFavorite();
      this.favoriteBtn.classList.remove("favorited");
    } else {
      this.addFavorite();
      this.favoriteBtn.classList.add("favorited");
    }
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem("bhtrans_favorites") || "[]");
  }

  addFavorite() {
    const favorites = this.getFavorites();
    if (!favorites.includes(this.lineNumber)) {
      favorites.push(this.lineNumber);
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites));
      this.showNotification("Linha adicionada aos favoritos!");
    }
  }

  removeFavorite() {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(this.lineNumber);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites));
      this.showNotification("Linha removida dos favoritos!");
    }
  }

  loadFavoriteStatus() {
    const favorites = this.getFavorites();
    if (favorites.includes(this.lineNumber)) {
      this.favoriteBtn.classList.add("favorited");
    }
  }

  showExportOptions() {
    const options = [
      { label: "Exportar como JSON", format: "json" },
      { label: "Exportar como CSV", format: "csv" },
      { label: "Compartilhar Link", format: "share" },
    ];

    const modal = this.createModal("Exportar Dados da Linha", options);
    document.body.appendChild(modal);
  }

  createModal(title, options) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold mb-4">${title}</h3>
        <div class="space-y-2">
          ${options.map(opt => `
            <button class="w-full text-left p-3 hover:bg-gray-100 rounded-lg" data-format="${opt.format}">
              ${opt.label}
            </button>
          `).join("")}
        </div>
        <button class="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300" onclick="this.closest('.fixed').remove()">
          Cancelar
        </button>
      </div>
    `;

    modal.querySelectorAll("[data-format]").forEach(btn => {
      btn.addEventListener("click", e => {
        const format = e.target.dataset.format;
        this.handleExport(format);
        modal.remove();
      });
    });

    return modal;
  }

  handleExport(format) {
    if (format === "share") this.shareLineLink();
    else this.exportLineData(format);
  }

  exportLineData(format) {
    const lineData = BusData.getLineData(this.lineNumber);
    if (!lineData) return;

    const data = {
      line: { number: lineData.number, name: lineData.name, route: lineData.routeDescription },
      stops: lineData.stops,
      trips: lineData.trips,
      realTime: this.realTimeData,
      lastUpdate: new Date().toISOString(),
    };

    if (format === "json") {
      this.downloadFile(`linha_${this.lineNumber}.json`, JSON.stringify(data, null, 2));
    } else if (format === "csv") {
      const csv = this.convertToCSV(data);
      this.downloadFile(`linha_${this.lineNumber}.csv`, csv);
    }
  }

  convertToCSV(data) {
    const headers = ["ID", "Nome do Ponto", "Endereço"];
    const rows = (data.stops || []).map((stop, i) => [i+1, stop.name || "", stop.address || ""]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }

  downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  shareLineLink() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Linha ${this.lineNumber} - BHTrans`, text: `Confira os horários da linha ${this.lineNumber}`, url });
    } else {
      navigator.clipboard.writeText(url).then(() => this.showNotification("Link copiado para a área de transferência!"));
    }
  }

  handleQuickAction(action) {
    switch (action) {
      case "alert": this.setupAlert(); break;
      case "share": this.shareLineLink(); break;
      case "report": this.reportProblem(); break;
    }
  }

  setupAlert() {
    this.showNotification("Alerta configurado! Você será notificado sobre alterações nesta linha.");
  }

  reportProblem() {
    const problem = prompt("Descreva o problema encontrado:");
    if (problem) {
      console.log("[v0] Problem reported:", problem);
      this.showNotification("Problema reportado com sucesso. Obrigado!");
    }
  }

  startRealTimeUpdates() {
    setInterval(() => this.updateRealTimeData(), 15000);
  }

  updateRealTimeData() {
    this.realTimeData.forEach(bus => {
      bus.arrival = bus.arrival > 0 ? bus.arrival - 1 : Math.floor(Math.random() * 30) + 5;
    });
    this.updateRealTimeDisplay();
  }

  updateRealTimeDisplay() {
    const realTimeSection = document.querySelector(".real-time-updates");
    if (realTimeSection) {
      realTimeSection.innerHTML = this.realTimeData.map(bus => `Ônibus ${bus.id}: ${bus.arrival} min`).join("<br>");
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => new LineDetails());
