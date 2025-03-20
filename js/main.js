
// function checkWidth() {
//     var windowWidth = $(window).width();
    
//     if (windowWidth < 768) {
//         $("#products-gallery").addClass("mt-40");
//     } else {
//         $("#products-gallery").removeClass("mt-40");
//     }
// }

// checkWidth();

// $(window).resize(function() {
//     checkWidth();
// });


const burger = document.querySelector('.burger');
const burgerSpan = document.querySelector('.burger span');
const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menu li');

burger.addEventListener('click', () => {
    document.body.classList.toggle("no-scroll");
    menu.classList.toggle('open');
    burgerSpan.classList.toggle('open-burger');
});


document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !burger.contains(event.target)) {
        menu.classList.remove('open');
        document.body.classList.remove("no-scroll");
        burgerSpan.classList.remove('open-burger');
        menuItems.forEach(item => {
            item.classList.remove('open');
        });
    }
});

