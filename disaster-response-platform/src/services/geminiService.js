const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/database');
const logger = require('../config/logger');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache TTL in seconds
const CACHE_TTL = process.env.CACHE_TTL || 3600;

const extractLocation = async (description) => {
  try {
    // Check cache first
    const cacheKey = `location_extract_${Buffer.from(description).toString('base64')}`;
    const { data: cachedResult } = await supabase
      .from('cache')
      .select('value')
      .eq('key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      return cachedResult.value;
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create prompt for location extraction
    const prompt = `Extract the location name from the following disaster description. Return only the location name in a simple format like "City, State" or "City, Country". If multiple locations are mentioned, return the primary one. If no location is found, return null.

Description: ${description}`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const location = response.text().trim();

    // Cache the result
    await supabase.from('cache').upsert({
      key: cacheKey,
      value: location,
      expires_at: new Date(Date.now() + CACHE_TTL * 1000).toISOString()
    });

    return location;
  } catch (error) {
    console.error('Error extracting location:', error);
    throw error;
  }
};

/**
 * Verify an image for disaster context and authenticity
 * @param {string} imageUrl - URL of the image to verify
 * @param {string} disasterContext - Context about the disaster
 * @returns {Promise<Object>} Verification results
 */
async function verifyImage(imageUrl, disasterContext) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct the prompt
        const prompt = `Analyze this image in the context of a disaster situation: ${disasterContext}
        Please verify:
        1. If the image appears to be authentic and not manipulated
        2. If the image content matches the described disaster context
        3. If there are any signs of the image being staged or fake
        4. The severity level of the situation shown (low/medium/high)
        
        Provide your analysis in a structured format.`;

        // Generate content
        const result = await model.generateContent([prompt, imageUrl]);
        const response = await result.response;
        const text = response.text();

        // Parse the response to extract verification details
        const verificationResult = {
            isAuthentic: text.toLowerCase().includes('authentic') && !text.toLowerCase().includes('not authentic'),
            matchesContext: text.toLowerCase().includes('matches') && !text.toLowerCase().includes('does not match'),
            severity: text.toLowerCase().includes('high') ? 'high' : 
                     text.toLowerCase().includes('medium') ? 'medium' : 'low',
            analysis: text,
            verifiedAt: new Date().toISOString()
        };

        logger.info('Image verification completed', { 
            imageUrl, 
            isAuthentic: verificationResult.isAuthentic,
            severity: verificationResult.severity 
        });

        return verificationResult;
    } catch (error) {
        logger.error('Error in image verification:', { error: error.message });
        throw new Error('Failed to verify image: ' + error.message);
    }
}

module.exports = {
  extractLocation,
  verifyImage
}; 