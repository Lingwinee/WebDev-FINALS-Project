// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
  });
  
  // Form submission handling
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your message has been sent!');
    form.reset();  // Clear the form after submission
  });
  
  const themeSwitch = document.getElementById('themeSwitch');
  
  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });