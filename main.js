// Main JavaScript for BHTrans website
class BHTrans {
  constructor() {
    this.init()
    this.setupEventListeners()
    this.loadFavorites()
    this.updateStats()
  }

  init() {
    console.log("[v0] BHTrans system initialized")
    this.searchInput = document.getElementById("search-input")
    this.searchSuggestions = document.getElementById("search-suggestions")
    this.mobileMenuBtn = document.getElementById("mobile-menu-btn")
    this.mobileMenu = document.getElementById("mobile-menu")

    // Sample bus lines data
    this.busLines = [
      { number: "5104", name: "Centro / Barreiro", route: "Via Av. Amazonas" },
      { number: "9101", name: "Savassi / Pampulha", route: "Via Av. Antônio Carlos" },
      { number: "2202", name: "BH Shopping / Centro", route: "Via Av. Raja Gabaglia" },
      { number: "1205", name: "Eldorado / Centro", route: "Via Av. do Contorno" },
      { number: "6401", name: "Venda Nova / Centro", route: "Via Av. Vilarinho" },
      { number: "3301", name: "Betim / Centro", route: "Via BR-381" },
      { number: "7102", name: "Ribeirão das Neves / Centro", route: "Via MG-010" },
      { number: "4501", name: "Contagem / Centro", route: "Via Av. João César de Oliveira" },
    ]
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuBtn && this.mobileMenu) {
      this.mobileMenuBtn.addEventListener("click", () => {
        this.mobileMenu.classList.toggle("hidden")
      })
    }

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.handleSearch(e.target.value)
      })

      this.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.performSearch(e.target.value)
        }
      })

      // Hide suggestions when clicking outside
      document.addEventListener("click", (e) => {
        if (!this.searchInput.contains(e.target) && !this.searchSuggestions.contains(e.target)) {
          this.hideSuggestions()
        }
      })
    }

    // Favorite buttons
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.toggleFavorite(e.target.closest(".line-card"))
      })
    })
  }

  handleSearch(query) {
    if (query.length < 2) {
      this.hideSuggestions()
      return
    }

    const suggestions = this.busLines
      .filter(
        (line) =>
          line.number.includes(query) ||
          line.name.toLowerCase().includes(query.toLowerCase()) ||
          line.route.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5)

    this.showSuggestions(suggestions)
  }

  showSuggestions(suggestions) {
    if (suggestions.length === 0) {
      this.hideSuggestions()
      return
    }

    const html = suggestions
      .map(
        (line) => `
            <div class="suggestion-item p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0" 
                 data-line="${line.number}">
                <div class="flex items-center space-x-3">
                    <div class="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
                        ${line.number}
                    </div>
                    <div>
                        <div class="font-medium">${line.name}</div>
                        <div class="text-sm text-muted-foreground">${line.route}</div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    this.searchSuggestions.innerHTML = html
    this.searchSuggestions.classList.remove("hidden")

    // Add click listeners to suggestions
    this.searchSuggestions.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        const lineNumber = item.dataset.line
        this.goToLine(lineNumber)
      })
    })
  }

  hideSuggestions() {
    if (this.searchSuggestions) {
      this.searchSuggestions.classList.add("hidden")
    }
  }

  performSearch(query) {
    console.log("[v0] Performing search for:", query)

    // Find exact match
    const exactMatch = this.busLines.find(
      (line) => line.number === query || line.name.toLowerCase() === query.toLowerCase(),
    )

    if (exactMatch) {
      this.goToLine(exactMatch.number)
    } else {
      // Show search results page or first suggestion
      const suggestions = this.busLines.filter(
        (line) => line.number.includes(query) || line.name.toLowerCase().includes(query.toLowerCase()),
      )

      if (suggestions.length > 0) {
        this.goToLine(suggestions[0].number)
      } else {
        alert("Nenhuma linha encontrada para: " + query)
      }
    }
  }

  goToLine(lineNumber) {
    console.log("[v0] Navigating to line:", lineNumber)
    window.location.href = `linha.html?line=${lineNumber}`
  }

  toggleFavorite(lineCard) {
    const lineNumber = lineCard.dataset.line
    const favorites = this.getFavorites()

    if (favorites.includes(lineNumber)) {
      this.removeFavorite(lineNumber)
      lineCard.classList.remove("favorited")
    } else {
      this.addFavorite(lineNumber)
      lineCard.classList.add("favorited")
    }
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem("bhtrans_favorites") || "[]")
  }

  addFavorite(lineNumber) {
    const favorites = this.getFavorites()
    if (!favorites.includes(lineNumber)) {
      favorites.push(lineNumber)
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites))
    }
  }

  removeFavorite(lineNumber) {
    const favorites = this.getFavorites()
    const index = favorites.indexOf(lineNumber)
    if (index > -1) {
      favorites.splice(index, 1)
      localStorage.setItem("bhtrans_favorites", JSON.stringify(favorites))
    }
  }

  loadFavorites() {
    const favorites = this.getFavorites()
    document.querySelectorAll(".line-card").forEach((card) => {
      const lineNumber = card.dataset.line
      if (favorites.includes(lineNumber)) {
        card.classList.add("favorited")
      }
    })
  }

  updateStats() {
    // Simulate real-time updates
    setInterval(() => {
      const lastUpdate = document.getElementById("last-update")
      if (lastUpdate) {
        const minutes = Math.floor(Math.random() * 10) + 1
        lastUpdate.textContent = `há ${minutes} minutos`
      }

      // Update active lines count
      const activeLines = document.getElementById("active-lines")
      if (activeLines) {
        const count = 847 + Math.floor(Math.random() * 10) - 5
        activeLines.textContent = count
      }
    }, 30000) // Update every 30 seconds
  }

  // Export functionality
  exportLineData(lineNumber, format = "json") {
    const lineData = this.busLines.find((line) => line.number === lineNumber)
    if (!lineData) return

    const data = {
      line: lineData,
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
      lastUpdate: new Date().toISOString(),
    }

    if (format === "json") {
      this.downloadFile(`linha_${lineNumber}.json`, JSON.stringify(data, null, 2))
    } else if (format === "csv") {
      const csv = this.convertToCSV(data)
      this.downloadFile(`linha_${lineNumber}.csv`, csv)
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
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new BHTrans()
})

// Service Worker registration for offline functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[v0] SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("[v0] SW registration failed: ", registrationError)
      })
  })
}
