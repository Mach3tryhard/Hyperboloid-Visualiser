javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

///VECTOR
let lines = [];
let Circlelines = [];
let pointSpheres = [];

let pointMesh = null; 
let instancedMesh=null;

let currentCylinderMesh = null;
let Circle1mesh = null;
let Circle2mesh = null;
const axesHelper = new THREE.AxesHelper( 1000 );

///SCENA

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

///GUI

const gui = new GUI();
const obj = { 
    Lines: false,
    HighlightedLineShow: false,
    Wireframe: true,
    Surface: false,
    CircleLines:false,
    CircleWireframe:true,
    CirclesSurface:false,
    SurfaceColorNormal:false,
    SurfaceVertexColor:false,
    AxisShow:true,
    ShowPoints:false,
    Radius:7,
    Segments:32,
    Height:22,
    Theta:2*Math.PI,
    Phi:0,
    SurfaceColor: [150, 150, 150],
    LineColor: [255, 255, 255],
    CameraAngle:0,
    x: 15,
    y: 15,
    z: 15,
    CameraAnimate:false,
    PhiAnimate:true,
    Credits: function() { alert( 'Hyperboloid Visualiser made by Sirghe Matei-Stefan for University Algebra and Geometry Course. (En)                                                                 Vizualizator de hiperboloid cu panza realizat de Sirghe Matei-Stefan pentru Cursul Universitar de Algebră si Geometrie. (Ro)' ) }
};

const fisier0 = gui.addFolder('Title');
fisier0.add( document, 'title' );

const fisier1 = gui.addFolder('Display Modes');
fisier1.add(obj,'Lines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Wireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Surface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleLines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleWireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CirclesSurface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier2 = gui.addFolder('Display Settings');
fisier2.add(obj,'AxisShow').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'HighlightedLineShow').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'ShowPoints').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj, 'SurfaceVertexColor').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj, 'SurfaceColorNormal').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.addColor(obj, 'SurfaceColor', 255).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.addColor(obj, 'LineColor', 255).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier3 = gui.addFolder('Display Modes');
fisier3.add(obj,'Radius',0,14).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Segments',2,62,1).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Height',0,44).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Theta',0,2*Math.PI).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
const phiController = fisier3.add(obj,'Phi',0,2*Math.PI).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier4 = gui.addFolder('Camera Functions');
fisier4.add(obj,'CameraAngle',0,2*Math.PI).onChange(() => {UpdateCamera(1)});
const xController = fisier4.add(obj, 'x',-30,30,1).onChange(() => {UpdateCamera(0)});
const yController = fisier4.add(obj, 'y',-30,30,1).onChange(() => {UpdateCamera(0)});
const zController = fisier4.add(obj, 'z',-30,30,1).onChange(() => {UpdateCamera(0)});

const fisier5 = gui.addFolder('Animations');
fisier5.add(obj,'CameraAnimate');
fisier5.add(obj,'PhiAnimate');

const fisier6 = gui.addFolder('Other');
fisier6.add(obj,'Credits');
fisier6.close();


const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function UpdateCamera(_type){
    if(_type==0 && obj.CameraAnimate==false)
        camera.position.set(obj.x, obj.y, obj.z);
    if (_type === 1  && obj.CameraAnimate==false) {
        const radius = Math.sqrt(obj.x ** 2 + obj.z ** 2);
        const angle = obj.CameraAngle;
        GlobAng=obj.CameraAngle;

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        obj.x=x;
        obj.z=z;
        camera.position.set(x, obj.y, z);
    }
    camera.lookAt(0, 0, 0);

    ///UPDATE CONTROLLERS

    xController.setValue(obj.x);
    yController.setValue(obj.y);
    zController.setValue(obj.z);
    xController.updateDisplay();
    yController.updateDisplay();
    zController.updateDisplay();
}
UpdateCamera(0);

