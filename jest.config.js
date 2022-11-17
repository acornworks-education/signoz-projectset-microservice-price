const config = {
    collectCoverage: true,
    coverageReporters: ['json', 'html'],    
    coverageThreshold: {
      global: {
        functions: 00,
        lines: 80
      },
    },
  };
  
  module.exports = config;