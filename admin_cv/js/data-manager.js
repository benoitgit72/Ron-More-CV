// ============================================
// Module de gestion des données CRUD
// ============================================

/**
 * Récupère les informations personnelles du CV
 */
async function getCVInfo(userId) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('cv_info')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération du CV:', error);
        throw error;
    }
}

/**
 * Crée ou met à jour les informations personnelles
 */
async function upsertCVInfo(userId, cvInfo) {
    try {
        const supabase = getSupabaseClient();

        // Check if record exists
        const existing = await getCVInfo(userId);

        if (existing) {
            // Update
            const { data, error } = await supabase
                .from('cv_info')
                .update({ ...cvInfo, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('cv_info')
                .insert([{ ...cvInfo, user_id: userId }])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du CV:', error);
        throw error;
    }
}

/**
 * Récupère toutes les expériences
 */
async function getExperiences(userId) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('experiences')
            .select('*')
            .eq('user_id', userId)
            .order('ordre', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des expériences:', error);
        throw error;
    }
}

/**
 * Crée une nouvelle expérience
 */
async function createExperience(userId, experience) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('experiences')
            .insert([{ ...experience, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la création de l\'expérience:', error);
        throw error;
    }
}

/**
 * Met à jour une expérience
 */
async function updateExperience(id, experience) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('experiences')
            .update({ ...experience, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'expérience:', error);
        throw error;
    }
}

/**
 * Supprime une expérience
 */
async function deleteExperience(id) {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('experiences')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'expérience:', error);
        throw error;
    }
}

/**
 * Récupère toutes les formations
 */
async function getFormations(userId) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('formations')
            .select('*')
            .eq('user_id', userId)
            .order('ordre', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        throw error;
    }
}

/**
 * Crée une nouvelle formation
 */
async function createFormation(userId, formation) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('formations')
            .insert([{ ...formation, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la création de la formation:', error);
        throw error;
    }
}

/**
 * Met à jour une formation
 */
async function updateFormation(id, formation) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('formations')
            .update({ ...formation, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la formation:', error);
        throw error;
    }
}

/**
 * Supprime une formation
 */
async function deleteFormation(id) {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('formations')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la formation:', error);
        throw error;
    }
}

/**
 * Récupère toutes les compétences
 */
async function getCompetences(userId) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('competences')
            .select('*')
            .eq('user_id', userId)
            .order('categorie', { ascending: true })
            .order('ordre', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
        throw error;
    }
}

/**
 * Crée une nouvelle compétence
 */
async function createCompetence(userId, competence) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('competences')
            .insert([{ ...competence, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la création de la compétence:', error);
        throw error;
    }
}

/**
 * Met à jour une compétence
 */
async function updateCompetence(id, competence) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('competences')
            .update({ ...competence, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la compétence:', error);
        throw error;
    }
}

/**
 * Supprime une compétence
 */
async function deleteCompetence(id) {
    try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
            .from('competences')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la compétence:', error);
        throw error;
    }
}

/**
 * Met à jour le profil (slug, formspree_id, etc.)
 */
async function updateProfile(userId, updates) {
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        throw error;
    }
}
