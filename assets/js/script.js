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
  ckey: 'V1cwZ2V5MTAwdDZDZ2lMMkt5b1JaWFZ6R3g2dGJOVFBUbVY1dExhNQ=='
};

var countrySelect1 = document.querySelector('.country1'),
  countrySelect2 = document.querySelector('.country2'),
  stateSelect = document.querySelector('.state'),
  citySelect = document.querySelector('.city');

function loadCountries(selectElement) {
  let apiEndPoint = config.cUrl;

  fetch(apiEndPoint, { headers: { "X-CSCAPI-KEY": config.ckey } })
    .then(response => response.json())
    .then(data => {
      data.forEach(country => {
        const option = document.createElement('option');
        option.value = country.iso2;
        option.textContent = country.name;
        selectElement.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading countries:', error));
}

function initialize() {
  loadCountries(countrySelect1);
  loadCountries(countrySelect2);

  // Disable and style state and city selectors initially
  stateSelect.disabled = true;
  citySelect.disabled = true;
  stateSelect.style.pointerEvents = 'none';
  citySelect.style.pointerEvents = 'none';
}

// Call initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);



function loadStates() {
  // Enable state select and reset its options
  stateSelect.disabled = false;
  citySelect.disabled = true;
  stateSelect.style.pointerEvents = 'auto';
  citySelect.style.pointerEvents = 'none';

  const selectedCountryCode = countrySelect1.value; // Use the correct variable
  stateSelect.innerHTML = '<option value="">Select State</option>'; // Clear existing states
  citySelect.innerHTML = '<option value="">Select City</option>'; // Clear existing cities

  if (!selectedCountryCode) return; // Return if no country is selected

  fetch(`${config.cUrl}/${selectedCountryCode}/states`, {
    headers: { "X-CSCAPI-KEY": config.ckey }
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(state => {
        const option = document.createElement('option');
        option.value = state.iso2;
        option.textContent = state.name;
        stateSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading states:', error));
}

function loadCities() {
  // Enable city select and reset its options
  citySelect.disabled = false;
  citySelect.style.pointerEvents = 'auto';

  const selectedCountryCode = countrySelect1.value; // Use the correct variable
  const selectedStateCode = stateSelect.value;
  citySelect.innerHTML = '<option value="">Select City</option>'; // Clear existing cities

  if (!selectedStateCode) return; // Return if no state is selected

  fetch(`${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`, {
    headers: { "X-CSCAPI-KEY": config.ckey }
  })
    .then(response => response.json())
    .then(data => {
      data.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name; // Use city name as value
        option.textContent = city.name;
        citySelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error loading cities:', error));
}

// Add event listeners to detect changes
countrySelect1.addEventListener('change', loadStates); // When a country is selected
stateSelect.addEventListener('change', loadCities); // When a state is selected

window.onload = loadCountries;

// ------------------------------------------------------------------------------------------------

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
