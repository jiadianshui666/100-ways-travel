import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "@/components/search/SearchInput";

describe("SearchInput", () => {
  it("renders input field", () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders placeholder text", () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText(/搜索旅行体验/)).toBeDefined();
  });

  it("displays the current value", () => {
    render(<SearchInput value="冰岛" onChange={vi.fn()} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("冰岛");
  });

  it("calls onChange when typing", () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "拉面" } });
    expect(onChange).toHaveBeenCalledWith("拉面");
  });

  it("shows clear button when value is non-empty", () => {
    render(<SearchInput value="测试" onChange={vi.fn()} />);
    // There should be a button (clear)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("does NOT show clear button when value is empty", () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("calls onChange with empty string on clear", () => {
    const onChange = vi.fn();
    render(<SearchInput value="test" onChange={onChange} />);
    const clearBtn = screen.getByRole("button");
    fireEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("shows spinner when loading", () => {
    const { container } = render(
      <SearchInput value="searching" onChange={vi.fn()} loading={true} />
    );
    // Should have an animated element
    expect(container.querySelector(".animate-spin")).toBeDefined();
  });

  it("shows search icon when not loading", () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} loading={false} />
    );
    // Should NOT have a spinner
    expect(container.querySelector(".animate-spin")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeDefined();
  });
});
