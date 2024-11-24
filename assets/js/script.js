// Smooth scroll for navigation links on each page
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement.id != 'our-app') {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }else{
      targetElement.scrollIntoView({ behavior: 'smooth'});
    }
  });
});


// Theme switcher on each page
const themeSwitchers = document.querySelectorAll('#themeSwitch');
themeSwitchers.forEach(themeSwitch => {
  themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
});

// Intersection Observer for each section on each page
const sections = document.querySelectorAll('section');
sections.forEach(section => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.5 });

  observer.observe(section);
});

// Create an Intersection Observer instance
const observer = new IntersectionObserver(observerCallback, {
  threshold: 0.5, // The section needs to be at least 50% visible to trigger the animation
});


// Observe each section
sections.forEach(section => {
  observer.observe(section);
});
// ----------------------------------------------------------------------------------------------------
// Form submission handling
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your message has been sent!');
    form.reset();  // Clear the form after submission
  });
});
// Form validation
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get form inputs
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validate password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const passwordMatch = password === confirmPassword;
  const passwordLength = password.length >= 8;
  const passwordUppercase = /[A-Z]/.test(password);
  const passwordLowercase = /[a-z]/.test(password);

  // Show error messages
  const passwordMatchError = document.getElementById('password-match-error');
  const passwordLengthError = document.getElementById('password-length-error');
  const passwordUppercaseError = document.getElementById('password-uppercase-error');
  const passwordLowercaseError = document.getElementById('password-lowercase-error');

  passwordMatchError.style.display = passwordMatch ? 'none' : 'block';
  passwordLengthError.style.display = passwordLength ? 'none' : 'block';
  passwordUppercaseError.style.display = passwordUppercase ? 'none' : 'block';
  passwordLowercaseError.style.display = passwordLowercase ? 'none' : 'block';

  // Submit form if all validations pass
  if (passwordMatch && passwordLength && passwordUppercase && passwordLowercase) {
    // Your form submission logic here
    console.log('Form submitted successfully!');
  }
});

var config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
}


var countrySelect = document.querySelector('.country'),
  stateSelect = document.querySelector('.state'),
  citySelect = document.querySelector('.city')


function loadCountries() {

  let apiEndPoint = config.cUrl

  fetch(apiEndPoint, {headers: {"X-CSCAPI-KEY": config.ckey}})
  .then(Response => Response.json())
  .then(data => {
      // console.log(data);

      data.forEach(country => {
          const option = document.createElement('option')
          option.value = country.iso2
          option.textContent = country.name 
          countrySelect.appendChild(option)
      })
  })
  .catch(error => console.error('Error loading countries:', error))

  stateSelect.disabled = true
  citySelect.disabled = true
  stateSelect.style.pointerEvents = 'none'
  citySelect.style.pointerEvents = 'none'
}


function loadStates() {
  stateSelect.disabled = false
  citySelect.disabled = true
  stateSelect.style.pointerEvents = 'auto'
  citySelect.style.pointerEvents = 'none'

  const selectedCountryCode = countrySelect.value
  // console.log(selectedCountryCode);
  stateSelect.innerHTML = '<option value="">Select State</option>' // for clearing the existing states
  citySelect.innerHTML = '<option value="">Select City</option>' // Clear existing city options

  fetch(`${config.cUrl}/${selectedCountryCode}/states`, {headers: {"X-CSCAPI-KEY": config.ckey}})
  .then(response => response.json())
  .then(data => {
      // console.log(data);

      data.forEach(state => {
          const option = document.createElement('option')
          option.value = state.iso2
          option.textContent = state.name 
          stateSelect.appendChild(option)
      })
  })
  .catch(error => console.error('Error loading countries:', error))
}


function loadCities() {
  citySelect.disabled = false
  citySelect.style.pointerEvents = 'auto'

  const selectedCountryCode = countrySelect.value
  const selectedStateCode = stateSelect.value
  // console.log(selectedCountryCode, selectedStateCode);

  citySelect.innerHTML = '<option value="">Select City</option>' // Clear existing city options

  fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {headers: {"X-CSCAPI-KEY": config.ckey}})
  .then(response => response.json())
  .then(data => {
      // console.log(data);

      data.forEach(city => {
          const option = document.createElement('option')
          option.value = city.iso2
          option.textContent = city.name 
          citySelect.appendChild(option)
      })
  })
}

window.onload = loadCountries