// 1. Scroll Reveal Animation
function reveal() {
    let reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 150) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);

// 2. Member Interaction
function revealMember(name, info) {
    const displayBox = document.getElementById('member-display');
    document.getElementById('m-name').innerText = name;
    document.getElementById('m-info').innerText = info;
    
    displayBox.style.transform = "scale(1.05)";
    setTimeout(() => { displayBox.style.transform = "scale(1)"; }, 150);
}
let currentVideoUrl = "";

function openStrategyModal(icon, title, explanation, videoUrl) {
    const modal = document.getElementById('infoModal');
    
    // Set text content
    document.getElementById('info-icon').innerText = icon;
    document.getElementById('info-title').innerText = title;
    document.getElementById('info-text').innerText = explanation;
    currentVideoUrl = videoUrl;

    // Show explanation view, hide video view
    document.getElementById('modal-info-view').style.display = "block";
    document.getElementById('modal-video-view').style.display = "none";
    
    // Play button logic
    document.getElementById('play-video-btn').onclick = function() {
        document.getElementById('modal-info-view').style.display = "none";
        document.getElementById('modal-video-view').style.display = "block";
        document.getElementById('videoPlayer').src = currentVideoUrl + "?autoplay=1";
    };

    modal.style.display = "flex";
}

function backToInfo() {
    document.getElementById('videoPlayer').src = "";
    document.getElementById('modal-info-view').style.display = "block";
    document.getElementById('modal-video-view').style.display = "none";
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    document.getElementById('videoPlayer').src = "";
    modal.style.display = "none";
}

// Update the window click listener to use the new modal ID
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) { closeModal(); }
}
// 3. 3D Rotating Globe logic
window.addEventListener('load', function() {
    (function() {
        const container = document.getElementById('crisis-globe-container');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // --- FIXED TEXTURE LOADER ---
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous'); // This allows the image to load from the web
        
        const earthTexture = loader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            function (texture) {
                // Success: texture loaded
                renderer.render(scene, camera);
            },
            undefined,
            function (err) {
                console.error("Texture failed to load. Try a different URL.");
            }
        );

        const material = new THREE.MeshStandardMaterial({ 
            map: earthTexture,
            metalness: 0.1,
            roughness: 0.8 
        });
        
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(5, 3, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        camera.position.z = 4.5;

        function animateGlobe() {
            requestAnimationFrame(animateGlobe);
            globe.rotation.y += 0.002; 
            renderer.render(scene, camera);
        }

        window.addEventListener('resize', () => {
            if(container.offsetWidth > 0) {
                camera.aspect = container.offsetWidth / container.offsetHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.offsetWidth, container.offsetHeight);
            }
        });

        animateGlobe();
    })();
});