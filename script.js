// Powell Lens Visualization
class PowellLensVisualization {
    constructor() {
        this.fanAngle = 45; // degrees
        this.outputDistance = 200; // pixels
        this.beamWidth = 20; // pixels
        this.numRays = 15; // number of rays to show
        
        this.init();
    }
    
    init() {
        this.setupSVGs();
        this.setupControls();
        this.updateVisualization();
    }
    
    setupSVGs() {
        // Setup input panel
        this.inputSVG = d3.select('#inputPanel')
            .attr('viewBox', '0 0 300 350')
            .attr('preserveAspectRatio', 'xMidYMid meet');
            
        // Setup lens panel
        this.lensSVG = d3.select('#lensPanel')
            .attr('viewBox', '0 0 300 350')
            .attr('preserveAspectRatio', 'xMidYMid meet');
            
        // Setup output panel
        this.outputSVG = d3.select('#outputPanel')
            .attr('viewBox', '0 0 300 350')
            .attr('preserveAspectRatio', 'xMidYMid meet');
    }
    
    setupControls() {
        const slider = document.getElementById('fanAngle');
        const valueDisplay = document.getElementById('fanAngleValue');
        
        slider.addEventListener('input', (e) => {
            this.fanAngle = parseInt(e.target.value);
            valueDisplay.textContent = this.fanAngle + '°';
            this.updateVisualization();
        });
    }
    
    updateVisualization() {
        this.drawInputBeam();
        this.drawLens();
        this.drawOutputFan();
    }
    
    drawInputBeam() {
        this.inputSVG.selectAll('*').remove();
        
        const centerY = 175;
        const beamStartX = 50;
        const beamEndX = 250;
        
        // Draw beam outline
        this.inputSVG.append('rect')
            .attr('x', beamStartX)
            .attr('y', centerY - this.beamWidth/2)
            .attr('width', beamEndX - beamStartX)
            .attr('height', this.beamWidth)
            .attr('fill', 'none')
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        // Draw multiple rays representing the beam
        for (let i = 0; i < this.numRays; i++) {
            const y = centerY - this.beamWidth/2 + (this.beamWidth / (this.numRays - 1)) * i;
            
            this.inputSVG.append('line')
                .attr('x1', beamStartX)
                .attr('y1', y)
                .attr('x2', beamEndX)
                .attr('y2', y)
                .attr('class', 'beam-line')
                .attr('opacity', 0.3 + 0.7 * (1 - Math.abs(i - (this.numRays-1)/2) / (this.numRays-1)/2));
        }
        
        // Add arrow
        this.inputSVG.append('defs').append('marker')
            .attr('id', 'arrowhead-input')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('class', 'arrowhead');
        
        this.inputSVG.append('line')
            .attr('x1', beamEndX - 20)
            .attr('y1', centerY)
            .attr('x2', beamEndX)
            .attr('y2', centerY)
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowhead-input)');
        
        // Add labels
        this.inputSVG.append('text')
            .attr('x', 150)
            .attr('y', centerY - this.beamWidth/2 - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#333')
            .text('Gaussian Beam');
    }
    
