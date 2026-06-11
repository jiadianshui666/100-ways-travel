import type { Meta, StoryObj } from "@storybook/react";
import { NicheLevelBadge } from "../src/components/ui/NicheLevelBadge";

const meta: Meta<typeof NicheLevelBadge> = {
  title: "UI/NicheLevelBadge",
  component: NicheLevelBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NicheLevelBadge>;

export const Mainstream: Story = { args: { level: "mainstream" } };
export const Popular: Story = { args: { level: "popular" } };
export const Rising: Story = { args: { level: "rising" } };
export const Niche: Story = { args: { level: "niche" } };
export const HiddenGem: Story = { args: { level: "hidden-gem" } };
