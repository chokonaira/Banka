const signIn = document.getElementById('sign-in');

signIn.addEventListener('click', (e) => {
	e.preventDefault();
	window.location = 'user-dashboard.html';
});

const mainNav = document.getElementById('js-nav');
const navBarToggle = document.getElementById('toggler');