    drawLens() {
        this.lensSVG.selectAll('*').remove();
        
        const centerY = 175;
        const lensX = 150;
        const lensWidth = 40;
        const lensHeight = 80;
        
        // Draw Powell lens (simplified as a rectangle with curved surface)
        this.lensSVG.append('rect')
            .attr('x', lensX - lensWidth/2)
            .attr('y', centerY - lensHeight/2)
            .attr('width', lensWidth)
            .attr('height', lensHeight)
            .attr('fill', 'rgba(78, 205, 196, 0.2)')
            .attr('stroke', '#4ecdc4')
            .attr('stroke-width', 2);
        
        // Draw curved surface (aspheric surface)
        const curvePoints = [];
        const segments = 20;
        for (let i = 0; i <= segments; i++) {
            const y = centerY - lensHeight/2 + (lensHeight / segments) * i;
            const x = lensX + lensWidth/2 + 10 * Math.sin(Math.PI * i / segments);
            curvePoints.push(`${x},${y}`);
        }
        
        this.lensSVG.append('polyline')
            .attr('points', curvePoints.join(' '))
            .attr('fill', 'none')
            .attr('stroke', '#4ecdc4')
            .attr('stroke-width', 3);
        
        // Draw incoming rays
        for (let i = 0; i < this.numRays; i++) {
            const y = centerY - this.beamWidth/2 + (this.beamWidth / (this.numRays - 1)) * i;
            
            this.lensSVG.append('line')
                .attr('x1', 50)
                .attr('y1', y)
                .attr('x2', lensX - lensWidth/2)
                .attr('y2', y)
                .attr('class', 'beam-line')
                .attr('opacity', 0.3 + 0.7 * (1 - Math.abs(i - (this.numRays-1)/2) / (this.numRays-1)/2));
        }
        
        // Draw refracted rays
        const fanAngleRad = (this.fanAngle * Math.PI) / 180;
        const halfFanAngle = fanAngleRad / 2;
        
        for (let i = 0; i < this.numRays; i++) {
            const y = centerY - this.beamWidth/2 + (this.beamWidth / (this.numRays - 1)) * i;
            const normalizedPos = (i - (this.numRays-1)/2) / ((this.numRays-1)/2);
            const angle = normalizedPos * halfFanAngle;
            
            const rayLength = 100;
            const endX = lensX + lensWidth/2 + rayLength * Math.cos(angle);
            const endY = y + rayLength * Math.sin(angle);
            
            this.lensSVG.append('line')
                .attr('x1', lensX + lensWidth/2)
                .attr('y1', y)
                .attr('x2', endX)
                .attr('y2', endY)
                .attr('class', 'fan-beam')
                .attr('opacity', 0.3 + 0.7 * (1 - Math.abs(i - (this.numRays-1)/2) / (this.numRays-1)/2));
        }
        
        // Add labels
        this.lensSVG.append('text')
            .attr('x', lensX)
            .attr('y', centerY - lensHeight/2 - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#333')
            .text('Powell Lens');
    }
    
    drawOutputFan() {
        this.outputSVG.selectAll('*').remove();
        
        const centerY = 175;
        const fanStartX = 50;
        const fanEndX = 250;
        const outputLineY1 = centerY - this.outputDistance * Math.tan((this.fanAngle * Math.PI / 180) / 2);
        const outputLineY2 = centerY + this.outputDistance * Math.tan((this.fanAngle * Math.PI / 180) / 2);
        
        // Draw output line (uniform line beam)
        this.outputSVG.append('line')
            .attr('x1', fanEndX)
            .attr('y1', outputLineY1)
            .attr('x2', fanEndX)
            .attr('y2', outputLineY2)
            .attr('stroke', '#45b7d1')
            .attr('stroke-width', 6)
            .attr('opacity', 0.7);
        
        // Draw fan rays (all terminate on the output line)
        for (let i = 0; i < this.numRays; i++) {
            const t = i / (this.numRays - 1);
            const endY = outputLineY1 + t * (outputLineY2 - outputLineY1);
            this.outputSVG.append('line')
                .attr('x1', fanStartX)
                .attr('y1', centerY)
                .attr('x2', fanEndX)
                .attr('y2', endY)
                .attr('class', 'fan-beam')
                .attr('stroke', '#45b7d1')
                .attr('opacity', 0.5 + 0.5 * (1 - Math.abs(i - (this.numRays-1)/2) / ((this.numRays-1)/2)));
        }
        
        // Add arrow markers to the end of some rays
        this.outputSVG.append('defs').append('marker')
            .attr('id', 'arrowhead-output')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('class', 'arrowhead');
        
        const arrowRays = [0, Math.floor(this.numRays/4), Math.floor(this.numRays/2), Math.floor(3*this.numRays/4), this.numRays-1];
        arrowRays.forEach(i => {
            const t = i / (this.numRays - 1);
            const endY = outputLineY1 + t * (outputLineY2 - outputLineY1);
            this.outputSVG.append('line')
                .attr('x1', fanEndX - 15)
                .attr('y1', endY)
                .attr('x2', fanEndX)
                .attr('y2', endY)
                .attr('stroke', '#45b7d1')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead-output)');
        });
        
        // Add labels
        this.outputSVG.append('text')
            .attr('x', (fanEndX + fanStartX) / 2)
            .attr('y', outputLineY1 - 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#333')
            .text('Uniform Line');
        
        // Add angle indicator (arc) at the fan origin
        const angleIndicatorRadius = 35;
        const angleStart = centerY - angleIndicatorRadius * Math.sin((this.fanAngle * Math.PI / 180) / 2);
        const angleEnd = centerY + angleIndicatorRadius * Math.sin((this.fanAngle * Math.PI / 180) / 2);
        const arcSweep = this.fanAngle > 180 ? 1 : 0;
        const arcPath = d3.path();
        arcPath.moveTo(fanStartX, centerY);
        arcPath.arc(fanStartX, centerY, angleIndicatorRadius, -((this.fanAngle * Math.PI / 180) / 2), ((this.fanAngle * Math.PI / 180) / 2));
        this.outputSVG.append('path')
            .attr('d', arcPath.toString())
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
        // Place angle label at the middle of the arc
        const labelAngle = 0;
        this.outputSVG.append('text')
            .attr('x', fanStartX + (angleIndicatorRadius + 18) * Math.cos(labelAngle))
            .attr('y', centerY + (angleIndicatorRadius + 18) * Math.sin(labelAngle) + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#333')
            .text(`${this.fanAngle}°`);
    }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PowellLensVisualization();
}); 