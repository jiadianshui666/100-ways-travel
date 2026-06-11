import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "../src/components/ui/EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: "暂无数据", description: "当前筛选条件下没有找到相关内容" },
};
export const WithAction: Story = {
  args: {
    title: "搜索无结果",
    description: "没有找到匹配的旅行体验",
    action: <button className="px-4 py-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm">清除筛选</button>,
  },
};
