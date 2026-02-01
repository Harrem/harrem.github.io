import {
    Renderer,
    Camera,
    Transform,
    Polyline,
    Vec3,
    Color
} from 'https://cdn.jsdelivr.net/npm/ogl@0.0.25/dist/ogl.mjs';

{
    const vertex = `
        attribute vec3 position;
        attribute vec3 next;
        attribute vec3 prev;
        attribute vec2 uv;
        attribute float side;

        uniform vec2 uResolution;
        uniform float uThickness;

        void main() {
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
            vec2 nextScreen = next.xy * aspect;
            vec2 prevScreen = prev.xy * aspect;

            vec2 tangent = normalize(nextScreen - prevScreen);
            vec2 normal = vec2(-tangent.y, tangent.x);
            normal /= aspect;

            // Taper the line towards the end
            normal *= (1.0 - pow(abs(uv.y - 0.5) * 2.0, 2.0)) * uThickness;

            vec4 current = vec4(position, 1);
            current.xy -= normal * side;
            gl_Position = current;
        }
    `;

    const fragment = `
        precision mediump float;
        uniform vec3 uColor;
        void main() {
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = 1.0;
        }
    `;

    const renderer = new Renderer({
        dpr: 2,
        alpha: true,
        premultipliedAlpha: true,
    });
    const gl = renderer.gl;
    document.body.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.position.z = 3;

    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resize, false);
    resize();

    const scene = new Transform();

    const lines = [];

    // Get initial mouse position
    const mouse = new Vec3();
    if ('ontouchstart' in window) {
        window.addEventListener('touchstart', updateMouse, false);
        window.addEventListener('touchmove', updateMouse, false);
    } else {
        window.addEventListener('mousemove', updateMouse, false);
    }

    function updateMouse(e) {
        if (e.changedTouches && e.changedTouches.length) {
            e.x = e.changedTouches[0].pageX;
            e.y = e.changedTouches[0].pageY;
        }
        if (e.x === undefined) {
            e.x = e.pageX;
            e.y = e.pageY;
        }

        // Get mouse value in -1 to 1 range, with y flipped
        mouse.set(
            (e.x / gl.renderer.width) * 2 - 1,
            (e.y / gl.renderer.height) * -2 + 1,
            0
        );
    }

    const colors = [
        new Color('#ff0000'),
        new Color('#00ff00'),
        new Color('#0000ff'),
        new Color('#ffff00'),
        new Color('#00ffff'),
    ];

    // Create a line for each polyline
    for (let i = 0; i < 5; i++) {
        // Create an array of Vec3s (will be populated in update)
        const points = [];
        for (let i = 0; i < 20; i++) {
            points.push(new Vec3());
        }

        const polyline = new Polyline(gl, {
            points,
            vertex,
            fragment,
            uniforms: {
                uColor: {
                    value: colors[i]
                },
                uThickness: {
                    value: 20
                },
                uResolution: {value: new Vec3(gl.canvas.width, gl.canvas.height, 1)},
            },
        });

        polyline.mesh.setParent(scene);

        lines.push({
            points,
            polyline
        });
    }

    // Add spring physics
    const spring = 0.06;
    const friction = 0.85;
    const mouseVelocity = new Vec3();
    const tmp = new Vec3();

    requestAnimationFrame(update);

    function update(t) {
        requestAnimationFrame(update);

        for (let i = lines.length - 1; i >= 0; i--) {
            const {
                points,
                polyline
            } = lines[i];

            // Update points
            for (let j = points.length - 1; j >= 0; j--) {
                if (!j) {
                    tmp.copy(mouse).sub(points[j]).multiply(spring);
                    mouseVelocity.add(tmp).multiply(friction);
                    points[j].add(mouseVelocity);
                } else {
                    points[j].lerp(points[j - 1], 0.9);
                }
            }
            polyline.updateGeometry();
        }

        renderer.render({
            scene,
            camera
        });
    }
}
