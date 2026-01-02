/* ========================================
   Academic Personal Website - Main App
======================================== */

class AcademicSite {
    constructor() {
        this.currentSection = 'about';
        this.data = {};
        this.init();
    }

    async init() {
        this.setupTheme();
        await this.loadAllData();
        this.setupNavigation();
        this.setupMobileMenu();
        this.renderProfile();
        this.renderAllSections();
        this.handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());
    }

    // ========================================
    // THEME TOGGLE
    // ========================================
    setupTheme() {
        const toggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';

        // Apply saved theme
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ========================================
    // DATA LOADING
    // ========================================
    async loadAllData() {
        const dataFiles = ['profile', 'publications', 'reading', 'teaching', 'portfolio', 'blog', 'cv'];

        for (const file of dataFiles) {
            try {
                const response = await fetch(`data / ${file}.json`);
                if (response.ok) {
                    this.data[file] = await response.json();
                } else {
                    console.warn(`Could not load ${file}.json`);
                    this.data[file] = this.getDefaultData(file);
                }
            } catch (error) {
                console.warn(`Error loading ${file}.json: `, error);
                this.data[file] = this.getDefaultData(file);
            }
        }
    }

    getDefaultData(file) {
        const defaults = {
            profile: {
                name: "Your Name",
                title: "Your Title",
                bio: "Short biography about yourself and your research interests.",
                photo: "assets/images/profile.jpg",
                institution: "Your University",
                location: "City, Country",
                email: "you@example.com",
                socialLinks: {}
            },
            publications: [],
            reading: [],
            teaching: [],
            portfolio: [],
            blog: [],
            cv: { education: [], experience: [], skills: [], awards: [] }
        };
        return defaults[file] || {};
    }

    // ========================================
    // NAVIGATION
    // ========================================
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateToSection(section);

                // Close mobile menu
                document.getElementById('sidebar').classList.remove('open');
            });
        });
    }

    navigateToSection(sectionId) {
        // Update hash
        window.location.hash = sectionId;

        // Update active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // Show section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        this.currentSection = sectionId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleHashChange() {
        const hash = window.location.hash.slice(1) || 'about';
        this.navigateToSection(hash);
    }

    setupMobileMenu() {
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ========================================
    // PROFILE RENDERING
    // ========================================
    renderProfile() {
        const profile = this.data.profile;

        // Basic info
        this.setTextContent('profile-name', profile.name);
        this.setTextContent('profile-title', profile.title);
        this.setTextContent('profile-bio', profile.bio);

        // Profile image
        const img = document.getElementById('profile-image');
        if (img && profile.photo) {
            img.src = profile.photo;
            img.alt = profile.name;
        }

        // Info items
        const institutionEl = document.getElementById('info-institution');
        if (institutionEl && profile.institution) {
            institutionEl.querySelector('span').textContent = profile.institution;
        }

        const locationEl = document.getElementById('info-location');
        if (locationEl && profile.location) {
            locationEl.querySelector('span').textContent = profile.location;
        }

        const emailEl = document.getElementById('info-email');
        if (emailEl && profile.email) {
            const link = emailEl.querySelector('a');
            link.href = `mailto:${profile.email} `;
            link.textContent = profile.email;
        }

        // Social links
        this.renderSocialLinks(profile.socialLinks);

        // Update page title
        document.title = `${profile.name} | Academic`;
    }

    renderSocialLinks(links) {
        const container = document.getElementById('social-links');
        if (!container || !links) return;

        const iconMap = {
            googleScholar: { icon: 'fas fa-graduation-cap', title: 'Google Scholar' },
            orcid: { icon: 'fab fa-orcid', title: 'ORCID' },
            github: { icon: 'fab fa-github', title: 'GitHub' },
            linkedin: { icon: 'fab fa-linkedin', title: 'LinkedIn' },
            twitter: { icon: 'fab fa-twitter', title: 'Twitter' },
            bluesky: { icon: 'fab fa-bluesky', title: 'Bluesky' },
            researchGate: { icon: 'fab fa-researchgate', title: 'ResearchGate' },
            website: { icon: 'fas fa-globe', title: 'Website' }
        };

        container.innerHTML = '';

        for (const [key, url] of Object.entries(links)) {
            if (url && iconMap[key]) {
                const link = document.createElement('a');
                link.href = url;
                link.className = 'social-link';
                link.title = iconMap[key].title;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.innerHTML = `< i class="${iconMap[key].icon}" ></i > `;
                container.appendChild(link);
            }
        }
    }

    // ========================================
    // SECTION RENDERING
    // ========================================
    renderAllSections() {
        this.renderPublications();
        this.renderReading();
        this.renderTeaching();
        this.renderPortfolio();
        this.renderBlog();
        this.renderCV();
        this.updatePublicationCount();
    }

    updatePublicationCount() {
        const count = this.data.publications?.length || 0;
        const el = document.getElementById('pub-count');
        if (el) {
            el.textContent = `${count} + peer - reviewed papers`;
        }
    }

    renderPublications() {
        const container = document.getElementById('publications-list');
        const publications = this.data.publications || [];

        if (publications.length === 0) {
            container.innerHTML = this.getEmptyState('book', 'No publications yet. Add them to data/publications.json');
            return;
        }

        // Populate year filter
        const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
        const filterSelect = document.getElementById('pub-filter');
        filterSelect.innerHTML = '<option value="all">All Years</option>';
        years.forEach(year => {
            filterSelect.innerHTML += `< option value = "${year}" > ${year}</option > `;
        });

        // Setup search and filter
        const searchInput = document.getElementById('pub-search');

        const renderFiltered = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const yearFilter = filterSelect.value;

            const filtered = publications.filter(pub => {
                const matchesSearch = !searchTerm ||
                    pub.title.toLowerCase().includes(searchTerm) ||
                    pub.authors.toLowerCase().includes(searchTerm) ||
                    (pub.venue && pub.venue.toLowerCase().includes(searchTerm));
                const matchesYear = yearFilter === 'all' || pub.year.toString() === yearFilter;
                return matchesSearch && matchesYear;
            });

            container.innerHTML = filtered.map(pub => this.getPublicationCard(pub)).join('');
        };

        searchInput.addEventListener('input', renderFiltered);
        filterSelect.addEventListener('change', renderFiltered);

        renderFiltered();
    }

    getPublicationCard(pub) {
        const links = [];
        if (pub.pdf) links.push(`< a href = "${pub.pdf}" class="pub-link" target = "_blank" > <i class="fas fa-file-pdf"></i> PDF</a > `);
        if (pub.doi) links.push(`< a href = "https://doi.org/${pub.doi}" class="pub-link" target = "_blank" > <i class="fas fa-external-link-alt"></i> DOI</a > `);
        if (pub.code) links.push(`< a href = "${pub.code}" class="pub-link" target = "_blank" > <i class="fab fa-github"></i> Code</a > `);
        if (pub.slides) links.push(`< a href = "${pub.slides}" class="pub-link" target = "_blank" > <i class="fas fa-desktop"></i> Slides</a > `);

        return `
    < div class="publication-card" >
                <span class="publication-year">${pub.year}</span>
                <h3 class="publication-title">${pub.title}</h3>
                <p class="publication-authors">${pub.authors}</p>
                ${pub.venue ? `<p class="publication-venue">${pub.venue}</p>` : ''}
                ${links.length > 0 ? `<div class="publication-links">${links.join('')}</div>` : ''}
            </div >
    `;
    }

    renderReading() {
        const container = document.getElementById('reading-list');
        const items = this.data.reading || [];

        if (items.length === 0) {
            container.innerHTML = this.getEmptyState('book-reader', 'No reading items yet. Add them to data/reading.json');
            return;
        }

        // Setup filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterReading(btn.dataset.filter, items, container);
            });
        });

        this.filterReading('all', items, container);
    }

    filterReading(filter, items, container) {
        const filtered = filter === 'all' ? items : items.filter(item => item.type === filter);

        container.innerHTML = filtered.map(item => this.getReadingCard(item)).join('');

        // Add staggered animation
        const cards = container.querySelectorAll('.reading-card');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50);
        });
    }

    getReadingCard(item) {
        const stars = item.rating ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating) : '';
        const takeaways = item.keyTakeaways ? `
    < div class="reading-takeaways" >
                <div class="reading-takeaways-title">Key Takeaways</div>
                <ul>${item.keyTakeaways.map(t => `<li>${t}</li>`).join('')}</ul>
            </div >
    ` : '';

        return `
    < div class="reading-card" ${item.link ? `onclick="window.open('${item.link}', '_blank')"` : ''}>
                <div class="reading-card-header">
                    <span class="reading-type ${item.type}">${item.type}</span>
                    ${stars ? `<span class="reading-rating">${stars}</span>` : ''}
                </div>
                <h3 class="reading-title">${item.title}</h3>
                ${item.author ? `<p class="reading-author">by ${item.author}</p>` : ''}
<p class="reading-summary">${item.summary}</p>
                ${takeaways}
                ${item.tags ? `
                    <div class="reading-tags">
                        ${item.tags.map(tag => `<span class="reading-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''
            }
            </div >
    `;
    }

    renderTeaching() {
        const container = document.getElementById('teaching-list');
        const courses = this.data.teaching || [];

        if (courses.length === 0) {
            container.innerHTML = this.getEmptyState('chalkboard-teacher', 'No courses yet. Add them to data/teaching.json');
            return;
        }

        container.innerHTML = courses.map(course => `
    < div class="course-card" >
        ${course.code ? `<span class="course-code">${course.code}</span>` : ''}
                <h3 class="course-title">${course.title}</h3>
                <p class="course-term">${course.term} ${course.year || ''}</p>
                ${course.description ? `<p class="course-description">${course.description}</p>` : ''}
            </div >
    `).join('');
    }

    renderPortfolio() {
        const container = document.getElementById('portfolio-list');
        const projects = this.data.portfolio || [];

        if (projects.length === 0) {
            container.innerHTML = this.getEmptyState('briefcase', 'No projects yet. Add them to data/portfolio.json');
            return;
        }

        container.innerHTML = projects.map(project => `
    < div class="portfolio-card" ${project.link ? `onclick="window.open('${project.link}', '_blank')"` : ''}>
        ${project.image ? `<img src="${project.image}" alt="${project.title}" class="portfolio-image">` : ''}
<div class="portfolio-content">
    <h3 class="portfolio-title">${project.title}</h3>
    <p class="portfolio-description">${project.description}</p>
    ${project.tags ? `
                        <div class="portfolio-tags">
                            ${project.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
</div>
            </div >
    `).join('');
    }

    renderBlog() {
        const container = document.getElementById('blog-list');
        const posts = this.data.blog || [];

        if (posts.length === 0) {
            container.innerHTML = this.getEmptyState('blog', 'No blog posts yet. Add them to data/blog.json');
            return;
        }

        container.innerHTML = posts.map(post => `
    < div class="blog-card" onclick = "window.location.hash='blog-${post.id}'" >
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="blog-image">` : ''}
<div class="blog-content">
    <div class="blog-date">${this.formatDate(post.date)}</div>
    <h3 class="blog-title">${post.title}</h3>
    <p class="blog-excerpt">${post.excerpt}</p>
</div>
            </div >
    `).join('');
    }

    renderCV() {
        const container = document.getElementById('cv-content');
        const cv = this.data.cv || {};

        let html = '';

        // Education
        if (cv.education && cv.education.length > 0) {
            html += `
    < div class="cv-section" >
        <h3 class="cv-section-title"><i class="fas fa-graduation-cap"></i> Education</h3>
                    ${cv.education.map(edu => `
                        <div class="cv-item">
                            <div class="cv-item-header">
                                <span class="cv-item-title">${edu.degree}</span>
                                <span class="cv-item-date">${edu.year}</span>
                            </div>
                            <div class="cv-item-subtitle">${edu.institution}</div>
                            ${edu.description ? `<div class="cv-item-description">${edu.description}</div>` : ''}
                        </div>
                    `).join('')
                }
                </div >
    `;
        }

        // Experience
        if (cv.experience && cv.experience.length > 0) {
            html += `
    < div class="cv-section" >
        <h3 class="cv-section-title"><i class="fas fa-briefcase"></i> Experience</h3>
                    ${cv.experience.map(exp => `
                        <div class="cv-item">
                            <div class="cv-item-header">
                                <span class="cv-item-title">${exp.title}</span>
                                <span class="cv-item-date">${exp.period}</span>
                            </div>
                            <div class="cv-item-subtitle">${exp.organization}</div>
                            ${exp.description ? `<div class="cv-item-description">${exp.description}</div>` : ''}
                        </div>
                    `).join('')
                }
                </div >
    `;
        }

        // Skills
        if (cv.skills && cv.skills.length > 0) {
            html += `
    < div class="cv-section" >
                    <h3 class="cv-section-title"><i class="fas fa-tools"></i> Skills</h3>
                    <div class="cv-skills">
                        ${cv.skills.map(skill => `<span class="cv-skill">${skill}</span>`).join('')}
                    </div>
                </div >
    `;
        }

        // Awards
        if (cv.awards && cv.awards.length > 0) {
            html += `
    < div class="cv-section" >
        <h3 class="cv-section-title"><i class="fas fa-award"></i> Awards & Honors</h3>
                    ${cv.awards.map(award => `
                        <div class="cv-item">
                            <div class="cv-item-header">
                                <span class="cv-item-title">${award.title}</span>
                                <span class="cv-item-date">${award.year}</span>
                            </div>
                            ${award.organization ? `<div class="cv-item-subtitle">${award.organization}</div>` : ''}
                        </div>
                    `).join('')
                }
                </div >
    `;
        }

        if (!html) {
            html = this.getEmptyState('file-alt', 'No CV data yet. Add it to data/cv.json');
        }

        container.innerHTML = html;
    }

    // ========================================
    // UTILITIES
    // ========================================
    setTextContent(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getEmptyState(icon, message) {
        return `
    < div class="empty-state" >
                <i class="fas fa-${icon}"></i>
                <p>${message}</p>
            </div >
    `;
    }
}

// Initialize the site
document.addEventListener('DOMContentLoaded', () => {
    new AcademicSite();
});