function Generate(radius, height, segments) {
    ///STERGE LUCRURILE VECHI
    if (Circle1mesh) {
        Circle1mesh.geometry.dispose();
        Circle1mesh.material.dispose();
        scene.remove(Circle1mesh);
        Circle1mesh = null;
    }
    if (Circle2mesh) {
        Circle2mesh.geometry.dispose();
        Circle2mesh.material.dispose();
        scene.remove(Circle2mesh);
        Circle2mesh = null;
    }

    if (currentCylinderMesh) {
        currentCylinderMesh.geometry.dispose();
        currentCylinderMesh.material.dispose();
        scene.remove(currentCylinderMesh);
        currentCylinderMesh = null;
    }

    while(Circlelines.length>0){
        const line = Circlelines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    while (lines.length > 0) {
        const line = lines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    /*while (pointSpheres.length > 0) {
        const line = pointSpheres.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }*/
    if (pointMesh) {
        // Remove the previous Points object from the scene
        scene.remove(pointMesh);
    
        // Dispose of geometry and material
        pointMesh.geometry.dispose();
        pointMesh.material.dispose();
    
        // Set reference to null to avoid memory leaks
        pointMesh = null;
    }
    if(instancedMesh!=null){
        instancedMesh.geometry.dispose();
        instancedMesh.material.dispose();
        scene.remove(instancedMesh);
    }

    ///MAKE AXIS

    if(obj.AxisShow==true){
        scene.add( axesHelper );
    }
    else{
        axesHelper.dispose();
        scene.remove(axesHelper);
    }

    ///MAKE Lines

    const topCircle = [];
    const bottomCircle = [];
    const SolidDisplay = [];

    for (let i = 0; i < obj.Segments; i++) {
        const angle2 = (i / obj.Segments) * obj.Theta +obj.Phi;
        const x2 = Math.cos(angle2) * radius;
        const z2 = Math.sin(angle2) * radius;
        SolidDisplay.push(new THREE.Vector3(x2, height / 2, z2));
        topCircle.push(new THREE.Vector3(x2, height / 2, z2));
    }

    for (let i = 0; i < obj.Segments; i++) {
        const angle1 = (i / obj.Segments) * obj.Theta;
        const x1 = Math.cos(angle1) * radius;
        const z1 = Math.sin(angle1) * radius;
        SolidDisplay.push(new THREE.Vector3(x1, height / 2, z1));
        bottomCircle.push(new THREE.Vector3(x1, -height / 2, z1));
    }

    for (let i = 0; i < obj.Segments; i++) {
        const start = topCircle[i];
        const end = bottomCircle[i];
        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const isCloseToWhite = obj.LineColor[0] > 180 && obj.LineColor[1] > 180 && obj.LineColor[2] > 180;
        const lineMaterial = new THREE.LineBasicMaterial({
            color: i === 0 && obj.HighlightedLineShow === true
                ? isCloseToWhite 
                    ? new THREE.Color('rgb(255, 0,0)')
                    : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        lines.push(line);
        if(obj.HighlightedLineShow==true && i==0)
            scene.add(line);
        if(obj.Lines==true)
            scene.add(line);
    }
    
    /// MAKE CIRCLE LINES

    for (let i = 0; i < segments; i++) {
        const start = topCircle[i];
        const end = topCircle[(i + 1) % segments];

        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        Circlelines.push(line);
        if (obj.CircleLines) {
            scene.add(line);
        }
    }


    for (let i = 0; i < segments; i++) {
        const start = bottomCircle[i];
        const end = bottomCircle[(i + 1) % segments];

        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        Circlelines.push(line);
        if (obj.CircleLines) {
            scene.add(line);
        }
    }

    ///GENERARE Puncte Pentru obiect
    const vertices = [];
    const indices = [];
    var kon=0;
    if(obj.Theta!=6.283185307179586)kon=obj.Segments-1;
    else kon=obj.Segments;
    for (let i = 0; i < kon; i++) {
        const nextIndex = (i + 1) % obj.Segments;
        const v0 = topCircle[i];
        const v1 = bottomCircle[i]; 
        const v2 = topCircle[nextIndex];
        const v3 = bottomCircle[nextIndex];
        vertices.push(v0.x, v0.y, v0.z);
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);

        const base = i * 4;
        // Faci 2 triunghiuri
        indices.push(base, base + 2, base + 1);
        indices.push(base + 1, base + 2, base + 3);
    }

    /// STERGE CHESTIILE VECHI
    if (currentCylinderMesh) {
        currentCylinderMesh.geometry.dispose();
        currentCylinderMesh.material.dispose();
        scene.remove(currentCylinderMesh);
    }

    ////ARATARE PUNCTE DACA SE VREA

    // Create a BufferGeometry with the positions of your points
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Create a ShaderMaterial to simulate spheres
    const pointMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying float vSize;
            void main() {
                vSize = 10.0; // Control size of points
                gl_PointSize = vSize;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                if (dot(uv, uv) > 1.0) discard; // Create circular points
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Color of points
            }
        `,
        transparent: false,
    });

    // Create a Points object and add it to the scene
    pointMesh = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointMesh);

    /*const numPoints = vertices.length / 3;
    sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    instancedMesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, numPoints);
    if(obj.ShowPoints==true){
        scene.add(instancedMesh);
    }
    const tempMatrix = new THREE.Matrix4();
    for (let i = 0; i < numPoints; i++) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];
        tempMatrix.makeTranslation(x, y, z);
        instancedMesh.setMatrixAt(i, tempMatrix);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;*/

    /*const pointMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const z = vertices[i + 2];

        const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16); 
        const sphere = new THREE.Mesh(sphereGeometry, pointMaterial);

        sphere.position.set(x, y, z);

        scene.add(sphere);

        pointSpheres.push(sphere);
    }*/

    ///Generare forma dupa puncte
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();


    let material=null;
    if(obj.SurfaceColorNormal==false){
        material = new THREE.MeshDepthMaterial({
            wireframe: obj.Wireframe,
            side: THREE.DoubleSide,
            //flatShading: !obj.Wireframe
        });
    }
    if(obj.SurfaceVertexColor==true){
        material = new THREE.MeshStandardMaterial({
            vertexColors:false,
            color:new THREE.Color(`rgb(${obj.SurfaceColor[0]}, ${obj.SurfaceColor[1]}, ${obj.SurfaceColor[2]})`),
            wireframe: obj.Wireframe,
            flatShading:false,
            side: THREE.DoubleSide,
        });
    }
    if(obj.SurfaceColorNormal==true){
        material = new THREE.MeshNormalMaterial({
            wireframe: obj.Wireframe,
            side: THREE.DoubleSide,
            //flatShading: !obj.Wireframe
        });
    }
    currentCylinderMesh = new THREE.Mesh(geometry, material);

    if (obj.Surface || obj.Wireframe) {
        scene.add(currentCylinderMesh);
    }

    ///Generare Cerc
    if (segments > 2) {
        const topVertices = [];
        const topIndices = [];
        for (let i = 0; i < kon; i++) {
            const v0 = topCircle[i];
            const v1 = topCircle[(i + 1) % obj.Segments];
            const vCenter = new THREE.Vector3(0, height / 2, 0);
    
            topVertices.push(v0.x, v0.y, v0.z);
            topVertices.push(v1.x, v1.y, v1.z);
            topVertices.push(vCenter.x, vCenter.y, vCenter.z);
    
            const base = i * 3;
            topIndices.push(base, base + 1, base + 2);
        }
    
        const topGeometry = new THREE.BufferGeometry();
        topGeometry.setAttribute('position', new THREE.Float32BufferAttribute(topVertices, 3));
        topGeometry.setIndex(topIndices);
        topGeometry.computeVertexNormals();
    
        let material2=null;
        if(obj.SurfaceColorNormal==false){
            material2 = new THREE.MeshDepthMaterial({
                wireframe: obj.CircleWireframe,
                side: THREE.DoubleSide,
                //flatShading: !obj.Wireframe
            });
        }
        if(obj.SurfaceVertexColor==true){
            material2 = new THREE.MeshStandardMaterial({
                color:new THREE.Color(`rgb(${obj.SurfaceColor[0]}, ${obj.SurfaceColor[1]}, ${obj.SurfaceColor[2]})`),
                wireframe: obj.CircleWireframe,
                flatShading:false,
                vertexColors:false,
                side: THREE.DoubleSide,
            });
        }
        if(obj.SurfaceColorNormal==true){
            material2 = new THREE.MeshNormalMaterial({
                wireframe: obj.CircleWireframe,
                side: THREE.DoubleSide,
                //flatShading: !obj.Wireframe
            });
        }
    
        Circle1mesh = new THREE.Mesh(topGeometry, material2);
        //Circle1mesh.rotation.x = Math.PI / 2;
        //Circle1mesh.rotation.y = segments/Math.PI;
        Circle1mesh.position.set(0, 0, 0);
    
        const bottomVertices = [];
        const bottomIndices = [];
        for (let i = 0; i < kon; i++) {
            const v0 = bottomCircle[i];
            const v1 = bottomCircle[(i + 1) % obj.Segments];
            const vCenter = new THREE.Vector3(0, -height / 2, 0);
    
            bottomVertices.push(v0.x, v0.y, v0.z);
            bottomVertices.push(v1.x, v1.y, v1.z);
            bottomVertices.push(vCenter.x, vCenter.y, vCenter.z);
    
            const base = i * 3;
            bottomIndices.push(base, base + 1, base + 2);
        }
    
        const bottomGeometry = new THREE.BufferGeometry();
        bottomGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bottomVertices, 3));
        bottomGeometry.setIndex(bottomIndices);
        bottomGeometry.computeVertexNormals();
    
        Circle2mesh = new THREE.Mesh(bottomGeometry, material2);
        //Circle2mesh.rotation.x = Math.PI / 2;
        //Circle2mesh.rotation.z = obj.Phi;
        Circle2mesh.position.set(0, 0, 0);
    
        if (obj.CirclesSurface || obj.CircleWireframe) {
            scene.add(Circle1mesh);
            scene.add(Circle2mesh);
        }
    }
}

Generate(obj.Radius, obj.Height, obj.Segments);

let GlobAng=obj.CameraAngle;

///UPDATE EVERYTHING
function animate() {
    renderer.render(scene, camera);
    controls.update();
    GlobAng+=0.0025;
    if(obj.CameraAnimate==true){
        const radius = Math.sqrt(obj.x ** 2 + obj.z ** 2);

        const x = radius * Math.cos(GlobAng);
        const z = radius * Math.sin(GlobAng);
        camera.position.set(x, obj.y, z);
        camera.lookAt(0, 0, 0);
    }
    if(obj.PhiAnimate==true){
        obj.Phi+=0.01;
        if(obj.Phi>2*Math.PI)obj.Phi=0;
        Generate(obj.Radius, obj.Height, obj.Segments);
        phiController.setValue(obj.Phi);  // Update the controller value
        phiController.updateDisplay();
    }
}
renderer.setAnimationLoop(animate);
