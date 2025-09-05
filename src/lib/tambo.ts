/**
 * @file tambo.ts
 * @description Enhanced Tambo configuration for professional presentation generation
 * 
 * This configuration focuses on business and educational presentations with
 * rich, contextual content generation and proper image integration.
 */

import { TamboComponent, TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import SlidesGenerator from '@/components/slide-generator';

// Expanded presentation templates for different domains
const PRESENTATION_TEMPLATES = {
  business: {
    "market analysis": {
      title: "Comprehensive Market Analysis",
      slides: [
        {
          type: "intro",
          heading: "Market Analysis: Industry Overview",
          description: "In-depth analysis of market dynamics, competitive landscape, and growth opportunities in our target sector. This presentation examines key trends, market size, and strategic positioning.",
          keywords: ["market analysis", "business strategy", "data visualization", "industry trends"]
        },
        {
          type: "content",
          heading: "Market Size & Growth Projections",
          description: "The total addressable market is valued at $500 billion with a CAGR of 7.2%. Key growth drivers include digital transformation, changing consumer behavior, and emerging technologies like AI and blockchain.",
          keywords: ["market growth", "financial charts", "business metrics", "growth projections"]
        },
        {
          type: "content",
          heading: "Competitive Landscape Analysis",
          description: "Analysis reveals 5 major players controlling 60% market share. Key differentiators include pricing strategy, product features, and customer service excellence. Opportunities exist in underserved segments.",
          keywords: ["competition analysis", "market share", "business competitors", "swot analysis"]
        },
        {
          type: "content",
          heading: "Target Customer Segmentation",
          description: "Primary segments include enterprise clients (40%), SMBs (35%), and individual professionals (25%). Each segment demonstrates distinct needs, purchasing behaviors, and growth potential.",
          keywords: ["customer segments", "target audience", "demographics", "buyer personas"]
        },
        {
          type: "outro",
          heading: "Strategic Recommendations & Action Plan",
          description: "Recommend focusing on underserved segments, leveraging technology for competitive advantage, and building strategic partnerships. Implementation timeline: 6-12 months for initial results.",
          keywords: ["business strategy", "action plan", "strategic recommendations", "next steps"]
        }
      ]
    },
    "product launch": {
      title: "Product Launch Strategy Presentation",
      slides: [
        {
          type: "intro",
          heading: "Introducing Our Revolutionary Product",
          description: "A breakthrough solution designed to transform how businesses operate and compete in the digital age. This product addresses critical pain points with innovative technology.",
          keywords: ["product launch", "innovation", "new technology", "product introduction"]
        },
        {
          type: "content",
          heading: "The Problem We Solve",
          description: "Businesses lose approximately 30% productivity due to inefficient processes. Current solutions are fragmented and expensive. Our product addresses these challenges with intelligent automation.",
          keywords: ["business problem", "solution overview", "pain points", "market need"]
        },
        {
          type: "content",
          heading: "Key Features & Competitive Advantages",
          description: "AI-powered analytics, real-time collaboration, enterprise-grade security, and proven 50% reduction in operational costs. Unique selling proposition: seamless integration with existing systems.",
          keywords: ["product features", "competitive advantage", "benefits", "unique selling points"]
        },
        {
          type: "content",
          heading: "Go-to-Market Strategy",
          description: "Phased rollout starting with key markets. Marketing budget: $2M. Sales strategy: direct sales for enterprise, channel partners for SMBs. Projected customer acquisition cost: $350.",
          keywords: ["marketing strategy", "go to market", "sales plan", "launch timeline"]
        },
        {
          type: "outro",
          heading: "Launch Timeline & Success Metrics",
          description: "Beta launch in Q2, full release in Q3. Key metrics: 1,000 customers in first year, $5M revenue. Early access program available with exclusive benefits for founding partners.",
          keywords: ["timeline", "success metrics", "kpis", "launch plan"]
        }
      ]
    },
    "financial report": {
      title: "Quarterly Financial Performance Report",
      slides: [
        {
          type: "intro",
          heading: "Q3 Financial Performance Overview",
          description: "Comprehensive review of financial performance, key metrics, and strategic insights for the third quarter. Highlights include revenue growth, profitability, and market position.",
          keywords: ["financial report", "quarterly results", "revenue", "performance metrics"]
        },
        {
          type: "content",
          heading: "Revenue Analysis & Growth Trends",
          description: "Total revenue reached $125M, representing 15% year-over-year growth. Key drivers: new customer acquisition (35%), expansion of existing accounts (45%), and new product lines (20%).",
          keywords: ["revenue analysis", "financial growth", "business performance", "sales metrics"]
        },
        {
          type: "content",
          heading: "Profitability & Cost Management",
          description: "Operating margin improved to 22% through optimized operations and cost controls. EBITDA reached $28M, exceeding projections by 8%. Cost of goods sold decreased by 5% through supplier negotiations.",
          keywords: ["profitability", "cost management", "financial metrics", "operational efficiency"]
        },
        {
          type: "content",
          heading: "Market Position & Competitive Analysis",
          description: "Maintained #2 market position with 18% market share. Gained 3 percentage points against main competitor. Customer satisfaction scores reached all-time high of 92%.",
          keywords: ["market position", "competitive analysis", "market share", "customer satisfaction"]
        },
        {
          type: "outro",
          heading: "Forward Outlook & Strategic Initiatives",
          description: "Q4 projections: $140M revenue with 20% growth. Strategic initiatives: expansion into Asian markets, new product launch in Q1, and continued operational optimization.",
          keywords: ["business outlook", "strategic initiatives", "forecasting", "future planning"]
        }
      ]
    },
    "business strategy": {
      title: "Strategic Business Plan Presentation",
      slides: [
        {
          type: "intro",
          heading: "3-Year Strategic Business Plan",
          description: "Comprehensive roadmap outlining our vision, strategic priorities, and growth initiatives for the next three years. Focus on market expansion, innovation, and operational excellence.",
          keywords: ["business strategy", "strategic planning", "growth initiatives", "vision"]
        },
        {
          type: "content",
          heading: "Market Opportunity & Growth Strategy",
          description: "Addressing a $250B market opportunity with focused expansion in high-growth segments. Strategy: penetrate existing markets deeper while expanding geographically into 3 new regions.",
          keywords: ["market opportunity", "growth strategy", "business expansion", "market penetration"]
        },
        {
          type: "content",
          heading: "Innovation & Product Roadmap",
          description: "$50M investment in R&D over 3 years. Key initiatives: AI-powered platform enhancements, mobile-first solutions, and integration capabilities. 6 major product releases planned.",
          keywords: ["innovation", "product roadmap", "research development", "technology"]
        },
        {
          type: "content",
          heading: "Operational Excellence Initiatives",
          description: "Targeting 30% improvement in operational efficiency through automation, process optimization, and technology upgrades. Expected to deliver $45M in cost savings over 3 years.",
          keywords: ["operational excellence", "process optimization", "automation", "efficiency"]
        },
        {
          type: "outro",
          heading: "Implementation Timeline & Success Metrics",
          description: "Phased implementation over 12 quarters. Key metrics: 25% CAGR, 35% market share target, 50% increase in customer base. Quarterly reviews with board to track progress.",
          keywords: ["implementation", "timeline", "success metrics", "performance indicators"]
        }
      ]
    }
  },
  technology: {
    "ai transformation": {
      title: "AI Transformation Strategy",
      slides: [
        {
          type: "intro",
          heading: "AI-Powered Digital Transformation Journey",
          description: "How artificial intelligence is revolutionizing business operations, customer experiences, and decision-making across industries. This presentation outlines our AI adoption strategy.",
          keywords: ["artificial intelligence", "digital transformation", "machine learning", "ai strategy"]
        },
        {
          type: "content",
          heading: "Current AI Applications & Use Cases",
          description: "Successful implementations include predictive maintenance (30% reduction in downtime), customer service automation (40% cost reduction), and personalized marketing (25% conversion increase).",
          keywords: ["ai applications", "use cases", "machine learning", "automation"]
        },
        {
          type: "content",
          heading: "Implementation Roadmap & Timeline",
          description: "Phase 1: Pilot projects (3-6 months). Phase 2: Department-wide implementation (6-12 months). Phase 3: Enterprise rollout (12-24 months). Total investment: $5M with expected ROI within 18 months.",
          keywords: ["implementation plan", "roadmap", "timeline", "project planning"]
        },
        {
          type: "content",
          heading: "Technology Stack & Infrastructure",
          description: "Cloud-based AI platform, modular architecture, API-first design. Key technologies: TensorFlow, PyTorch, AWS SageMaker. Data infrastructure: Snowflake for data warehousing.",
          keywords: ["technology stack", "infrastructure", "cloud computing", "ai platform"]
        },
        {
          type: "outro",
          heading: "Expected Outcomes & Success Metrics",
          description: "Target outcomes: 40% process automation, 25% cost reduction, 30% revenue growth from AI-enabled products. Success measured through quarterly business reviews and KPI tracking.",
          keywords: ["expected outcomes", "success metrics", "roi", "performance indicators"]
        }
      ]
    },
    "cloud migration": {
      title: "Cloud Migration Strategy & Implementation",
      slides: [
        {
          type: "intro",
          heading: "Enterprise Cloud Migration Initiative",
          description: "Comprehensive plan for migrating our infrastructure and applications to the cloud. Focus on security, scalability, and cost optimization while minimizing business disruption.",
          keywords: ["cloud migration", "cloud computing", "digital transformation", "infrastructure"]
        },
        {
          type: "content",
          heading: "Migration Strategy & Approach",
          description: "Hybrid approach: rehost (40%), refactor (35%), rearchitect (25%). Prioritized by business criticality and complexity. Phased migration over 18 months with fallback options.",
          keywords: ["migration strategy", "cloud adoption", "transformation", "implementation"]
        },
        {
          type: "content",
          heading: "Technology Stack & Cloud Architecture",
          description: "Multi-cloud strategy with AWS (60%) and Azure (40%). Containerized applications with Kubernetes. Infrastructure as Code using Terraform. Zero-trust security model implemented.",
          keywords: ["cloud architecture", "technology stack", "multi-cloud", "security"]
        },
        {
          type: "content",
          heading: "Cost-Benefit Analysis & ROI Projections",
          description: "35% reduction in infrastructure costs. 60% improvement in deployment speed. 99.9% uptime guarantee. Expected ROI: 210% over 3 years with payback in 14 months.",
          keywords: ["cost benefit analysis", "roi", "business case", "financial metrics"]
        },
        {
          type: "outro",
          heading: "Implementation Timeline & Risk Mitigation",
          description: "6-phase implementation over 18 months. Risk mitigation: comprehensive testing, gradual cutover, and rollback plans. Change management program for smooth transition.",
          keywords: ["implementation timeline", "risk mitigation", "project management", "change management"]
        }
      ]
    },
    "cybersecurity": {
      title: "Cybersecurity Strategy & Threat Protection",
      slides: [
        {
          type: "intro",
          heading: "Comprehensive Cybersecurity Framework",
          description: "Proactive approach to cybersecurity focusing on threat prevention, detection, and response. Addressing evolving threats in today's digital landscape with enterprise-grade protection.",
          keywords: ["cybersecurity", "threat protection", "information security", "risk management"]
        },
        {
          type: "content",
          heading: "Current Threat Landscape Analysis",
          description: "73% increase in sophisticated phishing attacks. Ransomware incidents up 45%. Cloud vulnerabilities represent 60% of new attack vectors. Zero-day exploits increased by 32%.",
          keywords: ["threat landscape", "risk assessment", "security threats", "vulnerabilities"]
        },
        {
          type: "content",
          heading: "Security Framework & Defense Strategy",
          description: "Defense-in-depth approach with 5 security layers. Zero-trust architecture implemented. Real-time threat intelligence feeds. 24/7 SOC monitoring with automated response playbooks.",
          keywords: ["security framework", "defense strategy", "zero trust", "threat intelligence"]
        },
        {
          type: "content",
          heading: "Incident Response & Recovery Planning",
          description: "Average detection time reduced to 15 minutes. Response time under 30 minutes. 99% recovery success rate with maximum 4-hour recovery time objective for critical systems.",
          keywords: ["incident response", "recovery planning", "disaster recovery", "business continuity"]
        },
        {
          type: "outro",
          heading: "Security Roadmap & Investment Plan",
          description: "$8M investment over 2 years. Key initiatives: AI-powered threat detection, security awareness training, and advanced endpoint protection. Targeting 95% reduction in security incidents.",
          keywords: ["security roadmap", "investment plan", "future initiatives", "security goals"]
        }
      ]
    }
  },
  education: {
    "teaching materials": {
      title: "Interactive Teaching Materials & Curriculum",
      slides: [
        {
          type: "intro",
          heading: "Innovative Teaching Methodology & Materials",
          description: "Modern approach to education combining traditional pedagogy with technology-enhanced learning. Focus on engagement, retention, and practical application of knowledge.",
          keywords: ["teaching materials", "education", "curriculum", "pedagogy"]
        },
        {
          type: "content",
          heading: "Learning Objectives & Outcomes",
          description: "Clear measurable outcomes: 90% mastery of core concepts, 85% improvement in critical thinking skills, and 75% increase in knowledge retention compared to traditional methods.",
          keywords: ["learning objectives", "educational outcomes", "skill development", "knowledge retention"]
        },
        {
          type: "content",
          heading: "Interactive Content & Engagement Strategies",
          description: "Gamified learning modules, virtual simulations, and collaborative projects. 40% increase in student engagement and 30% improvement in assessment scores with interactive content.",
          keywords: ["interactive content", "engagement strategies", "gamification", "active learning"]
        },
        {
          type: "content",
          heading: "Assessment Methods & Progress Tracking",
          description: "Multi-faceted assessment: formative (40%), summative (30%), and project-based (30%). Real-time progress dashboards for students and instructors with predictive analytics.",
          keywords: ["assessment methods", "progress tracking", "learning analytics", "evaluation"]
        },
        {
          type: "outro",
          heading: "Implementation Plan & Success Metrics",
          description: "Phased rollout starting with pilot program. Success metrics: student satisfaction >90%, 25% improvement in completion rates, and 35% reduction in achievement gaps.",
          keywords: ["implementation plan", "success metrics", "educational outcomes", "evaluation"]
        }
      ]
    }
  }
};

// Enhanced image collections with more specific keywords
const IMAGE_COLLECTIONS = {
  business: [
    "business presentation", "corporate meeting", "financial charts",
    "team collaboration", "business strategy", "data analysis",
    "professional office", "executive meeting", "market research"
  ],
  technology: [
    "artificial intelligence", "data visualization", "cloud computing",
    "software development", "cyber security", "innovation technology",
    "machine learning", "digital transformation", "tech office"
  ],
  education: [
    "classroom", "teaching", "learning", "education",
    "students", "school", "university", "books", "research"
  ]
};

// Common keywords for fallback content generation
const COMMON_KEYWORDS = {
  business: ["strategy", "growth", "market", "financial", "analysis", "planning", "performance"],
  technology: ["innovation", "digital", "technology", "software", "development", "cloud", "security"],
  education: ["learning", "teaching", "education", "knowledge", "skills", "development", "training"]
};

/**
 * Enhanced tools for presentation generation with image integration
 */
export const tools: TamboTool[] = [
  {
    name: "generate-presentation",
    description: "Generate a professional presentation with contextually relevant content and integrated images from Unsplash.",
    tool: async (params: { 
      topic: string; 
      domain?: string;
      slideCount?: number;
      includeImages?: boolean;
    }) => {
      const { topic, domain = "business", slideCount = 5, includeImages = true } = params;
      
      // Normalize topic for matching
      const topicLower = topic.toLowerCase().trim();
      
      // Find matching template
      let selectedTemplate = null;
      let selectedDomain = domain.toLowerCase() as keyof typeof PRESENTATION_TEMPLATES;
      
      // First, try exact match in the requested domain
      if (
        Object.prototype.hasOwnProperty.call(PRESENTATION_TEMPLATES, selectedDomain) &&
        Object.prototype.hasOwnProperty.call(PRESENTATION_TEMPLATES[selectedDomain], topicLower)
      ) {
        selectedTemplate = (PRESENTATION_TEMPLATES as any)[selectedDomain][topicLower];
      } else {
        // Search across all domains for partial matches
        for (const [domainKey, domainTemplates] of Object.entries(PRESENTATION_TEMPLATES)) {
          for (const [templateKey, template] of Object.entries(domainTemplates as Record<string, any>)) {
            if (topicLower.includes(templateKey) || templateKey.includes(topicLower)) {
              selectedTemplate = template;
              selectedDomain = domainKey as keyof typeof PRESENTATION_TEMPLATES;
              break;
            }
          }
          if (selectedTemplate) break;
        }
        
        // If still no match, try to find the closest template by keyword similarity
        if (!selectedTemplate) {
          for (const [domainKey, domainTemplates] of Object.entries(PRESENTATION_TEMPLATES)) {
            for (const [templateKey, template] of Object.entries(domainTemplates as Record<string, any>)) {
              const templateWords = templateKey.split(' ');
              const topicWords = topicLower.split(' ');
              
              // Check if any words match
              const matchingWords = templateWords.filter(word => 
                topicWords.some(topicWord => topicWord.includes(word) || word.includes(topicWord))
              );
              
              if (matchingWords.length > 0) {
                selectedTemplate = template;
                selectedDomain = domainKey as keyof typeof PRESENTATION_TEMPLATES;
                break;
              }
            }
            if (selectedTemplate) break;
          }
        }
      }
      
      // If no template found, generate dynamic content focused on the topic
      if (!selectedTemplate) {
        selectedTemplate = {
          title: `Presentation on ${formatTitle(topic)}`,
          slides: generateDynamicSlides(topic, domain, slideCount)
        };
      }
      
      // Trim to requested slide count
      const slides = selectedTemplate.slides.slice(0, slideCount);
      
      // Add images if requested
      if (includeImages) {
        const imageKeywords = IMAGE_COLLECTIONS[selectedDomain] || IMAGE_COLLECTIONS.business;
        
        // Enhance slides with image queries and suggested images
        const slidesWithImages = await Promise.all(slides.map(async (slide: any, index: number) => {
          // Use slide keywords or fallback to topic-based keywords
          const keywords = slide.keywords || [
            ...(slide.heading?.toLowerCase().split(' ') || []),
            ...(topic.toLowerCase().split(' ') || []),
            imageKeywords[index % imageKeywords.length]
          ].filter(k => k.length > 3); // Filter out short words
          
          const searchQuery = keywords.slice(0, 3).join(' ') || topic;
          
          try {
            // Search for relevant images using the tool
            const imageResults = await tools[1].tool({ query: searchQuery });
            return {
              ...slide,
              imageQuery: searchQuery,
              imageUrl: imageResults?.[0]?.urls?.regular || `https://source.unsplash.com/800x400/?${encodeURIComponent(searchQuery)}`,
              imageAlt: imageResults?.[0]?.alt_description || `${searchQuery} image`,
              photographer: imageResults?.[0]?.user?.name,
              unsplashUrl: imageResults?.[0]?.links?.html
            };
          } catch (error) {
            console.error("Error fetching image:", error);
            return {
              ...slide,
              imageQuery: searchQuery,
              suggestedImage: `https://source.unsplash.com/800x400/?${encodeURIComponent(searchQuery)}`
            };
          }
        }));
        
        return {
          title: selectedTemplate.title || formatTitle(topic),
          domain: selectedDomain,
          slides: slidesWithImages
        };
      }
      
      return {
        title: selectedTemplate.title || formatTitle(topic),
        domain: selectedDomain,
        slides
      };
    },
    toolSchema: z.function()
      .args(z.object({
        topic: z.string().describe("The main topic or title of the presentation"),
        domain: z.enum(["business", "technology", "education", "healthcare"]).optional()
          .describe("The domain/category of the presentation"),
        slideCount: z.number().min(3).max(10).optional()
          .describe("Number of slides to generate (3-10, default: 5)"),
        includeImages: z.boolean().optional()
          .describe("Whether to include relevant images (default: true)")
      }))
      .returns(z.object({
        title: z.string(),
        domain: z.string(),
        slides: z.array(z.object({
          type: z.enum(["intro", "content", "outro"]),
          heading: z.string(),
          description: z.string(),
          keywords: z.array(z.string()).optional(),
          imageQuery: z.string().optional(),
          imageUrl: z.string().optional(),
          imageAlt: z.string().optional(),
          photographer: z.string().optional(),
          unsplashUrl: z.string().optional()
        }))
      }))
  },
  
  {
    name: "search-unsplash-images",
    description: "Search for high-quality, professional images from Unsplash based on keywords",
    tool: async (params: { query: string; count?: number }) => {
      const { query, count = 1 } = params;
      const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
      
      if (!accessKey) {
        throw new Error("Unsplash access key not configured. Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your environment variables.");
      }
      
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${accessKey}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Unsplash API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
      } catch (error) {
        console.error("Error fetching images from Unsplash:", error);
        throw new Error("Failed to fetch images. Please check your API key and connection.");
      }
    },
    toolSchema: z.function()
      .args(z.object({
        query: z.string().describe("Search query for finding relevant images"),
        count: z.number().min(1).max(10).optional().describe("Number of images to return (1-10, default: 1)")
      }))
      .returns(z.array(z.object({
        id: z.string(),
        urls: z.object({
          regular: z.string(),
          small: z.string(),
          thumb: z.string()
        }),
        alt_description: z.string().optional(),
        user: z.object({
          name: z.string(),
          links: z.object({
            html: z.string()
          })
        }),
        links: z.object({
          html: z.string()
        })
      })))
  },
  
  {
    name: "get-presentation-templates",
    description: "Get available presentation templates and topics for quick generation",
    tool: () => {
      const templates = [];
      for (const [domain, domainTemplates] of Object.entries(PRESENTATION_TEMPLATES)) {
        for (const [topic, template] of Object.entries(domainTemplates)) {
          templates.push({
            domain,
            topic,
            title: template.title,
            slideCount: template.slides.length,
            description: `Professional ${topic} presentation for ${domain} domain`
          });
        }
      }
      return templates;
    },
    toolSchema: z.function()
      .returns(z.array(z.object({
        domain: z.string(),
        topic: z.string(),
        title: z.string(),
        slideCount: z.number(),
        description: z.string()
      })))
  },
  
  {
    name: "customize-slide-content",
    description: "Customize specific slide content with your own text and data",
    tool: (params: {
      slideIndex: number;
      heading?: string;
      description?: string;
      bulletPoints?: string[];
    }) => {
      const { slideIndex, heading, description, bulletPoints } = params;
      
      let formattedDescription = description || "";
      
      if (bulletPoints && bulletPoints.length > 0) {
        formattedDescription += "\n\nKey Points:\n" + bulletPoints.map(point => `• ${point}`).join("\n");
      }
      
      return {
        slideIndex,
        updated: true,
        heading: heading || "Custom Slide",
        description: formattedDescription,
        updatedAt: new Date().toISOString()
      };
    },
    toolSchema: z.function()
      .args(z.object({
        slideIndex: z.number().describe("Index of the slide to customize (0-based)"),
        heading: z.string().optional().describe("New heading for the slide"),
        description: z.string().optional().describe("New description/content"),
        bulletPoints: z.array(z.string()).optional().describe("Bullet points to include")
      }))
      .returns(z.object({
        slideIndex: z.number(),
        updated: z.boolean(),
        heading: z.string(),
        description: z.string(),
        updatedAt: z.string()
      }))
  }
];

