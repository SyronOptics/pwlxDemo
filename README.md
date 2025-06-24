# Powell Lens Visualization

An interactive web application that demonstrates how a Powell lens transforms a Gaussian laser beam into a uniform line of light.

## Features

- **Three-panel visualization**: Shows the input beam, Powell lens, and output fan
- **Interactive fan angle control**: Adjust the fan angle from 10° to 90° using the slider
- **Line-based illustration**: Clean, conceptual representation using D3.js
- **Real-time updates**: See changes immediately as you adjust parameters
- **Responsive design**: Works on different screen sizes

## How to Use

1. Open `index.html` in a web browser
2. Use the "Fan Angle" slider to adjust the output beam spread
3. Observe how the fan angle affects the output pattern in the right panel

## Technical Details

### Powell Lens Operation
A Powell lens is an optical element with an aspheric surface that:
- Takes a collimated Gaussian beam as input
- Refracts different parts of the beam at different angles
- Produces a uniform line of light at a specific distance

### Visualization Components

**Left Panel - Input Beam:**
- Shows a collimated Gaussian beam
- Multiple parallel rays represent the beam profile
- Arrow indicates beam direction

**Middle Panel - Powell Lens:**
- Displays the lens with its curved aspheric surface
- Shows incoming rays and their refraction
- Demonstrates how different beam positions are redirected

**Right Panel - Output Fan:**
- Shows the resulting fan of light
- Fan angle is controlled by the slider
- Includes angle measurement indicator

## Files

- `index.html` - Main HTML structure and styling
- `script.js` - D3.js visualization logic
- `README.md` - This documentation

## Technologies Used

- **HTML5** - Structure and layout
- **CSS3** - Styling and responsive design
- **D3.js v7** - Data visualization and SVG manipulation
- **JavaScript ES6** - Interactive functionality

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- SVG graphics
- CSS Grid and Flexbox

## Future Enhancements

Potential additions could include:
- Beam intensity visualization
- Multiple wavelength support
- Lens parameter controls (curvature, refractive index)
- Animation of the transformation process
- Export functionality for images 