# Mangalam HDPE Pipes - Product Website

> A fully responsive industrial product website built with vanilla HTML, CSS, and JavaScript.
> Designed to convert a detailed UI spec into a pixel-accurate, interactive frontend — no frameworks, no dependencies.

🌐 **Live Demo:** [industrialwebsitee.netlify.app](https://industrialwebsitee.netlify.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Implementation Details](#key-implementation-details)
- [Getting Started](#getting-started)
- [Author](#author)

---

## Overview

This project is a production-grade landing page for **Mangalam HDPE Pipes**, a South India-based industrial pipe manufacturer. The implementation covers a full multi-section product page including hero carousel, technical specifications, manufacturing process tabs, application showcase, FAQ accordion, and contact form — all built from scratch using core web technologies.

The focus was on clean architecture, modern layout systems, smooth UI interactions, and accessibility — without relying on any external UI frameworks or component libraries.

---

## Features

| Category | Details |
|---|---|
| **Layout** | Fully responsive — Desktop, Tablet, Mobile |
| **Navigation** | Sticky header with smooth anchor scroll |
| **Hero Section** | Auto-playing image carousel with dot navigation & swipe support |
| **Dark Mode** | System-preference detection + manual toggle with localStorage persistence |
| **Interactions** | Hover zoom, tab switching, FAQ accordion |
| **Applications** | Infinite-loop carousel with touch/swipe support |
| **Forms** | Contact form with phone country code selector |
| **Performance** | Lazy image loading via IntersectionObserver |
| **Accessibility** | Semantic HTML5, ARIA attributes, keyboard navigation |
| **Code Quality** | Clean separation — HTML / CSS / JS in dedicated files |

---

## Tech Stack

```
HTML5          Semantic structure, accessibility
CSS3           Flexbox, Grid, Custom Properties, Media Queries
JavaScript     Vanilla ES6+ — no frameworks or libraries
Fonts          Google Fonts — Sora + DM Sans
Images         Unsplash CDN
```

> No build tools, bundlers, or package managers required.

---

## Project Structure

```
figma-to-code-responsive-site/
│
├── index.html          # Full page markup
├── styles.css          # All styles — tokens, layout, components, dark mode
├── script.js           # All interactions — carousels, tabs, FAQ, scroll, dark mode
│
├── assets/
│   ├── images/         # Local image assets (if any)
│   └── icons/          # SVG / icon assets
│
└── README.md
```

---

## Key Implementation Details

### Hero Image Carousel

- `transform: translateX()` for GPU-accelerated smooth sliding
- Auto-plays every 3.5s with pause-on-interaction
- Dot indicators sync with active slide
- Touch swipe support for mobile

### Applications Carousel — Infinite Loop

- First and last cards cloned to create seamless wrap-around
- State-based index management with `transitionend` silent jump
- Dynamic card width calculation on resize

### Dark Mode

- CSS custom property overrides via `[data-theme="dark"]` on `<html>`
- Detects `prefers-color-scheme` on first visit
- Manual toggle persisted in `localStorage`
- Covers all sections — no white flash or invisible text

### Smooth Navigation Scroll

- Custom `easeInOutCubic` animation via `requestAnimationFrame`
- No `scroll-behavior: smooth` on `html` — avoids scroll lag on manual scrolling
- Auto-offsets for sticky navbar height using `offsetHeight`

### FAQ Accordion

- Only one item open at a time
- `aria-expanded` toggled for screen reader support
- Arrow key navigation between questions

### Process Tabs

- `role="tablist"` / `role="tab"` ARIA pattern
- Arrow Left / Right keyboard cycling
- `Home` / `End` key support

### Lazy Image Loading

- `IntersectionObserver` with `200px` root margin
- Triggers before image enters viewport to prevent visible loading
- Smooth fade-in via `.img-loaded` class

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Mohammedanees06/figma-to-code-responsive-site.git

# 2. Navigate into the project
cd figma-to-code-responsive-site

# 3. Open in browser
open index.html
```

> No installation, no build step, no dependencies. Open and run.

---

## Author

**Mohammed Anees** — Full Stack Developer

| | |
|---|---|
| 🌐 Portfolio | [mohammedanees.netlify.app](https://mohammedanees.netlify.app/) |
| 💼 LinkedIn | [linkedin.com/in/mohammedaneesdev](https://www.linkedin.com/in/mohammedaneesdev/) |
| 🖥 GitHub | [github.com/Mohammedanees06](https://github.com/Mohammedanees06) |
| 📧 Email | mohammedanees0606@gmail.com |

---

*This project demonstrates design-to-code conversion, responsive layout engineering, and interactive UI behaviour using core web technologies — built to production standard without a single external dependency.*