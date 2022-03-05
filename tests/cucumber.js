const common = `
  --require runner/hooks.js 
  --require features/steps/steps.js
  `;

module.exports = {
  default: `${common} features/*.feature`
};