import { defineConfig, defineGlobalStyles } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import amber from "@park-ui/panda-preset/colors/amber";
import sand from "@park-ui/panda-preset/colors/sand";
import grass from "@park-ui/panda-preset/colors/grass";
import tomato from "@park-ui/panda-preset/colors/tomato";

export default defineConfig({
  preflight: true,
  presets: [
    "@pandacss/preset-base",
    createPreset({
      accentColor: amber,
      grayColor: sand,
      radius: "sm",
    }),
  ],
  include: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  exclude: ["./app/api/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  theme: {
    extend: {
      tokens: {
        fonts: {
          sans: {
            value: [
              "'Helvetica Neue'",
              "Arial",
              "'Hiragino Kaku Gothic ProN'",
              "'Hiragino Sans'",
              "Meiryo",
              "sans-serif",
            ],
          },
        },
        colors: {
          grass: grass.tokens,
          tomato: tomato.tokens,
        },
      },
    },
  },
  patterns: {
    extend: {
      container: {
        transform(props) {
          return {
            position: "relative",
            w: {
              base: "94%",
              sm: "xl",
              md: "2xl",
              lg: "4xl",
              xl: "6xl",
              "2xl": "8xl",
            },
            mx: "auto",
            ...props,
          };
        },
      },
    },
  },
  globalCss: defineGlobalStyles({
    "html, body": {
      "*": {
        fontFamily: "sans",
        fontSize: {
          base: "14px",
          md: "16px",
        },
      },
    },
  }),
  staticCss: {
    recipes: {
      badge: [{ variant: ["*"] }],
    },
    css: [
      {
        properties: {
          color: [
            "grass.light.9",
            "tomato.light.9",
            "amber.light.9",
            "gray.light.9",
          ],
          bgColor: [
            "grass.light.9",
            "tomato.light.9",
            "amber.light.9",
            "gray.light.9",
          ],
        },
      },
    ],
  },
  outdir: "styled-system",
});