/**
 * Helper function to generate dynamic slides for any topic with topic-focused content
 */
function generateDynamicSlides(topic: string, domain: string, count: number) {
  const slides = [];
  const domainKeywords = COMMON_KEYWORDS[domain as keyof typeof COMMON_KEYWORDS] || COMMON_KEYWORDS.business;
  
  // Intro slide - always focused on the specific topic
  slides.push({
    type: "intro" as const,
    heading: `Introduction to ${formatTitle(topic)}`,
    description: `Comprehensive overview of ${topic} covering key concepts, current trends, and practical applications in the ${domain} sector. This presentation provides valuable insights and actionable strategies specifically focused on ${topic}.`,
    keywords: [topic, domain, ...domainKeywords]
  });
  
  // Content slides - all focused on the topic
  const contentTopics = [
    {
      heading: `Current State of ${formatTitle(topic)}`,
      description: `Analysis of the current landscape of ${topic}, including recent developments, market dynamics, and the evolving ecosystem. This section examines how ${topic} is transforming the ${domain} industry.`,
      keywords: [topic, "current state", "analysis", "market dynamics", ...domainKeywords]
    },
    {
      heading: `Key Benefits of ${formatTitle(topic)}`,
      description: `Exploring the significant advantages and value proposition of ${topic}, including ROI potential, efficiency gains, and strategic benefits for organizations adopting ${topic} solutions.`,
      keywords: [topic, "benefits", "advantages", "value proposition", ...domainKeywords]
    },
    {
      heading: `Implementation Strategies for ${formatTitle(topic)}`,
      description: `Practical approaches and methodologies for successfully implementing ${topic} initiatives, including best practices, common pitfalls to avoid, and proven frameworks for ${topic} adoption.`,
      keywords: [topic, "implementation", "strategies", "best practices", ...domainKeywords]
    },
    {
      heading: `Challenges in ${formatTitle(topic)} Adoption`,
      description: `Identifying common challenges, barriers, and obstacles organizations face when adopting ${topic}, along with effective solutions, mitigation strategies, and risk management approaches.`,
      keywords: [topic, "challenges", "solutions", "risk management", ...domainKeywords]
    },
    {
      heading: `Case Studies: ${formatTitle(topic)} in Action`,
      description: `Real-world examples and success stories of organizations that have successfully implemented ${topic} solutions, demonstrating tangible results, lessons learned, and best practices.`,
      keywords: [topic, "case studies", "success stories", "examples", ...domainKeywords]
    },
    {
      heading: `Future of ${formatTitle(topic)}`,
      description: `Emerging trends, innovation opportunities, and future developments in ${topic}, including predictions for the next 3-5 years and how organizations can prepare for the evolution of ${topic}.`,
      keywords: [topic, "future trends", "innovation", "predictions", ...domainKeywords]
    }
  ];
  
  // Add content slides based on requested count, ensuring all are topic-focused
  const contentCount = Math.min(count - 2, contentTopics.length);
  for (let i = 0; i < contentCount; i++) {
    slides.push({
      type: "content" as const,
      ...contentTopics[i]
    });
  }
  
  // Outro slide - focused on the topic
  slides.push({
    type: "outro" as const,
    heading: `Conclusion: Next Steps for ${formatTitle(topic)}`,
    description: `Summary of key insights, strategic recommendations, and actionable next steps for implementing ${topic} initiatives. Includes timeline, resource requirements, and success metrics specifically for ${topic} projects.`,
    keywords: [topic, "conclusion", "next steps", "action plan", ...domainKeywords]
  });
  
  return slides.slice(0, count);
}

