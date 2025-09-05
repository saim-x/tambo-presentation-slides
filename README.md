# Presentation Generator Template

A professional presentation generator built with Next.js and Tambo AI that creates content-rich slides with integrated images.

## Overview

This template provides a complete solution for generating professional presentations with AI-powered content creation. It includes pre-defined templates, dynamic content generation, and a beautiful slideshow interface.

## Installation

### Option 1: Fork and Clone (Recommended)
1. Fork this repository to your GitHub account
2. Clone your forked repository:
```bash
git clone https://github.com/saim-x/tambo-presentation-slides
cd tambo-presentation-slides
```

### Option 2: Manual Setup
1. Create a new Tambo app:
```bash
npm create tambo-app@latest my-presentation-app
cd my-presentation-app
```

2. Replace the default files with the custom presentation generator files:
   - Copy the provided `tambo.ts` to `src/lib/tambo.ts`
   - Create `src/components/slide-generator.tsx` with the provided code

3. Install dependencies:
```bash
npm install
```

4. Initialize Tambo (automatically configures your API key):
```bash
npx tambo init
```

## Configuration

Add your Unsplash Access Key to `.env.local`:
```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000)

3. Request presentations using natural language:
   - "Create a market analysis presentation"
   - "Generate a product launch deck with 5 slides"
   - "Make a technology presentation about AI"

## Features

- AI-powered content generation for any topic
- Pre-defined templates for business, technology, and education
- Integrated Unsplash image search
- Professional slideshow interface with smooth animations
- Multiple themes and customization options
- Keyboard navigation and fullscreen mode

## Customization

Modify presentation templates in `src/lib/tambo.ts`:
- Add new domains and topics
- Customize slide content and structure
- Adjust image search keywords

## Support

For more detailed documentation, visit [Tambo's official docs](https://docs.tambo.co).
