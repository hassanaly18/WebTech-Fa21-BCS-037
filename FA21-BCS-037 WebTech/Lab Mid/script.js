

    // script.js
document.addEventListener('DOMContentLoaded', function() {
    var image = document.getElementById('img1');
    
    image.addEventListener('mouseover', function() {

        var imageName = image.alt;
        

        var menuItem = document.querySelector('.navbar-nav li:first-child a');
        
        menuItem.innerHTML = imageName;
    });
});
