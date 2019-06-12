const app = document.querySelector('#app');
app.innerHTML = window.location.pathname;
app.classList.add('prerender');
document.getElementsByTagName('script')[0].remove();
