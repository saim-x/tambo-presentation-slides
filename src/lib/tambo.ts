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
import SlidesGenerator from '@/components/slide-generator';

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "";

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
  },
  {
    name: "generate-presentation-outline",
    description: "Generate a structured outline for a presentation on any topic with automatically fetched relevant images from Unsplash.",
    tool: async (params: { topic: string; slideCount?: number }) => {
      const { topic, slideCount = 5 } = params;
      
      const outlines = {
        "business pitch": [
          { type: "intro", heading: "The Problem", description: "Identify the key problem your solution addresses and why it matters now." },
          { type: "content", heading: "Our Solution", description: "Present your unique approach and how it solves the problem better than alternatives." },
          { type: "content", heading: "Market Opportunity", description: "Show the size of the market and your target customers." },
          { type: "content", heading: "Business Model", description: "Explain how you'll make money and scale the business." },
          { type: "outro", heading: "Next Steps", description: "Clear call to action and what you need from investors or partners." }
        ],
        "product demo": [
          { type: "intro", heading: "Welcome", description: "Introduction to the product and what makes it special." },
          { type: "content", heading: "Key Features", description: "Showcase the main features and benefits users will love." },
          { type: "content", heading: "How It Works", description: "Step-by-step walkthrough of the user experience." },
          { type: "content", heading: "Use Cases", description: "Real-world scenarios where this product shines." },
          { type: "outro", heading: "Get Started", description: "How to begin using the product and where to learn more." }
        ],
        "educational": [
          { type: "intro", heading: "Learning Objectives", description: "What you'll understand by the end of this presentation." },
          { type: "content", heading: "Core Concepts", description: "Fundamental principles and key terminology." },
          { type: "content", heading: "Practical Examples", description: "Real-world applications and case studies." },
          { type: "content", heading: "Common Mistakes", description: "Pitfalls to avoid and best practices." },
          { type: "outro", heading: "Summary & Next Steps", description: "Key takeaways and suggested further learning." }
        ],
        "ai in healthcare": [
          { type: "intro", heading: "The AI Healthcare Revolution", description: "Artificial Intelligence is transforming healthcare at an unprecedented pace. From diagnostic imaging to drug discovery, AI is enhancing medical accuracy, reducing costs, and improving patient outcomes. Today we'll explore the current state, benefits, challenges, and future of AI in healthcare." },
          { type: "content", heading: "Current AI Applications", description: "AI is already deployed in medical imaging (detecting tumors, fractures, and diseases), drug discovery (accelerating research and development), predictive analytics (forecasting patient deterioration), and administrative tasks (automating billing and scheduling). These applications are saving lives and reducing healthcare costs." },
          { type: "content", heading: "Real-World Impact", description: "AI has demonstrated remarkable results: 30% reduction in diagnostic errors, 40% faster drug discovery processes, improved patient engagement through chatbots, and enhanced surgical precision with robotic assistance. These improvements translate to better patient outcomes and reduced healthcare expenses." },
          { type: "content", heading: "Challenges & Ethical Considerations", description: "Key challenges include data privacy concerns, regulatory compliance, integration with existing systems, algorithmic bias, and maintaining human oversight. Healthcare organizations must balance innovation with patient safety and ethical AI deployment." },
          { type: "outro", heading: "The Future of AI Healthcare", description: "The future holds immense promise: personalized medicine based on genetic profiles, real-time health monitoring, advanced disease prediction, and democratized access to quality healthcare. Success requires investment in infrastructure, training, and robust governance frameworks." }
        ]
      };
  
      // Generate topic-specific content based on the topic
      const generateTopicSpecificContent = (topic: string) => {
        const topicLower = topic.toLowerCase();
        
        // Define content templates for different types of topics
        const contentTemplates = {
          // Technology topics
          technology: {
            intro: { heading: `Introduction to ${topic}`, description: `Welcome to our presentation on ${topic}. In today's digital age, ${topic} plays a crucial role in shaping how we interact with technology. We'll explore its evolution, current state, and future potential.` },
            concept: { heading: `Core Concepts of ${topic}`, description: `Let's understand the fundamental principles behind ${topic}. We'll examine the key components, working mechanisms, and essential features that make ${topic} function effectively.` },
            deepdive: { heading: `Advanced Features of ${topic}`, description: `Now we'll explore the sophisticated aspects of ${topic}. We'll look at advanced capabilities, technical specifications, and cutting-edge developments in this field.` },
            applications: { heading: `Real-World Applications`, description: `Discover how ${topic} is being used in various industries and everyday life. We'll examine practical implementations, success stories, and innovative use cases.` },
            outro: { heading: "Future Trends and Conclusion", description: `Let's explore the future of ${topic} and what developments we can expect. We'll also summarize key takeaways and discuss how to stay updated with this evolving technology.` }
          },
          
          // Business/Finance topics
          business: {
            intro: { heading: `Introduction to ${topic}`, description: `Welcome to our presentation on ${topic}. In the world of business and finance, ${topic} serves as an essential tool for managing resources and facilitating transactions. We'll explore its importance and functionality.` },
            concept: { heading: `Understanding ${topic}`, description: `Let's examine the fundamental aspects of ${topic}. We'll explore different types, key features, and the basic principles that govern how ${topic} works in various contexts.` },
            deepdive: { heading: `Types and Features of ${topic}`, description: `Now we'll take a detailed look at the various types of ${topic} available today. We'll compare features, discuss advantages and disadvantages, and explore specialized options.` },
            applications: { heading: `Practical Uses and Benefits`, description: `Discover how ${topic} benefits individuals and businesses in real-world scenarios. We'll examine security features, convenience factors, and practical applications in daily life.` },
            outro: { heading: "Choosing the Right Solution", description: `Let's discuss how to select the best ${topic} for different needs and situations. We'll provide guidance on making informed decisions and staying secure in an evolving landscape.` }
          },
          
          // General topics
          general: {
            intro: { heading: `Introduction to ${topic}`, description: `Welcome to our presentation on ${topic}. ${topic} is an important aspect of our daily lives that affects how we organize, store, and access our belongings. We'll explore its history, evolution, and modern applications.` },
            concept: { heading: `What is ${topic}?`, description: `Let's understand what ${topic} is and how it functions. We'll explore the basic concept, different types available, and the fundamental purpose that ${topic} serves in our lives.` },
            deepdive: { heading: `Types and Varieties of ${topic}`, description: `Now we'll examine the different types of ${topic} available today. We'll explore various materials, designs, features, and specialized options for different needs and preferences.` },
            applications: { heading: `Everyday Uses and Benefits`, description: `Discover how ${topic} makes our daily lives more convenient and organized. We'll explore practical applications, security benefits, and how ${topic} has evolved to meet modern needs.` },
            outro: { heading: "Making the Right Choice", description: `Let's discuss how to choose the best ${topic} for your specific needs. We'll provide tips on selection criteria, maintenance, and staying informed about new developments in this area.` }
          }
        };
        
        // Determine the topic category
        let category = 'general';
        if (topicLower.includes('wallet') || topicLower.includes('money') || topicLower.includes('finance') || topicLower.includes('bank') || topicLower.includes('credit') || topicLower.includes('payment')) {
          category = 'business';
        } else if (topicLower.includes('ai') || topicLower.includes('technology') || topicLower.includes('software') || topicLower.includes('digital') || topicLower.includes('app') || topicLower.includes('computer')) {
          category = 'technology';
        }
        
        const template = contentTemplates[category as keyof typeof contentTemplates];
        
        return [
          { type: "intro", heading: template.intro.heading, description: template.intro.description },
          { type: "content", heading: template.concept.heading, description: template.concept.description },
          { type: "content", heading: template.deepdive.heading, description: template.deepdive.description },
          { type: "content", heading: template.applications.heading, description: template.applications.description },
          { type: "outro", heading: template.outro.heading, description: template.outro.description }
        ];
      };
      
      const genericOutline = generateTopicSpecificContent(topic);
  
      const selectedOutline = outlines[topic.toLowerCase() as keyof typeof outlines] || genericOutline;
      const finalOutline = selectedOutline.slice(0, slideCount);
      
      // Add suggested images to each slide
      const slidesWithImages = finalOutline.map(async (slide, index) => {
        try {
          // Create search query based on slide content
          let searchQuery = topic;
          console.log("Search query for Unsplash:", searchQuery);
          
          // Enhance search query based on slide type and content
          if (slide.type === "intro") {
            searchQuery = `${topic} introduction`;
          } else if (slide.type === "outro") {
            searchQuery = `${topic} conclusion`;
          } else if (slide.type === "content") {
            // Extract key words from slide heading for better image search
            const headingWords = slide.heading.toLowerCase().split(' ').filter(word => 
              word.length > 3 && !['the', 'and', 'for', 'with', 'into', 'about', 'their', 'this', 'that'].includes(word)
            );
            if (headingWords.length > 0) {
              searchQuery = `${topic} ${headingWords.slice(0, 2).join(' ')}`;
            } else {
              searchQuery = `${topic} concept`;
            }
          }
          
          // Use Unsplash API to search for images
          console.log("Making Unsplash API call for:", searchQuery);
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=10&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
              }
            }
          );
          console.log(`API KEY CHECK: ${UNSPLASH_ACCESS_KEY}`)
          
          console.log("Unsplash API response status:", response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Unsplash API error response:", errorText);
            throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
          }
          
          const data = await response.json();
          console.log("Unsplash API response data:", data);
          
          if (data.results && data.results.length > 0) {
            // Use slide index to get different images and avoid duplicates
            // Add some randomization to get more variety
            const imageIndex = (index + Math.floor(Math.random() * 3)) % data.results.length;
            const image = data.results[imageIndex];
            return {
              ...slide,
              imageUrl: `${image.urls.regular}?w=800&q=80&fit=crop`,
              imageAlt: image.alt_description || `Illustration for ${slide.heading}`,
              photographer: image.user?.name || 'Unknown',
              unsplashUrl: image.links.html
            };
          } else {
            // Fallback to a generic search
            console.log("Trying fallback search for:", topic);
            const fallbackResponse = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=10&orientation=landscape`,
              {
                headers: {
                  'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                  'Accept-Version': 'v1'
                }
              }
            );
            
            console.log("Fallback response status:", fallbackResponse.status);
            
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json();
              console.log("Fallback search results:", fallbackData);
              if (fallbackData.results && fallbackData.results.length > 0) {
                // Use slide index to get different images with randomization
                const fallbackImageIndex = (index + Math.floor(Math.random() * 3)) % fallbackData.results.length;
                const fallbackImage = fallbackData.results[fallbackImageIndex];
                return {
                  ...slide,
                  imageUrl: `${fallbackImage.urls.regular}?w=800&q=80&fit=crop`,
                  imageAlt: `Illustration for ${topic}`,
                  photographer: fallbackImage.user?.name || 'Unknown',
                  unsplashUrl: fallbackImage.links.html
                };
              }
            }
            
            // Ultimate fallback
            return {
              ...slide,
              imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
              imageAlt: `Illustration for ${slide.heading}`,
              photographer: 'Unsplash',
              unsplashUrl: 'https://unsplash.com'
            };
          }
        } catch (error) {
          console.error('Error fetching from Unsplash:', error);
          
          // Return a reliable fallback image
          return {
            ...slide,
            imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
            imageAlt: `Illustration for ${slide.heading}`,
            photographer: 'Unsplash',
            unsplashUrl: 'https://unsplash.com'
          };
        }
      });
      
      // Wait for all image fetching to complete
      const slidesWithResolvedImages = await Promise.all(slidesWithImages);
      
      return slidesWithResolvedImages;
    },
    toolSchema: z.function()
      .args(z.object({ 
        topic: z.string().describe("Presentation topic"),
        slideCount: z.number().optional().describe("Number of slides (default: 5)")
      }))
      .returns(z.array(z.object({
        type: z.enum(["intro", "content", "outro"]),
        heading: z.string(),
        description: z.string(),
        imageUrl: z.string().optional(),
        imageAlt: z.string().optional(),
      }))),
  },
  
  {
    name: "search-unsplash-images",
    description: "Search Unsplash for relevant images based on slide content",
    tool: async (params: { query: string; slideType?: string }) => {
      const { query, slideType } = params;
      
      try {
        // Create search query based on slide content and type
        let searchQuery = query;
        
        // Enhance search query based on slide type
        if (slideType === "intro") {
          searchQuery = `${query} introduction overview`;
        } else if (slideType === "outro") {
          searchQuery = `${query} conclusion summary`;
        } else if (slideType === "content") {
          searchQuery = `${query} concept illustration`;
        }
        
        // Use Unsplash API to search for images
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
              'Accept-Version': 'v1'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Unsplash API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const image = data.results[0]; // Get the first (most relevant) result
          return {
            imageUrl: `${image.urls.regular}?w=800&q=80&fit=crop`,
            imageAlt: image.alt_description || `Illustration for ${query}`,
            photographer: image.user?.name || 'Unknown',
            unsplashUrl: image.links.html
          };
        } else {
          // Fallback to a generic search
          const fallbackResponse = await fetch(
            `https://api.unsplash.com/search/photos?query=presentation&per_page=1&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                'Accept-Version': 'v1'
              }
            }
          );
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.results && fallbackData.results.length > 0) {
              const fallbackImage = fallbackData.results[0];
              return {
                imageUrl: `${fallbackImage.urls.regular}?w=800&q=80&fit=crop`,
                imageAlt: `Generic presentation illustration`,
                photographer: fallbackImage.user?.name || 'Unknown',
                unsplashUrl: fallbackImage.links.html
              };
            }
          }
          
          // Ultimate fallback
          return {
            imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
            imageAlt: `Illustration for ${query}`,
            photographer: 'Unsplash',
            unsplashUrl: 'https://unsplash.com'
          };
        }
      } catch (error) {
        console.error('Error fetching from Unsplash:', error);
        
        // Return a reliable fallback image
        return {
          imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
          imageAlt: `Illustration for ${query}`,
          photographer: 'Unsplash',
          unsplashUrl: 'https://unsplash.com'
        };
      }
    },
    toolSchema: z.function()
      .args(z.object({ 
        query: z.string().describe("Search query for finding relevant images"),
        slideType: z.string().optional().describe("Type of slide to enhance search relevance")
      }))
      .returns(z.object({
        imageUrl: z.string(),
        imageAlt: z.string(),
        photographer: z.string(),
        unsplashUrl: z.string(),
      })),
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
  },
  {
    name: "SlidesGenerator",
    description: "A component that displays an interactive slide presentation with navigation",
    component: SlidesGenerator,
    propsSchema: z.object({
      title: z.string().describe("The presentation title"),
      theme: z.enum(["light", "dark", "blue", "purple"]).optional().describe("Visual theme"),
      slides: z.array(
        z.object({
          type: z.enum(["intro", "content", "outro"]).describe("Type of slide"),
          heading: z.string().describe("Slide heading/title"),
          description: z.string().describe("Slide content/description"),
          imageUrl: z.string().optional().describe("URL for slide image"),
          imageAlt: z.string().optional().describe("Alt text for image"),
        })
      ).describe("Array of slides in the presentation"),
    }),
  }
  // Add more components here
];
