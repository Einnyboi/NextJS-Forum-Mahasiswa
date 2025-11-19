# Project Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git installed

## Setup Steps

1. Clone the repository:
```bash
git clone [your-repository-url]
cd forum_mahasiswa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Important Note About Dependencies
The project uses:
- Tailwind CSS v3.3.5
- Next.js 16.0.0
- PostCSS 8.4.31
- Autoprefixer 10.4.21

If you encounter any styling issues:
1. Delete the `.next` folder if it exists
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Start the development server with `npm run dev`

## Project Structure
- `app/` - Next.js app router pages and layouts
- `components/` - React components
- `lib/` - Utility functions and types
- `public/` - Static assets

## Tailwind Configuration
Custom colors are configured in `tailwind.config.ts`:
- primary: #c7d6d5
- secondary: #ecebf3
- brand-black: #0c120c
- brand-red: #c20114

## Troubleshooting
If styles are not applying:
1. Make sure all dependencies are installed correctly
2. Check that PostCSS is configured properly in `postcss.config.mjs`
3. Verify that `globals.css` contains the correct Tailwind directives
4. Clear your browser cache or do a hard refresh (Ctrl+F5)