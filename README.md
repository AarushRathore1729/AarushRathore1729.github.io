# Academic Personal Website

A modern, beautiful academic website built with HTML, CSS, and JavaScript. Easy to customize and maintain for years!

## 🚀 Quick Start

1. **Open locally**: Open `index.html` in your browser
2. **Or use a local server**: 
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000
   ```

## 📁 Project Structure

```
personal_website/
├── index.html          # Main website file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── app.js          # Navigation and content loading
├── data/               # ⭐ EDIT THESE TO UPDATE YOUR SITE
│   ├── profile.json    # Your name, bio, photo, social links
│   ├── publications.json
│   ├── talks.json
│   ├── teaching.json
│   ├── portfolio.json
│   ├── blog.json
│   └── cv.json
├── assets/
│   ├── images/         # Profile photo, project images
│   └── files/          # PDFs, slides, papers
└── README.md
```

## ✏️ How to Edit Your Site

### Update Your Profile
Edit `data/profile.json`:
```json
{
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your short bio",
    ...
}
```

### Add Publications
Edit `data/publications.json`:
```json
[
    {
        "title": "Paper Title",
        "authors": "You, Co-Author",
        "venue": "Conference Name",
        "year": 2024,
        "pdf": "assets/files/paper.pdf"
    }
]
```

### Add Talks, Teaching, Portfolio, Blog
Same pattern - just edit the corresponding JSON file in `/data/`!

## 🌐 Deploying to GitHub Pages

1. Create a GitHub repository
2. Push all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" → main → / (root)
5. Your site will be live at `https://yourusername.github.io/repo-name`

## 📷 Adding Images

1. Add your profile photo to `assets/images/profile.jpg`
2. Add project images to `assets/images/`
3. Reference them in your JSON files

## 🎨 Customization

### Change Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --accent-primary: #6366f1;    /* Main accent color */
    --accent-secondary: #818cf8;  /* Secondary accent */
    ...
}
```

### Add/Remove Sections
Edit `index.html` navigation and section containers, then update `js/app.js` if needed.

## 📄 License

MIT License - feel free to use and modify!
