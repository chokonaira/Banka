// let mainNav = document.getElementById('main__nav__menu');
// let navBarToggle = document.getElementById('navbar__toggle__btn');

// navBarToggle.addEventListener('click', () =>{
//   mainNav.classList.toggle('show');
// });

const mainNav = document.getElementById('js-nav');
const navBarToggle = document.getElementById('toggler');

navBarToggle.addEventListener('click', () => {
  mainNav.classList.toggle('active');
});