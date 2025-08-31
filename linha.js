// Line details page JavaScript
class LineDetails {
  constructor() {
    this.lineNumber = this.getLineFromURL()
    this.init()
    this.setupEventListeners()
    this.loadLineData()
    this.startRealTimeUpdates()
  }

  getLineFromURL() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("line") || "5104"
  }

  init() {
    console.log("[v0] Line details initialized for line:", this.lineNumber)
    this.favoriteBtn = document.getElementById("favorite-btn")
    this.exportBtn = document.getElementById("export-btn")

    // Sample real-time data
    this.realTimeData = [
      { id: "4521", arrival: 8, status: "approaching" },
      { id: "4522", arrival: 23, status: "ontime" },
      { id: "4523", arrival: 38, status: "delayed" },
    ]
  }

  setupEventListeners() {
    // Favorite button
    if (this.favoriteBtn) {
      this.favoriteBtn.addEventListener("click", () => {
        this.toggleFavorite()
      })
    }

    // Export button
    if (this.exportBtn) {
      this.exportBtn.addEventListener("click", () => {
        this.showExportOptions()
      })
    }

    // Quick action buttons
    document.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.target.dataset.action
        this.handleQuickAction(action)
      })
    })
  }

  loadLineData() {
    // Simulate loading line data
    const lineData = {
      number: this.lineNumber,
      name: "Centro / Barreiro",
      route: "Via Av. Amazonas",
      firstBus: "05:30",
      lastBus: "23:45",
      frequency: "15-20 min",
      extension: "28,5 km",
      travelTime: "~65 min",
      accessibility: true,
      status: "normal",
    }

    this.updatePageContent(lineData)
    this.loadFavoriteStatus()
  }

  updatePageContent(data) {
    // Update page title and meta
    document.title = `Linha ${data.number} - ${data.name} | BHTrans`

    // Update JSON-LD schema
    const schema = {
      "@context": "https://schema.org",
      "@type": "BusTrip",
      name: `Linha ${data.number} - ${data.name}`,
      description: `Linha de ônibus ${data.route}`,
      provider: {
        "@type": "Organization",
        name: "BHTrans",
      },
      busNumber: data.number,
      departureTime: data.firstBus,
      arrivalTime: data.lastBus,
    }

    const scriptTag = document.querySelector('script[type="application/ld+json"]')
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(schema)
    }
  }

  toggleFavorite() {
    const favorites = this.getFavorites()
    const isFavorited = favorites.includes(this.lineNumber)

    if (isFavorited) {
      this.removeFavorite()
      this.favoriteBtn.classList.remove("favorited")
    } else {
      this.addFavorite()
      this.favoriteBtn.classList.add("favorited")
    }
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem("bhtrans_favorites") || "[]")
  }

  addFavorite() {
    const favorites = this.getFavorites()
    if (!favorites.includes(this.lineNumber)) {
      favorites.push(this.lineNumber)
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites))
      this.showNotification("Linha adicionada aos favoritos!")
    }
  }

  removeFavorite() {
    const favorites = this.getFavorites()
    const index = favorites.indexOf(this.lineNumber)
    if (index > -1) {
      favorites.splice(index, 1)
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites))
      this.showNotification("Linha removida dos favoritos!")
    }
  }

  loadFavoriteStatus() {
    const favorites = this.getFavorites()
    if (favorites.includes(this.lineNumber)) {
      this.favoriteBtn.classList.add("favorited")
    }
  }

  showExportOptions() {
    const options = [
      { label: "Exportar como JSON", format: "json" },
      { label: "Exportar como CSV", format: "csv" },
      { label: "Compartilhar Link", format: "share" },
    ]

    // Create modal or dropdown for export options
    const modal = this.createModal("Exportar Dados da Linha", options)
    document.body.appendChild(modal)
  }

  createModal(title, options) {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"

    modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 class="text-lg font-bold mb-4">${title}</h3>
                <div class="space-y-2">
                    ${options
                      .map(
                        (option) => `
                        <button class="w-full text-left p-3 hover:bg-gray-100 rounded-lg" 
                                data-format="${option.format}">
                            ${option.label}
                        </button>
                    `,
                      )
                      .join("")}
                </div>
                <button class="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300" 
                        onclick="this.closest('.fixed').remove()">
                    Cancelar
                </button>
            </div>
        `

    // Add event listeners to options
    modal.querySelectorAll("[data-format]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const format = e.target.dataset.format
        this.handleExport(format)
        modal.remove()
      })
    })

    return modal
  }

  handleExport(format) {
    console.log("[v0] Exporting line data in format:", format)

    if (format === "share") {
      this.shareLineLink()
    } else {
      this.exportLineData(format)
    }
  }

  exportLineData(format) {
    const data = {
      line: {
        number: this.lineNumber,
        name: "Centro / Barreiro",
        route: "Via Av. Amazonas",
      },
      schedule: {
        firstBus: "05:30",
        lastBus: "23:45",
        frequency: "15-20 min",
      },
      stops: [
        { id: 1, name: "Terminal Centro", address: "Av. Afonso Pena, 1212" },
        { id: 2, name: "Praça Sete", address: "Av. Amazonas, 89" },
        { id: 3, name: "Rodoviária", address: "Praça Rio Branco, s/n" },
      ],
      realTime: this.realTimeData,
      lastUpdate: new Date().toISOString(),
    }

    if (format === "json") {
      this.downloadFile(`linha_${this.lineNumber}.json`, JSON.stringify(data, null, 2))
    } else if (format === "csv") {
      const csv = this.convertToCSV(data)
      this.downloadFile(`linha_${this.lineNumber}.csv`, csv)
    }
  }

  convertToCSV(data) {
    const headers = ["Ponto", "Nome", "Endereço"]
    const rows = data.stops.map((stop) => [stop.id, stop.name, stop.address])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  shareLineLink() {
    const url = window.location.href

    if (navigator.share) {
      navigator.share({
        title: `Linha ${this.lineNumber} - BHTrans`,
        text: `Confira os horários da linha ${this.lineNumber}`,
        url: url,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        this.showNotification("Link copiado para a área de transferência!")
      })
    }
  }

  handleQuickAction(action) {
    console.log("[v0] Quick action:", action)

    switch (action) {
      case "alert":
        this.setupAlert()
        break
      case "share":
        this.shareLineLink()
        break
      case "report":
        this.reportProblem()
        break
    }
  }

  setupAlert() {
    this.showNotification("Alerta configurado! Você será notificado sobre alterações nesta linha.")
  }

  reportProblem() {
    const problem = prompt("Descreva o problema encontrado:")
    if (problem) {
      console.log("[v0] Problem reported:", problem)
      this.showNotification("Problema reportado com sucesso. Obrigado!")
    }
  }

  startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateRealTimeData()
    }, 15000) // Update every 15 seconds
  }

  updateRealTimeData() {
    // Simulate bus movement
    this.realTimeData.forEach((bus) => {
      if (bus.arrival > 0) {
        bus.arrival -= 1
      } else {
        bus.arrival = Math.floor(Math.random() * 30) + 10
      }
    })

    this.updateRealTimeDisplay()
  }

  updateRealTimeDisplay() {
    // Update the real-time section in the UI
    const realTimeSection = document.querySelector(".real-time-updates")
    if (realTimeSection) {
      // Update display with new data
      console.log("[v0] Real-time data updated")
    }
  }

  showNotification(message) {
    // Create and show notification
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

// Initialize line details page
document.addEventListener("DOMContentLoaded", () => {
  new LineDetails()
})
