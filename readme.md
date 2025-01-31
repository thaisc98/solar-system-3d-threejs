# [Solar System 3D with ThreeJS](https://solarsystem-3d-threejs.netlify.app/)

A 3D visualization of the solar system built using ThreeJS.

## Features

- Realistic 3D models of the planets with accurate textures
- Orbit paths for planets around the Sun
- Camera controls for zooming, panning, and rotating the scene
- Lighting and shadows for a more immersive experience
- Adjustable simulation light using Tweakpane

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Install Dependencies

Install all required dependencies using npm:

```bash
npm install
```

### 2. Start the Development Server

Start the local development server:

```bash
npm run dev
```

## Project Structure

```plaintext
├── src                             # Source files
│   ├── index.html                  # HTML entry point
│   ├── styles.css                  # Styling
│   ├── script.js                   # JavaScript entry point (Three.js code)
├── static/textures                 # Static Planets Textures files
├── package.json                    # npm configuration
├── readme.md                       # Project documentation
├── vite.config.js                  # Vite configuration
```

## Deployment

To deploy this project to production, build the optimized files:

```bash
npm run build
```

Then, serve the contents of the `dist` folder using any static site hosting service (e.g., Netlify, Vercel, or GitHub Pages).

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Tweakpane](https://tweakpane.github.io/)
- [Solar System Textures](https://www.solarsystemscope.com/textures/)

## License

This project is licensed under the MIT License. Feel free to use and modify the code as needed.
