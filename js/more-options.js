// ============================================
// More Options Menu & PDF Download
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initMoreOptionsMenu();
    initPdfDownload();
});

/**
 * Initialize the more options menu
 */
function initMoreOptionsMenu() {
    const moreBtn = document.getElementById('moreOptionsBtn');
    const moreMenu = document.getElementById('moreOptionsMenu');

    if (!moreBtn || !moreMenu) return;

    // Toggle menu on button click
    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = moreBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            closeMoreOptionsMenu();
        } else {
            openMoreOptionsMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!moreMenu.contains(e.target) && !moreBtn.contains(e.target)) {
            closeMoreOptionsMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMoreOptionsMenu();
        }
    });
}

/**
 * Open the more options menu
 */
function openMoreOptionsMenu() {
    const moreBtn = document.getElementById('moreOptionsBtn');
    const moreMenu = document.getElementById('moreOptionsMenu');

    moreMenu.hidden = false;
    moreBtn.setAttribute('aria-expanded', 'true');
}

/**
 * Close the more options menu
 */
function closeMoreOptionsMenu() {
    const moreBtn = document.getElementById('moreOptionsBtn');
    const moreMenu = document.getElementById('moreOptionsMenu');

    moreMenu.hidden = true;
    moreBtn.setAttribute('aria-expanded', 'false');
}

/**
 * Initialize PDF download functionality
 */
function initPdfDownload() {
    const downloadBtn = document.getElementById('downloadPdfBtn');

    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', async () => {
        closeMoreOptionsMenu();
        await generatePDF();
    });
}

/**
 * Generate and download PDF of the CV
 */
async function generatePDF() {
    // Show loading indicator
    showLoadingOverlay();

    try {
        // Detect current language
        const currentLang = detectCurrentLanguage();

        // Get CV data from Supabase
        const cvData = await fetchCVDataFromSupabase();

        if (!cvData) {
            throw new Error('Impossible de charger les données du CV');
        }

        // Build professional PDF HTML
        const pdfHTML = buildPDFHTML(cvData, currentLang);

        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = pdfHTML;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        // File name
        const fileName = `${cvData.cvInfo.nom.replace(/\s+/g, '_')}_CV.pdf`;

        // PDF options
        const opt = {
            margin: [15, 15, 15, 15],
            filename: fileName,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: {
                mode: ['avoid-all', 'css'],
                before: '.pdf-section'
            }
        };

        // Generate PDF
        await html2pdf().set(opt).from(container).save();

        // Clean up
        document.body.removeChild(container);

        hideLoadingOverlay();
        showSuccessMessage('PDF téléchargé avec succès!');
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        hideLoadingOverlay();
        showErrorMessage('Erreur lors de la génération du PDF. Veuillez réessayer.');
    }
}

/**
 * Detect the current language from the page
 */
function detectCurrentLanguage() {
    const langBtn = document.getElementById('languageToggle');
    if (langBtn) {
        const langText = langBtn.querySelector('.lang-text');
        if (langText && langText.textContent.trim() === 'EN') {
            return 'en';
        }
    }
    return 'fr';
}

/**
 * Fetch CV data from Supabase
 */
async function fetchCVDataFromSupabase() {
    try {
        // Get the slug from URL
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const slug = pathParts[0] || 'default';

        // Load CV data using the existing loader
        const data = await loadCVData();

        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return null;
    }
}

/**
 * Build professional PDF HTML
 */
