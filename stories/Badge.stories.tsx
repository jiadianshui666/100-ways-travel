import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../src/components/ui/Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "cyan", "pink", "purple", "green", "yellow", "orange"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "默认标签" } };
export const Cyan: Story = { args: { variant: "cyan", children: "精选" } };
export const Pink: Story = { args: { variant: "pink", children: "热门" } };
export const Purple: Story = { args: { variant: "purple", children: "城市探索" } };
export const Green: Story = { args: { variant: "green", children: "已发布" } };
export const Small: Story = { args: { size: "sm", children: "小标签" } };
export const Large: Story = { args: { size: "lg", children: "大标签" } };
