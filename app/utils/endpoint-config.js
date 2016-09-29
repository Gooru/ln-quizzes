import ConfigurationService from 'quizzes/services/configuration';

export function getEndpointUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("endpoint.url");
}

export function getEndpointSecureUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("endpoint.secureUrl");
}

export function getRealTimeWebServiceUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("realTime.webServiceUrl");
}

export function getRealTimeWebServiceUri() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("realTime.webServiceUri");
}

export function getRealTimeWebSocketUrl() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("realTime.webSocketUrl") + getRealTimeWebSocketUri();
}

export function getRealTimeWebSocketUri() {
  const configuration = ConfigurationService.configuration;
  return configuration.get("realTime.webSocketUri");
}
