// Function to load a component into a target element
function loadComponent(componentPath, targetElementId) {
    fetch(componentPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(targetElementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading component:', error));
}

// Load header and navigation components
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('_includes/navigation.html', 'nav-container');
});