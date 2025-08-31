// Admin panel JavaScript
class AdminPanel {
  constructor() {
    this.init()
    this.setupEventListeners()
    this.loadSystemStats()
    this.startLogMonitoring()
  }

  init() {
    console.log("[v0] Admin panel initialized")
    this.forceUpdateBtn = document.getElementById("force-update-btn")
    this.systemLogs = []
    this.alerts = []
  }

  setupEventListeners() {
    // Force update button
    if (this.forceUpdateBtn) {
      this.forceUpdateBtn.addEventListener("click", () => {
        this.forceDataUpdate()
      })
    }

    // Cache clear button
    document.querySelectorAll('[data-action="clear-cache"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        this.clearSystemCache()
      })
    })

    // Backup button
    document.querySelectorAll('[data-action="backup"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        this.generateBackup()
      })
    })

    // Alert form submission
    const alertForm = document.querySelector("form")
    if (alertForm) {
      alertForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.createAlert(new FormData(alertForm))
      })
    }

    // Delete alert buttons
    document.querySelectorAll('[data-action="delete-alert"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.deleteAlert(e.target.closest(".alert-item"))
      })
    })
  }

  loadSystemStats() {
    // Simulate loading system statistics
    const stats = {
      activeLines: 847,
      totalStops: 12543,
      lastUpdate: "14:30",
      errorsToday: 3,
      systemStatus: "operational",
    }

    this.updateStatsDisplay(stats)
  }

  updateStatsDisplay(stats) {
    // Update stats cards
    const elements = {
      "active-lines": stats.activeLines,
      "total-stops": stats.totalStops,
      "last-update": stats.lastUpdate,
      "errors-today": stats.errorsToday,
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) {
        element.textContent = value
      }
    })
  }

  forceDataUpdate() {
    console.log("[v0] Forcing data update...")

    // Show loading state
    this.forceUpdateBtn.textContent = "Atualizando..."
    this.forceUpdateBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      this.addLog("success", "Atualização forçada concluída", "847 linhas sincronizadas com sucesso")

      // Reset button
      this.forceUpdateBtn.textContent = "Atualizar"
      this.forceUpdateBtn.disabled = false

      // Update last update time
      const now = new Date()
      const timeString = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })

      document.getElementById("last-update").textContent = timeString

      this.showNotification("Dados atualizados com sucesso!")
    }, 3000)
  }

  clearSystemCache() {
    console.log("[v0] Clearing system cache...")

    // Simulate cache clearing
    setTimeout(() => {
      this.addLog("info", "Cache limpo", "Cache de horários e rotas removido")
      this.showNotification("Cache limpo com sucesso!")
    }, 1000)
  }

  generateBackup() {
    console.log("[v0] Generating system backup...")

    const backupData = {
      timestamp: new Date().toISOString(),
      lines: 847,
      stops: 12543,
      alerts: this.alerts,
      logs: this.systemLogs.slice(-100), // Last 100 logs
    }

    // Create and download backup file
    const filename = `bhtrans_backup_${new Date().toISOString().split("T")[0]}.json`
    this.downloadFile(filename, JSON.stringify(backupData, null, 2))

    this.addLog("info", "Backup gerado", `Arquivo: ${filename}`)
    this.showNotification("Backup gerado e baixado!")
  }

  addLog(type, title, message) {
    const log = {
      id: Date.now(),
      type: type,
      title: title,
      message: message,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    this.systemLogs.unshift(log)
    this.updateLogsDisplay()
  }

  updateLogsDisplay() {
    const logsContainer = document.querySelector(".logs-container")
    if (!logsContainer) return

    const typeColors = {
      success: "green",
      warning: "yellow",
      error: "red",
      info: "blue",
    }

    const html = this.systemLogs
      .slice(0, 10)
      .map(
        (log) => `
            <div class="p-3 bg-${typeColors[log.type]}-50 border-l-4 border-${typeColors[log.type]}-400 rounded">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="text-sm font-medium text-${typeColors[log.type]}-800">${log.title}</div>
                        <div class="text-xs text-${typeColors[log.type]}-600">${log.message}</div>
                    </div>
                    <div class="text-xs text-${typeColors[log.type]}-600">${log.timestamp}</div>
                </div>
            </div>
        `,
      )
      .join("")

    logsContainer.innerHTML = html
  }

  createAlert(formData) {
    const alert = {
      id: Date.now(),
      type: formData.get("type") || "Outros",
      lines: formData.get("lines") || "",
      message: formData.get("message") || "",
      created: new Date().toISOString(),
    }

    this.alerts.push(alert)
    this.updateAlertsDisplay()
    this.addLog("info", "Aviso criado", `${alert.type}: ${alert.message.substring(0, 50)}...`)
    this.showNotification("Aviso publicado com sucesso!")

    // Reset form
    document.querySelector("form").reset()
  }

  updateAlertsDisplay() {
    const alertsContainer = document.querySelector(".alerts-container")
    if (!alertsContainer) return

    const typeColors = {
      "Desvio de Rota": "yellow",
      "Operação Reduzida": "blue",
      Manutenção: "orange",
      Greve: "red",
      Outros: "gray",
    }

    const html = this.alerts
      .map(
        (alert) => `
            <div class="alert-item p-4 bg-${typeColors[alert.type] || "gray"}-50 border border-${typeColors[alert.type] || "gray"}-200 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-medium text-${typeColors[alert.type] || "gray"}-800">${alert.type}</div>
                    <button class="text-${typeColors[alert.type] || "gray"}-600 hover:text-${typeColors[alert.type] || "gray"}-800" 
                            data-action="delete-alert" data-alert-id="${alert.id}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm text-${typeColors[alert.type] || "gray"}-700">${alert.message}</p>
                ${alert.lines ? `<p class="text-xs text-${typeColors[alert.type] || "gray"}-600 mt-1">Linhas: ${alert.lines}</p>` : ""}
                <p class="text-xs text-${typeColors[alert.type] || "gray"}-600 mt-2">
                    Criado ${this.getRelativeTime(alert.created)}
                </p>
            </div>
        `,
      )
      .join("")

    alertsContainer.innerHTML = html

    // Re-attach delete listeners
    alertsContainer.querySelectorAll('[data-action="delete-alert"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const alertId = Number.parseInt(e.target.closest("[data-alert-id]").dataset.alertId)
        this.deleteAlert(alertId)
      })
    })
  }

  deleteAlert(alertId) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId)
    this.updateAlertsDisplay()
    this.addLog("info", "Aviso removido", "Aviso deletado pelo administrador")
    this.showNotification("Aviso removido!")
  }

  startLogMonitoring() {
    // Simulate periodic system events
    setInterval(() => {
      const events = [
        { type: "info", title: "Sincronização automática", message: "Dados atualizados automaticamente" },
        { type: "warning", title: "Timeout na API", message: "Reconexão bem-sucedida" },
        { type: "success", title: "Cache renovado", message: "Cache de horários atualizado" },
      ]

      const randomEvent = events[Math.floor(Math.random() * events.length)]
      this.addLog(randomEvent.type, randomEvent.title, randomEvent.message)
    }, 45000) // Add log every 45 seconds
  }

  getRelativeTime(timestamp) {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))

    if (diffInMinutes < 1) return "agora"
    if (diffInMinutes < 60) return `há ${diffInMinutes} minutos`
    if (diffInMinutes < 1440) return `há ${Math.floor(diffInMinutes / 60)} horas`
    return `há ${Math.floor(diffInMinutes / 1440)} dias`
  }

  downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  showNotification(message) {
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
  new AdminPanel()
})
