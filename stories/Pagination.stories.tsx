import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "../src/components/ui/Pagination";

const noop = () => {};

const meta: Meta<typeof Pagination> = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Page1of5: Story = { args: { page: 1, totalPages: 5, onPageChange: noop } };
export const Page3of5: Story = { args: { page: 3, totalPages: 5, onPageChange: noop } };
export const ManyPages: Story = { args: { page: 5, totalPages: 20, onPageChange: noop } };
export const SinglePage: Story = { args: { page: 1, totalPages: 1, onPageChange: noop } };
