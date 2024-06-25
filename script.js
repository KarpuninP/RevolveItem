//---------360----------

const viewer = document.getElementById('viewer');
const carImage = document.getElementById('carImage');
const totalImages = 26; // Total number of images
let currentImage = 1; // Current image
let isDragging = false; // Flag indicating dragging
let startX; // Initial X position when dragging
let picFolder = 'pic/test/'; // Path where the pictures are stored
let colors = ['white', 'red', 'yellow']; // List of colors
let currentColor = colors[0]; // Current color, default is the first color in the list
let lastDx = 0; // Last X position change
let autoRotateInterval; // Interval for automatic rotation
const rotationSpeed = 100; // Rotation speed in milliseconds (1 second)
const imageChangeSensitivityFrom = 30; // Sensitivity to finger position changes
const imageChangeSensitivityTo = 60; // Sensitivity to finger position changes

carImage.addEventListener('dragstart', (e) => e.preventDefault()); // Block image dragging

viewer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX; // Remember the initial X position
    viewer.style.cursor = 'grabbing'; // Change the cursor to indicate dragging
    requestAnimationFrame(animate);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    viewer.style.cursor = 'grab'; // Restore the default cursor
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - startX; // Calculate the X position change
        lastDx = dx; // Remember the last X position change
        startX = e.clientX; // Update the initial X position
    }
});
// old function
function animate() {
    if (isDragging) {
        const sensitivity = 5; // Movement sensitivity (adjustable)
        if (Math.abs(lastDx) > sensitivity) { // If the position change is greater than sensitivity
            currentImage += lastDx > 0 ? 1 : -1; // Move to the next or previous image
            if (currentImage > totalImages) {
                currentImage = 1; // If the current image is greater than the total, go to the first
            } else if (currentImage < 1) {
                currentImage = totalImages; // If the current image is less than 1, go to the last
            }
            carImage.src = `${picFolder}${currentColor}/${currentImage}.png`; // Update the image source
        }
        lastDx = 0; // Reset the last X position change
        requestAnimationFrame(animate); // Request the next frame of animation
    }
}

// Function for automatic image rotation
function autoRotate() {
    currentImage++;
    if (currentImage > totalImages) {
        currentImage = 1;
    }
    carImage.src = `${picFolder}${currentColor}/${currentImage}.png`;
}

// Start automatic rotation when the page loads
autoRotateInterval = setInterval(autoRotate, rotationSpeed);

// Stop automatic rotation when clicking on the image
viewer.addEventListener('click', () => {
    clearInterval(autoRotateInterval);
});

// ----------Hammer.js library------------
// Initialize Hammer.js for the viewer element
const hammer = new Hammer(viewer);

// Handle swipe event
hammer.on('panmove', (e) => {

    const dx = e.deltaX; // X position change
    if (Math.abs(dx) > imageChangeSensitivityFrom && Math.abs(dx) < imageChangeSensitivityTo) {
        currentImage += dx > 0 ? 1 : -1;
        if (currentImage > totalImages) {
            currentImage = 1;
        } else if (currentImage < 1) {
            currentImage = totalImages;
        }
        carImage.src = `${picFolder}${currentColor}/${currentImage}.png`;
        // hammer.stop(true); // Stop the current gesture
    }
});

// Stop automatic rotation when dragging starts
hammer.on('panstart', () => {
    clearInterval(autoRotateInterval);
});

// ----------Hammer.js library------------

// Handle device orientation change
window.addEventListener('orientationchange', () => {
    if (window.innerWidth < 768) {
        switch (screen.orientation.type) {
            case "portrait-primary":
            case "landscape-primary":
                document.getElementById('overlay').style.display = 'none';
                break;
            default:
                document.getElementById('overlay').style.display = 'none';
        }
    }
});


const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');


document.getElementById('info').addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

function changeColor(color) {
    currentColor = color;
    carImage.src = `${picFolder}${currentColor}/${currentImage}.png`;
}

const fullscreenButton = document.getElementById('fullscreen');
const exitFullscreenButton = document.getElementById('exitFullscreen');
const infoButton = document.getElementById('info');

fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (viewer.requestFullscreen) {
            viewer.requestFullscreen();
        } else if (viewer.mozRequestFullScreen) { // Firefox
            viewer.mozRequestFullScreen();
        } else if (viewer.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            viewer.webkitRequestFullscreen();
        } else if (viewer.msRequestFullscreen) { // IE/Edge
            viewer.msRequestFullscreen();
        }
        // Check if mobile version is being used
        if (window.innerWidth < 768) {
            switch (screen.orientation.type) {
                case "portrait-primary":
                    document.getElementById('overlay').style.display = 'flex';
                    break;
                case "landscape-primary":
                    document.getElementById('overlay').style.display = 'none';
                    break;
                default:
                    document.getElementById('overlay'). style.display = 'none';
            }
        }
        fullscreenButton.style.display = 'none';
        exitFullscreenButton.style.display = 'block';
    }
});

exitFullscreenButton.addEventListener('click', () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
    // Return the image to its original position
    document.getElementById('overlay').style.display = 'none'; // Hide the dimming element
    fullscreenButton.style.display = 'block';
    exitFullscreenButton.style.display = 'none';
});


// -------------------- vr --------------------



