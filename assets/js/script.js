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
const config = {
  cUrl: 'https://api.countrystatecity.in/v1/countries',
  ckey: 'V1cwZ2V5MTAwdDZDZ2lMMkt5b1JaWFZ6R3g2dGJOVFBUbVY1dExhNQ=='
};

const countrySelect1 = document.querySelector('.country1');
const countrySelect2 = document.querySelector('.country2');
const stateSelect = document.querySelector('.state');
const citySelect = document.querySelector('.city');

/**
 * Fetch data from the given API endpoint.
 * @param {string} url - API URL
 * @returns {Promise<any>} - JSON response
 */
async function fetchData(url) {
  try {
    const response = await fetch(url, { headers: { "X-CSCAPI-KEY": config.ckey } });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null; // Return null to signify an error
  }
}

/**
 * Populate a <select> element with data.
 * @param {HTMLSelectElement} selectElement - The select element to populate
 * @param {Array} data - Data to populate with
 * @param {string} valueKey - Key for the option's value
 * @param {string} textKey - Key for the option's display text
 */
/**
 * Populate a <select> element with data, sorted in descending order.
 * @param {HTMLSelectElement} selectElement - The select element to populate
 * @param {Array} data - Data to populate with
 * @param {string} valueKey - Key for the option's value
 * @param {string} textKey - Key for the option's display text
 */
function populateSelect(selectElement, data, valueKey, textKey) {
  if (!(selectElement instanceof HTMLSelectElement)) return;

  selectElement.innerHTML = '<option value="">Select</option>'; // Reset options
  
  if (data && data.length > 0) {
    // Sort the data in descending order by the textKey
    const sortedData = data.sort((a, b) => b[textKey].localeCompare(a[textKey]));

    sortedData.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[textKey];
      selectElement.appendChild(option);
    });
  }
}


/**
 * Load countries into the given select element.
 * @param {HTMLSelectElement} selectElement - The select element
 */
async function loadCountries(selectElement) {
  const countries = await fetchData(config.cUrl);
  if (countries) populateSelect(selectElement, countries, 'iso2', 'name');
}

/**
 * Load states for the selected country.
 */
async function loadStates() {
  const selectedCountryCode = countrySelect1.value;
  resetSelect(stateSelect);
  resetSelect(citySelect);

  if (!selectedCountryCode) return;

  const states = await fetchData(`${config.cUrl}/${selectedCountryCode}/states`);
  if (states) populateSelect(stateSelect, states, 'iso2', 'name');

  // Enable state selector
  toggleSelect(stateSelect, true);
  toggleSelect(citySelect, false);
}

/**
 * Load cities for the selected state.
 */
async function loadCities() {
  const selectedCountryCode = countrySelect1.value;
  const selectedStateCode = stateSelect.value;
  resetSelect(citySelect);

  if (!selectedCountryCode || !selectedStateCode) return;

  const cities = await fetchData(
    `${config.cUrl}/${selectedCountryCode}/states/${selectedStateCode}/cities`
  );
  if (cities) populateSelect(citySelect, cities, 'name', 'name');

  // Enable city selector
  toggleSelect(citySelect, true);
}

/**
 * Reset a <select> element.
 * @param {HTMLSelectElement} selectElement - The select element to reset
 */
function resetSelect(selectElement) {
  if (selectElement instanceof HTMLSelectElement) {
    selectElement.innerHTML = '<option value="">Select</option>';
    toggleSelect(selectElement, false);
  }
}

/**
 * Enable or disable a <select> element.
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {boolean} isEnabled - Whether to enable the element
 */
function toggleSelect(selectElement, isEnabled) {
  selectElement.disabled = !isEnabled;
  selectElement.style.pointerEvents = isEnabled ? 'auto' : 'none';
}

/**
 * Initialize the app.
 */
function initialize() {
  // Load countries into both country selectors
  loadCountries(countrySelect1);
  loadCountries(countrySelect2);

  // Disable state and city selectors initially
  toggleSelect(stateSelect, false);
  toggleSelect(citySelect, false);
}

// Event listeners
document.addEventListener('DOMContentLoaded', initialize);
countrySelect1.addEventListener('change', loadStates);
stateSelect.addEventListener('change', loadCities);
 

// ------------------------------------------------------------------------------------------------



