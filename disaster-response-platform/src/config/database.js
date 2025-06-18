const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    logger.error('Missing Supabase configuration. Please check your .env file.');
    throw new Error('Missing Supabase configuration');
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true
        }
    }
);

// Test database connection
async function testConnection() {
    try {
        const { data, error } = await supabase.from('disasters').select('count').limit(1);
        if (error) throw error;
        logger.info('Successfully connected to Supabase');
        return true;
    } catch (error) {
        logger.error('Failed to connect to Supabase:', error);
        return false;
    }
}

module.exports = {
    supabase,
    testConnection
};