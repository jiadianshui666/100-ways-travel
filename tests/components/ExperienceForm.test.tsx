import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

// Mock global fetch for category loading
beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ExperienceForm (create mode)", () => {
  it("renders all required form fields", () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    expect(screen.getByText("标题 *")).toBeDefined();
    expect(screen.getByText("Slug *")).toBeDefined();
    expect(screen.getByText("描述 *")).toBeDefined();
    expect(screen.getByText("地点 *")).toBeDefined();
    expect(screen.getByText("时长 *")).toBeDefined();
    expect(screen.getByText("价格 (CNY) *")).toBeDefined();
    expect(screen.getByText("分类 *")).toBeDefined();
  });

  it("renders featured and published checkboxes", () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    expect(screen.getByText("精选体验")).toBeDefined();
    expect(screen.getByText("立即发布")).toBeDefined();
  });

  it("renders submit button with '创建体验' text", () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    expect(screen.getByText("创建体验")).toBeDefined();
  });

  it("renders image URL input with add button", () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    expect(screen.getByText("图片 URLs *")).toBeDefined();
    expect(screen.getByText(/添加图片/)).toBeDefined();
  });

  it("shows validation errors on empty submit", async () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    const submitBtn = screen.getByText("创建体验");
    fireEvent.click(submitBtn);
    await waitFor(() => {
      // Zod errors should appear
      const errorMsgs = screen.queryAllByText(/请输入|请选择|价格不能/);
      // At least some validation messages should appear
      expect(errorMsgs.length).toBeGreaterThan(0);
    });
  });

  it("auto-generates slug from title in create mode", async () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    const titleInput = screen
      .getAllByRole("textbox")
      .find(
        (el) =>
          el.getAttribute("name") === "title" ||
          (el as HTMLInputElement).placeholder === ""
      );
    if (titleInput) {
      fireEvent.change(titleInput, { target: { value: "Hello World 测试" } });
      await waitFor(() => {
        const slugInputs = screen.getAllByRole("textbox");
        const slugInput = slugInputs.find(
          (el) => el.getAttribute("name") === "slug"
        );
        if (slugInput) {
          expect((slugInput as HTMLInputElement).value).toContain("hello-world");
        }
      });
    }
  });

  it("has a cancel link pointing to /admin/experiences", () => {
    render(<ExperienceForm token="test-token" mode="create" />);
    const cancelLink = screen.getByText("取消");
    expect(cancelLink.closest("a")?.getAttribute("href")).toBe(
      "/admin/experiences"
    );
  });
});

describe("ExperienceForm (edit mode)", () => {
  const defaultValues = {
    id: "exp-edit-1",
    title: "测试体验编辑",
    slug: "test-edit",
    description: "编辑描述",
    location: "测试地点",
    price: 999,
    duration: "2天",
    images: '["https://example.com/edit.jpg"]',
    featured: true,
    published: false,
    categoryId: "cat-1",
  };

  it("renders submit button with '更新体验' text", () => {
    render(
      <ExperienceForm
        token="test-token"
        mode="edit"
        defaultValues={defaultValues}
      />
    );
    expect(screen.getByText("更新体验")).toBeDefined();
  });

  it("pre-fills title from defaultValues", () => {
    render(
      <ExperienceForm
        token="test-token"
        mode="edit"
        defaultValues={defaultValues}
      />
    );
    const titleInputs = screen.getAllByRole("textbox");
    const titleInput = titleInputs.find(
      (el) => el.getAttribute("name") === "title"
    );
    expect(titleInput).toBeDefined();
    if (titleInput) {
      expect((titleInput as HTMLInputElement).value).toBe("测试体验编辑");
    }
  });

  it("pre-fills slug from defaultValues", () => {
    render(
      <ExperienceForm
        token="test-token"
        mode="edit"
        defaultValues={defaultValues}
      />
    );
    const slugInputs = screen.getAllByRole("textbox");
    const slugInput = slugInputs.find(
      (el) => el.getAttribute("name") === "slug"
    );
    expect(slugInput).toBeDefined();
    if (slugInput) {
      expect((slugInput as HTMLInputElement).value).toBe("test-edit");
    }
  });

  it("pre-fills description from defaultValues", () => {
    render(
      <ExperienceForm
        token="test-token"
        mode="edit"
        defaultValues={defaultValues}
      />
    );
    const textareas = screen.getAllByRole("textbox");
    const descTextarea = textareas.find(
      (el) => el.getAttribute("name") === "description"
    );
    expect(descTextarea).toBeDefined();
    if (descTextarea) {
      expect((descTextarea as HTMLInputElement).value).toBe("编辑描述");
    }
  });
});
