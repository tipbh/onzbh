/**
 * Dados das linhas de ônibus da BHTrans e DER-MG
 * Base de dados completa e atualizada via GeoJSON
 */

// Importa os arquivos GeoJSON. O "assert" é necessário para importar como um JSON.
// Verifique se os nomes dos arquivos estão corretos: routes.geojson e trips.geojson
import routesGeoJSON from './routes.geojson' assert { type: 'json' };
import tripsGeoJSON from './trips.geojson' assert { type: 'json' };

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
  // Corrigido para buscar na propriedade `route.route_short_name` do GeoJSON
  getRouteByNumber(lineNumber) {
    return routesGeoJSON.features.find(
      route => route.properties.route.route_short_name === lineNumber
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
      name: route.properties.route.route_long_name,
      shortName: route.properties.route.route_short_name,
      // Acessa o operador corretamente
      operator: route.properties.route.agency_id === "37926" ? "BHTrans" : "DER-MG",
      stops: route.properties.route.stops || [],
      trips: trips.map(trip => ({
        id: trip.properties.id,
        departure: trip.properties.departure,
        arrival: trip.properties.arrival,
      })),
    };
  },
  
  // Função de busca que retorna linhas com base no número ou nome
  // Lógica de busca corrigida para usar as propriedades corretas do GeoJSON
  searchLines(query) {
    const lowerCaseQuery = query.toLowerCase();
    return routesGeoJSON.features
      .filter(feature => {
        // Acessa as propriedades corretamente
        const { route_short_name, route_long_name } = feature.properties.route;
        return (
          // Busca tanto no nome curto (número) quanto no nome longo
          route_short_name.toLowerCase().includes(lowerCaseQuery) ||
          route_long_name.toLowerCase().includes(lowerCaseQuery)
        );
      })
      .map(feature => {
        const { route_short_name, route_long_name } = feature.properties.route;
        return {
          shortName: route_short_name,
          longName: route_long_name,
          id: route_short_name, // Usar o nome curto como ID para navegação
        };
      });
  },

  // Linhas populares (simulação de mais buscadas)
  getPopularLines(limit = 6) {
    const popularNumbers = ["1502", "8207", "9206", "3051", "5102", "6101"];
    return popularNumbers
      .map(num => this.getLineData(num))
      .filter(line => line !== null)
      .slice(0, limit);
  },
  
};
