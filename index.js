function greet(name) {
  return `Hello, ${name}! Welcome to my first NPM package.`;
}

function button(label, onClick) {
  return `<button onclick="${onClick}">${label}</button>`;
}

module.exports = { greet, button };
