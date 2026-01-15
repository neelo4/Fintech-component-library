const { greet, button } = require("./index");

test("greets a user", () => {
  expect(greet("World")).toBe("Hello, World! Welcome to my first NPM package.");
});

test("creates a button", () => {
  expect(button("Click me", "alert('Hello')")).toBe('<button onclick="alert(\'Hello\')">Click me</button>');
});
