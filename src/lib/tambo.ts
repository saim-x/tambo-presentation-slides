/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import RecipeCard from "@/components/recipe-card";
import WeatherCard from "@/components/ui/weather-card";
import ColorPalette from "@/components/color-palette";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    toolSchema: z
      .function()
      .args(
        z
          .object({
            continent: z.string().optional(),
            sortBy: z.enum(["population", "growthRate"]).optional(),
            limit: z.number().optional(),
            order: z.enum(["asc", "desc"]).optional(),
          })
          .optional()
      )
      .returns(
        z.array(
          z.object({
            countryCode: z.string(),
            countryName: z.string(),
            continent: z.enum([
              "Asia",
              "Africa",
              "Europe",
              "North America",
              "South America",
              "Oceania",
            ]),
            population: z.number(),
            year: z.number(),
            growthRate: z.number(),
          })
        )
      ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    toolSchema: z
      .function()
      .args(
        z
          .object({
            startYear: z.number().optional(),
            endYear: z.number().optional(),
          })
          .optional()
      )
      .returns(
        z.array(
          z.object({
            year: z.number(),
            population: z.number(),
            growthRate: z.number(),
          })
        )
      ),
  },
  {
    name: "get-available-ingredients",
    description:
      "Get a list of all the available ingredients that can be used in a recipe.",
    tool: () => [
      "pizza dough",
      "mozzarella cheese",
      "tomatoes",
      "basil",
      "olive oil",
      "chicken breast",
      "ground beef",
      "onions",
      "garlic",
      "bell peppers",
      "mushrooms",
      "pasta",
      "rice",
      "eggs",
      "bread",
    ],
    toolSchema: z.function().returns(z.array(z.string())),
  },
  {
    name: "generate-color-palette",
    description: "Generate a color palette based on a theme or style. Returns an array of hex color codes.",
    tool: (theme: string = "sunset") => {
      const palettes: Record<string, string[]> = {
        sunset: ["#FF6B6B", "#FF8E53", "#FFB347", "#FFD93D", "#FF6B9D"],
        ocean: ["#006994", "#1E90FF", "#87CEEB", "#B0E0E6", "#E0F6FF"],
        forest: ["#228B22", "#32CD32", "#90EE90", "#98FB98", "#F0FFF0"],
        desert: ["#DEB887", "#F4A460", "#D2B48C", "#CD853F", "#8B4513"],
        night: ["#191970", "#483D8B", "#6A5ACD", "#9370DB", "#BA55D3"],
        spring: ["#FFB6C1", "#FFC0CB", "#FFE4E1", "#F0E68C", "#98FB98"],
        autumn: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#FF6347"],
        winter: ["#F0F8FF", "#E6E6FA", "#B0C4DE", "#87CEEB", "#ADD8E6"],
        fire: ["#FF4500", "#FF6347", "#FF7F50", "#FF8C00", "#FFA500"],
        earth: ["#8B4513", "#A0522D", "#CD853F", "#D2691E", "#B8860B"]
      };
      return palettes[theme.toLowerCase()] || palettes.sunset;
    },
    toolSchema: z
      .function()
      .args(z.string().optional().describe("Theme for the color palette (e.g., 'sunset', 'ocean', 'forest')"))
      .returns(z.array(z.string().describe("Array of hex color codes"))),
  }
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "RecipeCard",
    description: "A component that renders a recipe card",
    component: RecipeCard,
    propsSchema: z.object({
      title: z.string().describe("The title of the recipe"),
      description: z.string().describe("The description of the recipe"),
      prepTime: z.number().describe("The prep time of the recipe in minutes"),
      cookTime: z.number().describe("The cook time of the recipe in minutes"),
      originalServings: z
        .number()
        .describe("The original servings of the recipe"),
      ingredients: z
        .array(
          z.object({
            name: z.string().describe("The name of the ingredient"),
            amount: z.number().describe("The amount of the ingredient"),
            unit: z.string().describe("The unit of the ingredient"),
          })
        )
        .describe("The ingredients of the recipe"),
    }),
  },
  {
    name: "WeatherCard",
    description: "A component that displays weather information for a city.",
    component: WeatherCard,
    propsSchema: z.object({
      city: z.string().describe("The city name"),
      temperature: z.number().describe("Termperature in Celcius"),
      condition: z.enum(["sunny", "cloudy", "rainy"]).describe("Weather condition"),
      humidity: z.number().describe("Humidity Percentage"),
    }),
  },
  {
    name: "ColorPalette",
    description: "A component that displays a color palette with hex codes",
    component: ColorPalette,
    propsSchema: z.object({
      colors: z.array(z.string()).describe("Array of hex color codes"),
      paletteName: z.string().describe("Name of the color palette"),
    }),
  }
  // Add more components here
];
