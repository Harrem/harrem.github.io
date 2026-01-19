/* 
  Liquid Hero Shader
  Author: Harrem M Jalal
  Description: A WebGL fragment shader simulation of colorful, swirling liquids that react to mouse movement.
*/

const canvas = document.getElementById('liquid-canvas');

if (canvas) {
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
    } else {
        liquidSimulation(gl, canvas);
    }
}

function liquidSimulation(gl, canvas) {
    // Vertex Shader: Simple full-screen quad
    const vsSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    // Fragment Shader: The "Liquid" Magic
    // - Uses sine/cosine mixing for the "swirl"
    // - u_time drives the animation
    // - u_mouse distorts the field
    const fsSource = `
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        // Color palette function
        vec3 palette( in float t ) {
            vec3 a = vec3(0.5, 0.5, 0.5);
            vec3 b = vec3(0.5, 0.5, 0.5);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.263,0.416,0.557);
            return a + b*cos( 6.28318*(c*t+d) );
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
            vec2 uv0 = uv;
            
            // Mouse Interaction: Subtle distortion based on distance
            float dist = length(gl_FragCoord.xy - u_mouse);
            float mouseEffect = 0.5 / (dist * 0.005 + 0.1); // Glow/Push near mouse (tweakable)
            
            vec3 finalColor = vec3(0.0);
            
            // Fractal Layers for "Liquid" density
            for(float i = 0.0; i < 3.0; i++) {
                uv = fract(uv * 1.5) - 0.5;

                float d = length(uv) * exp(-length(uv0));

                vec3 col = palette(length(uv0) + i*.4 + u_time*.4);

                d = sin(d*8. + u_time)/8.;
                d = abs(d);

                d = pow(0.01 / d, 1.2);

                finalColor += col * d;
            }
            
            // Blend mouse effect
            finalColor += vec3(0.0, 0.8, 1.0) * mouseEffect * 0.1;
             
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // Shader Compilation Helper
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Program Linking Helper
    function createProgram(gl, vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Buffers (Full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
    ]), gl.STATIC_DRAW);

    // Uniform Locations
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");

    // Resize Handler
    function resize() {
        // Look up the size the browser is displaying the canvas.
        const displayWidth  = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width  !== displayWidth ||
            canvas.height !== displayHeight) {

            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    // We can attach this to the canvas parent or body
    document.addEventListener('mousemove', (e) => {
        // We need coordinates relative to the canvas/viewport for the shader
        // Since canvas is fixed/absolute in hero, clientY needs to be flipped for WebGL (0,0 is bottom-left usually, but gl_FragCoord matches viewport)
        // Actually gl_FragCoord is (0,0) bottom-left. e.clientY is top-left.
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = canvas.height - (e.clientY - rect.top); 
    });

    // Render Loop
    function render(time) {
        time *= 0.0005; // Convert to seconds

        resize();

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform1f(timeUniformLocation, time);
        gl.uniform2f(mouseUniformLocation, mouseX, mouseY);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
