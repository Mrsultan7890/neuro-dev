# Neuro-Dev Learning Hub

## Overview
Neuro-Dev is a static learning hub for AI, machine learning, and cybersecurity. It brings together a searchable dictionary, OSINT learning resources, and Sentinel Octopus documentation. Some learning material is written in Roman Urdu.

## Learning Content

- **AI/ML and cybersecurity dictionary**: 500+ terms organized by topic and searchable in the browser.
- **OSINT series**: Eight chapters covering research concepts, setup, and tools.
- **Sentinel Octopus**: Project overview, setup guidance, command reference, and responsible-use notes.
- **Additional projects**: Links to CipherPoint CTF practice and Learn Shadow Code.
- **Social profiles**: YouTube `@whoistheblackhat`, Instagram `@who_is_the_black_hat`, and Telegram `@neuroshade`.

## Features

- **Searchable reference**: Find dictionary terms and browse by category.
- **Responsive layouts**: Read and navigate the site on mobile, tablet, or desktop.
- **Practical resources**: Chapter guides include commands and copy controls.
- **No build step**: Host the static files directly on GitHub Pages, Netlify, or another static host.

## Project Structure

This is a static site with no package manager or build step. Each HTML page can
be hosted directly on GitHub Pages, Netlify, or any static web host.

```
neuro-dev/
├── index.html              # Learning hub
├── dictionary.html         # Searchable AI/ML and security dictionary
├── resources.html          # OSINT learning resources
├── sentinel-octopus.html   # Sentinel Octopus documentation
├── site.css                # Shared design tokens, navigation, and UI styles
├── site.js                 # Shared accessible mobile navigation
├── cyber-theme.css         # Shared page theme
└── data/                   # Dictionary terms and OSINT chapter content
```

Page-specific content remains in its HTML file, while shared navigation
behavior and design primitives live in `site.js` and `site.css`.



## Technologies

- **HTML5**: Semantic markup
- **CSS3**: Shared design tokens and responsive page styles
- **JavaScript**: Shared accessible navigation and page interactions
- **Font Awesome**: Icons

## Educational Purpose

This site is for education and authorized security research. Use the material responsibly and do not test systems without permission.

## License

This project is for educational purposes only. Use responsibly.

---

**Note**: OSINT material can involve personal information. Minimize collection and follow applicable privacy, authorization, and data-retention requirements.
