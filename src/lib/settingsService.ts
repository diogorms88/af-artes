import { supabase } from './supabase';

export interface SiteSettings {
    id: string;
    whatsapp_number: string;
    whatsapp_message: string;
    shopee_link: string;
    instagram_link: string;
}

export const fetchSettings = async (): Promise<SiteSettings | null> => {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .single(); // Assumes only one row for settings

        if (error) {
            console.error('Error fetching settings:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error fetching settings:', err);
        return null;
    }
};

export const updateSettings = async (settings: Partial<SiteSettings>) => {
    try {
        // First, check if a row exists
        const { data: existingData } = await supabase.from('site_settings').select('id').single();

        if (existingData) {
            // Update existing
            const { error } = await supabase
                .from('site_settings')
                .update(settings)
                .eq('id', existingData.id);

            if (error) throw error;
        } else {
            // Insert new (should rarely happen if migration ran)
            const { error } = await supabase
                .from('site_settings')
                .insert([settings]);

            if (error) throw error;
        }

    } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
    }
};
