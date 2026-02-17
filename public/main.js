// API information
const RAPIDAPI_KEY = '57632502d8msh149293dc76c9924p151b14jsndc1c74c5fd0e';
const API_HOST = 'mashape-community-urban-dictionary.p.rapidapi.com';
const API_BASE = 'https://mashape-community-urban-dictionary.p.rapidapi.com/define';

// Getting html elements
// the text box where user types
const searchInput = document.querySelector('.search-input');
// the search icon
const searchIcon = document.querySelector('.search i');
// the div where result will appear
const resultsContainer = document.getElementById('results');

// Fetching data from API
async function fetchUrbanDefinition(term) {
  const url = `${API_BASE}?term=${encodeURIComponent(term)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY
    }
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Displaying the result (Definition)
// show the result on the screen
function displayDefinition(data) {
  const list = data.list;

  // if no resulf found show no definifiton
  if (!list || list.length === 0) {
    resultsContainer.innerHTML = `
      <div class="result-card result-empty">
        <i class="bi bi-search"></i>
        <p>No definitions found. Try another term.</p>
      </div>
    `;
    return;
  }
  const first = list[0];
  resultsContainer.innerHTML = `
    <div class="result-card">
      <h2 class="result-word">${escapeHtml(first.word)}</h2>
      <p class="result-definition">${escapeHtml(first.definition)}</p>
      ${first.example ? `<p class="result-example">...</p>` : ''}
      <div class="result-meta">
        <span><i class="bi bi-hand-thumbs-up"></i> ${first.thumbs_up || 0}</span>
        <span><i class="bi bi-hand-thumbs-down"></i> ${first.thumbs_down || 0}</span>
      </div>
    </div>
  `;
}

// Makes API text safe before displaying it.
// Prevents HTML or script code from running in the browser.
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// loading state
function showLoading() {
  resultsContainer.innerHTML = `
    <div class="result-card result-loading">
      <i class="bi bi-arrow-repeat spin"></i>
      <p>Looking up definition...</p>
    </div>
  `;
}

// Showing error message if API fail
function showError(message) {
  resultsContainer.innerHTML = `
    <div class="result-card result-error">
      <i class="bi bi-exclamation-triangle"></i>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

// Main search Function
async function handleSearch() {
  // get text from input
  const term = searchInput.value.trim();
  // if user didn't type anything show this message
  if (!term) {
    resultsContainer.innerHTML = `
      <div class="result-card result-empty">
        <i class="bi bi-pencil-square"></i>
        <p>Enter a word or phrase to search.</p>
      </div>
    `;
    return;
  }
  showLoading();
  try {
    const data = await fetchUrbanDefinition(term);
    displayDefinition(data);
  } catch (err) {
    showError(err.message || 'Failed to fetch definition. Please try again.');
  }
}

// Event listeners for interactivity
// when user pressed enter, do the searching
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
// when search icon is clicked. do the searching
searchIcon.addEventListener('click', handleSearch);

// Show a default messsage when page loads
resultsContainer.innerHTML = `
  <div class="result-card result-placeholder">
    <i class="bi bi-book"></i>
    <p>Enter a word above and press Enter or click search to see its Urban Dictionary definition.</p>
  </div>
`;
