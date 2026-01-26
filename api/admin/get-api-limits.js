// ============================================
// GET API Limits (Admin Only)
// Récupère toutes les limites API configurées
// ============================================

import { createClient } from '@supabase/supabase-js';

// Utiliser la clé ANON (publique) - RLS policies vont gérer les permissions
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://btcdbewqypejzmlwwedz.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0Y2RiZXdxeXBlanptbHd3ZWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MzYwOTUsImV4cCI6MjA4NDUxMjA5NX0.YL7UuvIE9DGdvfjGHNk3JvV2Go7hB83eNMvx2h6mjvw';

export default async function handler(req, res) {
    // Méthode autorisée: GET uniquement
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
            allowedMethods: ['GET']
        });
    }

    try {
        // Vérifier l'authentification
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authorization header required'
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // Créer un client Supabase avec le token de l'utilisateur
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        // Vérifier le token et obtenir l'utilisateur
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth error:', authError);
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
        }

        // Vérifier que l'utilisateur est admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            console.error('Profile error:', profileError);
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Profile not found'
            });
        }

        if (!profile.is_admin) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required'
            });
        }

        // Récupérer toutes les limites
        const { data: limits, error: limitsError } = await supabase
            .from('api_limits')
            .select('*')
            .order('feature_name');

        if (limitsError) {
            console.error('Error fetching limits:', limitsError);
            throw limitsError;
        }

        console.log(`✅ API limits fetched successfully by admin ${user.email}`);

        return res.status(200).json({
            success: true,
            limits: limits || [],
            count: limits ? limits.length : 0
        });

    } catch (error) {
        console.error('❌ Error in get-api-limits:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