function buildPDFHTML(data, lang) {
    const isEnglish = lang === 'en';
    const cvInfo = data.cvInfo;
    const experiences = data.experiences || [];
    const formations = data.formations || [];
    const competences = data.competences || [];

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: white;
                    color: #1a1a1a;
                    line-height: 1.6;
                    font-size: 11pt;
                }

                .pdf-container {
                    max-width: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 20px;
                }

                .pdf-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 3px solid #1e40af;
                }

                .pdf-header h1 {
                    color: #1e40af;
                    font-size: 28pt;
                    margin-bottom: 8px;
                    font-weight: 700;
                }

                .pdf-header .title {
                    color: #1a1a1a;
                    font-size: 14pt;
                    font-weight: 500;
                    margin-bottom: 12px;
                }

                .pdf-header .contact-info {
                    color: #4b5563;
                    font-size: 10pt;
                    line-height: 1.8;
                }

                .pdf-section {
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                }

                .section-title {
                    color: #1e40af;
                    font-size: 16pt;
                    font-weight: 700;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid #1e40af;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .about-text {
                    color: #1a1a1a;
                    font-size: 11pt;
                    text-align: justify;
                    line-height: 1.7;
                    margin-bottom: 15px;
                }

                .experience-item, .formation-item {
                    margin-bottom: 20px;
                    page-break-inside: avoid;
                }

                .exp-header {
                    margin-bottom: 8px;
                }

                .exp-date {
                    color: #1e40af;
                    font-weight: 700;
                    font-size: 10pt;
                    margin-bottom: 5px;
                }

                .exp-title {
                    color: #1a1a1a;
                    font-size: 12pt;
                    font-weight: 700;
                    margin-bottom: 3px;
                }

                .exp-company {
                    color: #4b5563;
                    font-size: 11pt;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .exp-description {
                    color: #1a1a1a;
                    font-size: 10pt;
                    line-height: 1.6;
                    text-align: justify;
                    margin-bottom: 8px;
                }

                .exp-skills {
                    margin-top: 8px;
                }

                .skill-tag {
                    display: inline-block;
                    background: #e0e7ff;
                    color: #1e40af;
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 9pt;
                    margin-right: 6px;
                    margin-bottom: 4px;
                    font-weight: 500;
                }

                .competence-category {
                    margin-bottom: 15px;
                    page-break-inside: avoid;
                }

                .category-title {
                    color: #1e40af;
                    font-size: 11pt;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .competence-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .competence-item {
                    background: #f3f4f6;
                    color: #1a1a1a;
                    padding: 5px 12px;
                    border-radius: 6px;
                    font-size: 10pt;
                    font-weight: 500;
                }

                .pdf-footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                    font-size: 9pt;
                }
            </style>
        </head>
        <body>
            <div class="pdf-container">
                ${buildHeaderSection(cvInfo, isEnglish)}
                ${buildAboutSection(cvInfo, isEnglish)}
                ${buildExperiencesSection(experiences, isEnglish)}
                ${buildFormationsSection(formations, isEnglish)}
                ${buildCompetencesSection(competences, isEnglish)}
                ${buildFooter(cvInfo, isEnglish)}
            </div>
        </body>
        </html>
    `;
}

/**
 * Build header section
 */
function buildHeaderSection(cvInfo, isEnglish) {
    const contactParts = [];
    if (cvInfo.email) contactParts.push(cvInfo.email);
    if (cvInfo.telephone) contactParts.push(cvInfo.telephone);
    if (cvInfo.linkedin) contactParts.push(cvInfo.linkedin);

    return `
        <div class="pdf-header">
            <h1>${cvInfo.nom || ''}</h1>
            <div class="title">${isEnglish ? (cvInfo.titre_en || cvInfo.titre) : cvInfo.titre}</div>
            ${contactParts.length > 0 ? `<div class="contact-info">${contactParts.join(' • ')}</div>` : ''}
        </div>
    `;
}

/**
 * Build about section
 */
function buildAboutSection(cvInfo, isEnglish) {
    const bio = isEnglish ? (cvInfo.bio_en || cvInfo.bio) : cvInfo.bio;

    if (!bio) return '';

    return `
        <div class="pdf-section">
            <h2 class="section-title">${isEnglish ? 'About Me' : 'À Propos'}</h2>
            <p class="about-text">${bio}</p>
        </div>
    `;
}

/**
 * Build experiences section
 */
function buildExperiencesSection(experiences, isEnglish) {
    if (!experiences || experiences.length === 0) return '';

    const experiencesHTML = experiences.map(exp => {
        const titre = isEnglish ? (exp.titre_en || exp.titre) : exp.titre;
        const entreprise = isEnglish ? (exp.entreprise_en || exp.entreprise) : exp.entreprise;
        const description = isEnglish ? (exp.description_en || exp.description) : exp.description;

        const dateDebut = formatDateForPDF(exp.periode_debut);
        const dateFin = exp.en_cours ? (isEnglish ? 'Present' : 'Présent') : formatDateForPDF(exp.periode_fin);

        return `
            <div class="experience-item">
                <div class="exp-header">
                    <div class="exp-date">${dateDebut} - ${dateFin}</div>
                    <div class="exp-title">${titre}</div>
                    <div class="exp-company">${entreprise}</div>
                </div>
                ${description ? `<div class="exp-description">${description}</div>` : ''}
                ${exp.competences && exp.competences.length > 0 ? `
                    <div class="exp-skills">
                        ${exp.competences.map(comp => `<span class="skill-tag">${comp}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="pdf-section">
            <h2 class="section-title">${isEnglish ? 'Professional Experience' : 'Expérience Professionnelle'}</h2>
            ${experiencesHTML}
        </div>
    `;
}

/**
 * Build formations section
 */
function buildFormationsSection(formations, isEnglish) {
    if (!formations || formations.length === 0) return '';

    const formationsHTML = formations.map(formation => {
        const diplome = isEnglish ? (formation.diplome_en || formation.diplome) : formation.diplome;
        const institution = isEnglish ? (formation.institution_en || formation.institution) : formation.institution;
        const description = isEnglish ? (formation.description_en || formation.description) : formation.description;

        const annees = formation.annee_debut && formation.annee_fin
            ? `${formation.annee_debut} - ${formation.annee_fin}`
            : formation.annee_debut || '';

        return `
            <div class="formation-item">
                <div class="exp-header">
                    ${annees ? `<div class="exp-date">${annees}</div>` : ''}
                    <div class="exp-title">${diplome}</div>
                    <div class="exp-company">${institution}</div>
                </div>
                ${description ? `<div class="exp-description">${description}</div>` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="pdf-section">
            <h2 class="section-title">${isEnglish ? 'Education' : 'Formation'}</h2>
            ${formationsHTML}
        </div>
    `;
}

/**
 * Build competences section
 */
function buildCompetencesSection(competences, isEnglish) {
    if (!competences || competences.length === 0) return '';

    // Group by category
    const grouped = competences.reduce((acc, comp) => {
        const categorie = isEnglish ? (comp.categorie_en || comp.categorie) : comp.categorie;
        if (!acc[categorie]) {
            acc[categorie] = [];
        }
        acc[categorie].push(comp);
        return acc;
    }, {});

    const categoriesHTML = Object.entries(grouped).map(([categorie, comps]) => {
        const competencesHTML = comps.map(comp => {
            const nom = isEnglish ? (comp.competence_en || comp.competence) : comp.competence;
            const niveau = isEnglish ? comp.niveau_en : comp.niveau;
            return `<span class="competence-item">${nom}${niveau ? ' • ' + niveau : ''}</span>`;
        }).join('');

        return `
            <div class="competence-category">
                <div class="category-title">${categorie}</div>
                <div class="competence-list">
                    ${competencesHTML}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="pdf-section">
            <h2 class="section-title">${isEnglish ? 'Skills' : 'Compétences'}</h2>
            ${categoriesHTML}
        </div>
    `;
}

/**
 * Build footer
 */
function buildFooter(cvInfo, isEnglish) {
    return `
        <div class="pdf-footer">
            ${isEnglish ? 'Generated with' : 'Généré avec'} SyncCV • ${new Date().getFullYear()}
        </div>
    `;
}

/**
 * Format date for PDF
 */
function formatDateForPDF(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();

    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

/**
 * Show loading overlay
 */
function showLoadingOverlay() {
    // Remove existing overlay if any
    hideLoadingOverlay();

    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Génération du PDF en cours...</p>
            <small>Cela peut prendre quelques secondes</small>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    showToast(message, 'success');
}

/**
 * Show error message
 */
function showErrorMessage(message) {
    showToast(message, 'error');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
