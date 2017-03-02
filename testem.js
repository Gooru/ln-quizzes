module.exports = {
  "framework": "qunit",
  "test_page": "tests/index.html?hidepassed",
  "disable_watching": true,
  "launch_in_ci": [
    "PhantomJS"
  ],
  "launch_in_dev": [
    "PhantomJS",
    "Chrome"
  ],
  "proxies": {
    "/quizzes": {
      "target": "http://localhost:8882"
    },
    "/api": {
      "target": "http://localhost:8882"
    }
  }
};
