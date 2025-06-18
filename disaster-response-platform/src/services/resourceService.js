const logger = require('../config/logger');

/**
 * Generate mock resources near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Array>} Array of resources
 */
async function findNearbyResources(lat, lng, radiusKm = 10) {
    try {
        // Generate 5-10 random resources within the radius
        const numResources = Math.floor(Math.random() * 6) + 5;
        const resources = [];

        for (let i = 0; i < numResources; i++) {
            // Generate random offset within radius
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * radiusKm;
            const resourceLat = lat + (distance * Math.cos(angle) / 111.32); // 111.32 km per degree
            const resourceLng = lng + (distance * Math.sin(angle) / (111.32 * Math.cos(lat * Math.PI / 180)));

            // Generate random resource type
            const types = ['Shelter', 'Medical', 'Food', 'Water', 'Transport'];
            const type = types[Math.floor(Math.random() * types.length)];

            // Generate resource name based on type
            const names = {
                'Shelter': ['Emergency Shelter', 'Community Center', 'School Gym'],
                'Medical': ['Medical Camp', 'First Aid Station', 'Mobile Clinic'],
                'Food': ['Food Distribution Center', 'Community Kitchen', 'Supply Point'],
                'Water': ['Water Distribution Point', 'Water Purification Unit', 'Water Tank'],
                'Transport': ['Transport Hub', 'Vehicle Pool', 'Evacuation Point']
            };

            const name = names[type][Math.floor(Math.random() * names[type].length)];

            resources.push({
                id: `resource_${i + 1}`,
                name,
                type,
                lat: resourceLat,
                lng: resourceLng,
                distance: distance,
                status: 'available',
                capacity: Math.floor(Math.random() * 100) + 50
            });
        }

        // Sort by distance
        resources.sort((a, b) => a.distance - b.distance);

        logger.info('Generated mock resources', {
            count: resources.length,
            center: { lat, lng },
            radius: radiusKm
        });

        return resources;
    } catch (error) {
        logger.error('Error generating mock resources:', error);
        throw error;
    }
}

module.exports = {
    findNearbyResources
}; 