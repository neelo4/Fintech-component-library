const greet = require("./index");

test("greets a user", () => {
  expect(greet("World")).toBe("Hello, World! Welcome to my first NPM package.");
});
