import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "@/components/home/FilterBar";

describe("FilterBar", () => {
  const defaultProps = {
    activeStyle: null,
    nicheLevel: null,
    sort: "newest" as const,
    onStyleChange: vi.fn(),
    onNicheLevelChange: vi.fn(),
    onSortChange: vi.fn(),
  };

  it("renders all three filter sections", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("视觉风格")).toBeDefined();
    expect(screen.getByText("小众指数")).toBeDefined();
    expect(screen.getByText("排序")).toBeDefined();
  });

  it("renders style chips", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText(/极限冒险/)).toBeDefined();
    expect(screen.getByText(/自然风光/)).toBeDefined();
    expect(screen.getByText(/美食之旅/)).toBeDefined();
  });

  it("calls onStyleChange when a style chip is clicked", () => {
    const onStyleChange = vi.fn();
    render(<FilterBar {...defaultProps} onStyleChange={onStyleChange} />);
    fireEvent.click(screen.getByText(/自然风光/));
    expect(onStyleChange).toHaveBeenCalledWith("nature");
  });

  it("calls onStyleChange with null when active chip is clicked again", () => {
    const onStyleChange = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        activeStyle="nature"
        onStyleChange={onStyleChange}
      />
    );
    fireEvent.click(screen.getByText(/自然风光/));
    expect(onStyleChange).toHaveBeenCalledWith(null);
  });

  it("renders niche level chips", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("大众")).toBeDefined();
    expect(screen.getByText("小众")).toBeDefined();
    expect(screen.getByText("宝藏")).toBeDefined();
  });

  it("calls onNicheLevelChange when niche chip is clicked", () => {
    const onNicheLevelChange = vi.fn();
    render(<FilterBar {...defaultProps} onNicheLevelChange={onNicheLevelChange} />);
    fireEvent.click(screen.getByText("小众"));
    expect(onNicheLevelChange).toHaveBeenCalledWith("niche");
  });

  it("renders sort options", () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText("最新发布")).toBeDefined();
    expect(screen.getByText("价格 ↑")).toBeDefined();
    expect(screen.getByText("价格 ↓")).toBeDefined();
  });

  it("calls onSortChange when sort option is clicked", () => {
    const onSortChange = vi.fn();
    render(<FilterBar {...defaultProps} onSortChange={onSortChange} />);
    fireEvent.click(screen.getByText("价格 ↑"));
    expect(onSortChange).toHaveBeenCalledWith("price-asc");
  });

  it("active sort button has distinct styling", () => {
    render(<FilterBar {...defaultProps} sort="newest" />);
    const newestBtn = screen.getByText("最新发布");
    expect(newestBtn.className).toContain("neon-cyan");
  });

  it("handles multiple clicks independently", () => {
    const onStyleChange = vi.fn();
    const onSortChange = vi.fn();
    render(
      <FilterBar
        {...defaultProps}
        onStyleChange={onStyleChange}
        onSortChange={onSortChange}
      />
    );
    fireEvent.click(screen.getByText(/极限冒险/));
    fireEvent.click(screen.getByText("价格 ↓"));
    expect(onStyleChange).toHaveBeenCalledWith("adventure");
    expect(onSortChange).toHaveBeenCalledWith("price-desc");
  });
});
