import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "./Button";
import { axe } from "jest-axe";
import { ButtonThemeProvider } from "./buttonTheme";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies primary variant by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");
  });

  it("applies secondary variant", () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-secondary");
  });

  it("supports custom theme overrides", () => {
    render(
      <ButtonThemeProvider
        value={{ variants: { custom: "bg-pink-500 text-white" } }}
      >
        <Button variant="custom">Pink</Button>
      </ButtonThemeProvider>
    );

    expect(screen.getByRole("button")).toHaveClass("bg-pink-500", "text-white");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("renders loading state", () => {
    render(
      <Button isLoading loadingText="Loading orders">
        Orders
      </Button>
    );

    expect(screen.getByText("Loading orders")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("supports polymorphic as prop", () => {
    render(
      <Button as="a" href="https://example.com">
        Link button
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("href", "https://example.com");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Click</Button>);

    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });

    expect(results).toHaveNoViolations();
  });
});
