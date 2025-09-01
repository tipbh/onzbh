/**
 * Dados das linhas de ônibus da BHTrans e DER-MG
 * Base de dados completa e atualizada via GeoJSON
 */

import routesGeoJSON from './routes-geojson.json' assert { type: 'json' };
import tripsGeoJSON from './geojson-trips.json' assert { type: 'json' };

export const BusData = {
  // Retorna todas as rotas
  getRoutes() {
    return routesGeoJSON.features;
  },

  // Retorna todas as viagens
  getTrips() {
    return tripsGeoJSON.features;
  },

  // Retorna uma rota pelo número da linha
  getRouteByNumber(lineNumber) {
    return routesGeoJSON.features.find(
      route => route.properties.route_number === lineNumber
    );
  },

  // Retorna todas as viagens de uma linha
  getTripsByLineNumber(lineNumber) {
    return tripsGeoJSON.features.filter(
      trip => trip.properties.route_number === lineNumber
    );
  },

  // Retorna dados completos da linha combinando rota e viagens
  getLineData(lineNumber) {
    const route = this.getRouteByNumber(lineNumber);
    const trips = this.getTripsByLineNumber(lineNumber);

    if (!route) return null;

    return {
      number: lineNumber,
      name: route.properties.name,
      routeDescription: route.properties.description || "",
      stops: route.properties.stops || [],
      trips: trips.map(trip => ({
        id: trip.properties.id,
        departure: trip.properties.departure,
        arrival: trip.properties.arrival,
        status: trip.properties.status || "ontime"
      }))
    };
  },

  // Buscar linhas por termo (id, nome, operador, rota)
  searchLines(term) {
    if (!term || term.length < 1) return [];

    const lower = term.toLowerCase().trim();

    return routesGeoJSON.features
      .filter(route =>
        (route.properties.route_number || "").toLowerCase().includes(lower) ||
        (route.properties.name || "").toLowerCase().includes(lower) ||
        (route.properties.description || "").toLowerCase().includes(lower) ||
        (route.properties.operator || "").toLowerCase().includes(lower)
      )
      .map(route => ({
        id: route.properties.route_number,
        name: route.properties.name,
        route: route.properties.description,
        operator: route.properties.operator,
        type: route.properties.type || "urbana",
      }));
  },

  // Pegar linha por ID (número da linha)
  getLineById(lineId) {
    const route = this.getRouteByNumber(lineId);
    if (!route) return null;

    return {
      id: route.properties.route_number,
      name: route.properties.name,
      route: route.properties.description,
      operator: route.properties.operator,
      type: route.properties.type || "urbana",
      stops: route.properties.stops || [],
    };
  },

  // Linhas populares (simulação de mais buscadas)
  getPopularLines(limit = 6) {
    const popularIds = ["1001", "2101", "3101", "5101", "6101", "7001"];
    return popularIds
      .map(id => this.getLineById(id))
      .filter(line => line !== null)
      .slice(0, limit);
  },

  // Todas as linhas de um operador específico
  getLinesByOperator(operator) {
    return routesGeoJSON.features
      .filter(route => route.properties.operator === operator)
      .map(route => ({
        id: route.properties.route_number,
        name: route.properties.name,
        route: route.properties.description,
        type: route.properties.type || "urbana",
      }));
  },

  // Todas as linhas de um tipo específico
  getLinesByType(type) {
    return routesGeoJSON.features
      .filter(route => (route.properties.type || "urbana") === type)
      .map(route => ({
        id: route.properties.route_number,
        name: route.properties.name,
        route: route.properties.description,
        operator: route.properties.operator,
      }));
  },
};

// Para compatibilidade global (caso queira usar via window)
if (typeof window !== "undefined") {
  window.BusData = BusData;
}
