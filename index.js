//https://rickandmortyapi.com/api/character
const charactersPerPage = 20;
let currentPage = 1;
let totalCharacters = 0;

const charactersListEl = document.querySelector(".container-wrapper");
const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("input", search);

async function fetchCharacters(page) {
  const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
  const data = await response.json();
  totalCharacters = data.info.count;
  return data.results;
}

async function characters() {
  const charactersData = await fetchCharacters(currentPage);
  renderCharacters(charactersData);
  renderPagination();
}

async function search() {
  const value = searchInput.value; // Get the value from the search input field

  const response = await fetch(`https://rickandmortyapi.com/api/character?name=${value}`);
  const data = await response.json();
  totalCharacters = data.info.count; // Update the total number of characters

  currentPage = 1; // Reset to the first page when searching
  renderCharacters(data.results);
  renderPagination();
}

function getTotalPages() {
  return Math.ceil(totalCharacters / charactersPerPage);
}

function handlePaginationClick(action) {
  const totalPages = getTotalPages();

  switch (action) {
    case "prev":
      currentPage = currentPage > 1 ? currentPage - 1 : 1;
      break;
    case "next":
      currentPage = currentPage < totalPages ? currentPage + 1 : totalPages;
      break;
    default:
      break;
  }

  // Ensure the current page is within the valid range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  fetchAndRenderCharacters();
  renderPagination();
}

async function fetchAndRenderCharacters() {
  const charactersData = await fetchCharacters(currentPage);
  renderCharacters(charactersData);
}

function renderCharacters(charactersData) {
  charactersListEl.innerHTML = charactersData.map((character) => characterHTML(character)).join("");
}

function renderPagination() {
  const totalPages = getTotalPages();
  const paginationButtons = `
    <button class="pagination-button" onclick="handlePaginationClick('prev')" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    <button class="pagination-button" onclick="handlePaginationClick('next')" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;

  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = paginationButtons;
}

characters();

function characterHTML(character) {
  return `
    <div href="character.html"> 
      <div class="container">
        <div class="wrapper">
          <img class="char-img" src="${character.image}" alt="">
          <h1 class="char-name">Name: ${character.name}</h1>
          <h2 class="char-status">Status: ${character.status}</h2>
          <h2 class="type">Species: ${character.species}</h2>
        </div>
      </div>
    </div>
  `;
}
