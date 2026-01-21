import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./src/components/Button/Button";
import { axe } from "jest-axe";

describe("Button", () => {
  test("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies primary variant by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("bg-blue-600");
  });

  test("applies secondary variant", () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("bg-gray-600");
  });

  test("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });
  test("Button is accessible", async () => {
    const { container } = render(<Button>Click</Button>);
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
