// API endpoint pour récupérer les informations additionnelles du fichier markdown
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
    // Permettre seulement les requêtes GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Lire le fichier markdown depuis la racine du projet
        const filePath = join(process.cwd(), 'Benoit - Surplus info pour chatbot.md');
        const content = readFileSync(filePath, 'utf-8');

        return res.status(200).json({ content });
    } catch (error) {
        console.error('Error reading additional info file:', error);
        // Retourner une chaîne vide si le fichier n'existe pas ou ne peut pas être lu
        return res.status(200).json({ content: '' });
    }
}
