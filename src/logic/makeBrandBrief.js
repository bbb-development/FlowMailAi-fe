import { scrape } from './scraper.js';
import { gemini } from './geminiChat.js';

function extractHexCode(colorString) {
    // Match any 6-digit hex code with # prefix
    const hexMatch = colorString.match(/#[0-9A-Fa-f]{6}/);
    if (hexMatch) {
        return hexMatch[0];
    }
    // If no valid hex code found, return a default color
    return '#000000';
}

function cleanBrandColors(brandBrief) {
    if (brandBrief && brandBrief.brandColors) {
        return {
            ...brandBrief,
            brandColors: {
                primary: extractHexCode(brandBrief.brandColors.primary),
                secondary: extractHexCode(brandBrief.brandColors.secondary),
                tertiary: extractHexCode(brandBrief.brandColors.tertiary)
            }
        };
    }
    return brandBrief;
}

function extractBrandBrief(jsonString) {
    try {
        // Remove any potential markdown code block indicators
        const cleanJson = jsonString.replace(/```json|```/g, '').trim();
        // Parse the JSON
        const brandBrief = JSON.parse(cleanJson);
        return brandBrief;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

async function makeBrandBrief(url) {
    console.log("Starting website analysis...");
    const scrapeResult = await scrape('scrape', url);
    const response = await gemini(`
        Create a brand brief answering the following questions: 
        Who is the brand? 
        Who is their audience? 
        How do they speak to them? 
        Also, identify the key 3 brand colors, specifying primary and secondary colors.
        Write no more than 100 words for each question.
        Return a JSON object with the following keys:
        - brandName
        - brandDescription
        - brandAudience
        - brandTone
        - brandMessage
        - brandColors
           - primary (use only hex color code format, e.g. #FF0000)
           - secondary (use only hex color code format, e.g. #00FF00)
           - tertiary (use only hex color code format, e.g. #0000FF)
        Here is the website content: ${JSON.stringify(scrapeResult)}`);
    
    const brandBrief = extractBrandBrief(response);
    if (brandBrief) {
        const cleanedBrief = cleanBrandColors(brandBrief);
        //console.log('Parsed Brand Brief:', JSON.stringify(cleanedBrief, null, 2));
        return cleanedBrief;
    }
    throw new Error('Failed to parse brand brief');
}

export { makeBrandBrief };
