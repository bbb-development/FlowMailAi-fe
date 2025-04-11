// Install with npm install @mendable/firecrawl-js
import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

const app = new FireCrawlApp({apiKey: import.meta.env.VITE_FIRECRAWL_API_KEY});

async function extractMethod(url) {
  console.log("Starting brand brief extraction...");
  
  const schema = z.object({
    brand_brief: z.object({
      brand_identity: z.string(),
      activities: z.string(),
      audience: z.string(),
      communication_style: z.string(),
      brand_colors: z.object({
        primary: z.string().optional(),
        secondary: z.string().optional()
      })
    })
  });

  const extractResult = await app.extract([
    url
  ], {
    prompt: "Extract a brand brief answering the following questions: Who is the brand? What do they do? Who is their audience? How do they speak to them? Identify the brand colors, specifying primary and secondary colors. make ",
    schema,
  });

  return extractResult;
}

async function scrapeMethod(url) {
  const scrapeResult = await app.scrapeUrl(url, {
    formats: ["html"],
  });

  return scrapeResult;
}

async function scrape(method, url) {
  try {
    let result;

    if (method === 'extract') {
      result = await extractMethod(url);
      //console.log('Brand Brief Results:', JSON.stringify(result, null, 2));
    } else if (method === 'scrape') {
      result = await scrapeMethod(url);
      //console.log('Website Scrape Results:', JSON.stringify(result, null, 2));
    } else {
      throw new Error('Invalid method. Please use "extract" or "scrape"');
    }

    return result;
  } catch (error) {
    console.error('Error during operation:', error);
  }
}

// Export the functions
export {
    extractMethod,
    scrapeMethod,
    scrape
};