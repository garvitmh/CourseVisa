document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const dropdowns = document.querySelectorAll('.main-nav .dropdown > a');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            const isMobile = window.getComputedStyle(hamburger).display !== 'none';

            if (isMobile) {
                e.preventDefault(); 
                const parentLi = dropdown.parentElement;
                parentLi.classList.toggle('active');
            }
        });
    });

});