/**
 * Helper function to format topic titles
 */
function formatTitle(topic: string): string {
  return topic
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Components registration
 */
export const components: TamboComponent[] = [
  {
    name: "SlidesGenerator",
    description: "A professional presentation component with smooth transitions, navigation controls, and theme customization",
    component: SlidesGenerator,
    propsSchema: z.object({
      title: z.string().describe("Presentation title"),
      theme: z.enum(["light", "dark", "blue", "purple", "gradient"]).optional()
        .describe("Visual theme for the presentation"),
      slides: z.array(
        z.object({
          type: z.enum(["intro", "content", "outro"]).describe("Slide type"),
          heading: z.string().describe("Slide heading"),
          description: z.string().describe("Slide content"),
          imageUrl: z.string().optional().describe("Image URL for the slide"),
          imageAlt: z.string().optional().describe("Image alt text"),
          imageQuery: z.string().optional().describe("Search query used for the image"),
          photographer: z.string().optional().describe("Photographer name"),
          unsplashUrl: z.string().optional().describe("Unsplash URL for attribution")
        })
      ).describe("Array of slides with content and optional images"),
      autoPlay: z.boolean().optional().describe("Auto-advance slides"),
      showProgress: z.boolean().optional().describe("Show progress indicator")
    }),
  }
];