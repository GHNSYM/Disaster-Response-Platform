const axios = require('axios');
const { supabase } = require('../config/database');

// Cache TTL in seconds
const CACHE_TTL = process.env.CACHE_TTL || 3600;

const geocodeLocation = async (locationName) => {
  try {
    // Check cache first
    const cacheKey = `geocode_${Buffer.from(locationName).toString('base64')}`;
    const { data: cachedResult } = await supabase
      .from('cache')
      .select('value')
      .eq('key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedResult) {
      return cachedResult.value;
    }

    // Use OpenStreetMap Nominatim for geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: locationName,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'DisasterResponsePlatform/1.0 (ghanshyamcharger2@gmail.com)' // Replace with your GitHub repo or contact info
      }
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Geocoding failed: No results found for ${locationName}`);
    }

    const result = response.data[0];
    const coordinates = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      formatted_address: result.display_name
    };

    // Cache the result
    await supabase.from('cache').upsert({
      key: cacheKey,
      value: coordinates,
      expires_at: new Date(Date.now() + CACHE_TTL * 1000).toISOString()
    });

    return coordinates;
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw error;
  }
};

const findNearbyResources = async (lat, lng, radiusKm = 10) => {
  try {
    // Convert radius from kilometers to meters
    const radiusMeters = radiusKm * 1000;

    // Query resources within radius using PostGIS
    const { data: resources, error } = await supabase
      .rpc('find_nearby_resources', {
        p_lat: lat,
        p_lng: lng,
        p_radius: radiusMeters
      });

    if (error) throw error;

    return resources;
  } catch (error) {
    console.error('Error finding nearby resources:', error);
    throw error;
  }
};

module.exports = {
  geocodeLocation,
  findNearbyResources
}; 