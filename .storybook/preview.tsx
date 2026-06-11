import "../src/app/globals.css";
import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0a0a0f" }] },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  decorators: [(Story) => <div className="font-body p-4"><Story /></div>],
};

export default preview;
