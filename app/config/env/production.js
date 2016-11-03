/*
 Production Environment configuration properties
 */
export default {
  "endpoint" : {
    "url": "http://quizzes-api-qa-246519991.us-east-1.elb.amazonaws.com",
    "secureUrl": "http://quizzes-api-qa-246519991.us-east-1.elb.amazonaws.com"
  },

  "realTime": {
    "webServiceUrl": "https://www.gooru.org",
    "webServiceUri": "/nucleus/realtime",
    "webSocketUrl": "https://rt.gooru.org",
    "webSocketUri": "/ws/realtime"
  },

  "teams": {
    "url": "http://teams.gooru.org"
  }
};
