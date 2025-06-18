const { supabase } = require('../config/database');
const { getIO } = require('../services/socketService');
const logger = require('../config/logger');

/**
 * Create a new disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createDisaster(req, res) {
    try {
        const { title, description, location_name, latitude, longitude, severity } = req.body;

        // Validate required fields
        if (!title || !location_name) {
            return res.status(400).json({ error: 'Title and location are required' });
        }

        // Insert disaster into database
        const { data, error } = await supabase
            .from('disasters')
            .insert([{
                title,
                description,
                location_name,
                latitude,
                longitude,
                severity: severity || 'medium'
            }])
            .select()
            .single();

        if (error) throw error;

        // Emit real-time update
        getIO().emit('disaster_created', data);

        logger.info('Disaster created successfully', { id: data.id });
        res.status(201).json(data);
    } catch (error) {
        logger.error('Error creating disaster:', error);
        res.status(500).json({ error: 'Failed to create disaster' });
    }
}

/**
 * Get all disasters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getDisasters(req, res) {
    try {
        const { data, error } = await supabase
            .from('disasters')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        logger.error('Error fetching disasters:', error);
        res.status(500).json({ error: 'Failed to fetch disasters' });
    }
}

/**
 * Get a specific disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getDisaster(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('disasters')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Disaster not found' });
        }

        res.json(data);
    } catch (error) {
        logger.error('Error fetching disaster:', error);
        res.status(500).json({ error: 'Failed to fetch disaster' });
    }
}

/**
 * Update a disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateDisaster(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('disasters')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ error: 'Disaster not found' });
        }

        // Emit real-time update
        getIO().emit('disaster_updated', data);

        logger.info('Disaster updated successfully', { id });
        res.json(data);
    } catch (error) {
        logger.error('Error updating disaster:', error);
        res.status(500).json({ error: 'Failed to update disaster' });
    }
}

/**
 * Delete a disaster
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteDisaster(req, res) {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('disasters')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Emit real-time update
        getIO().emit('disaster_deleted', { id });

        logger.info('Disaster deleted successfully', { id });
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting disaster:', error);
        res.status(500).json({ error: 'Failed to delete disaster' });
    }
}

module.exports = {
    createDisaster,
    getDisasters,
    getDisaster,
    updateDisaster,
    deleteDisaster
}; 