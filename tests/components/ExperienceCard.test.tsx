import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceCard, ExperienceCardSkeleton } from "@/components/home/ExperienceCard";

const mockExperience = {
  id: "exp-001",
  title: "东京深夜拉面巡礼",
  slug: "tokyo-ramen-tour",
  description: "深夜的新宿街头，霓虹灯映照着拉面馆的暖帘。",
  location: "日本 · 东京",
  price: 880,
  duration: "3 小时",
  images: '["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"]',
  featured: true,
  published: true,
  authorId: "author-1",
  categoryId: "cat-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: { id: "cat-1", name: "美食之旅", slug: "food-tour", icon: "🍜" },
  author: { id: "author-1", name: "管理员", avatar: null },
};

describe("ExperienceCard", () => {
  it("renders the title", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText("东京深夜拉面巡礼")).toBeDefined();
  });

  it("renders the location", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText("日本 · 东京")).toBeDefined();
  });

  it("renders the duration", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText("3 小时")).toBeDefined();
  });

  it("renders the price formatted", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText(/880/)).toBeDefined();
  });

  it("renders category badge", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText(/美食之旅/)).toBeDefined();
  });

  it("renders featured badge when featured", () => {
    render(<ExperienceCard experience={mockExperience} />);
    expect(screen.getByText("精选")).toBeDefined();
  });

  it("does NOT render featured badge when not featured", () => {
    const notFeatured = { ...mockExperience, featured: false };
    render(<ExperienceCard experience={notFeatured} />);
    expect(screen.queryByText("精选")).toBeNull();
  });

  it("renders a link to the detail page", () => {
    render(<ExperienceCard experience={mockExperience} />);
    const link = screen.getByRole("link");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toContain("tokyo-ramen-tour");
  });

  it("has accessible aria-label on link", () => {
    render(<ExperienceCard experience={mockExperience} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("aria-label")).toContain("东京深夜拉面巡礼");
  });

  it("truncates long description with line-clamp", () => {
    const longDesc = { ...mockExperience, description: "A".repeat(500) };
    render(<ExperienceCard experience={longDesc} />);
    expect(screen.getByText(/A+/)).toBeDefined();
  });
});

describe("ExperienceCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ExperienceCardSkeleton />);
    expect(container.firstChild).toBeDefined();
  });

  it("has glass styling class", () => {
    const { container } = render(<ExperienceCardSkeleton />);
    expect(container.querySelector(".glass")).toBeDefined();
  });

  it("renders multiple skeleton lines", () => {
    const { container } = render(<ExperienceCardSkeleton />);
    // Should have shimmer elements
    const skeletons = container.querySelectorAll(".skeleton");
    expect(skeletons.length).toBeGreaterThan(3);
  });
});
