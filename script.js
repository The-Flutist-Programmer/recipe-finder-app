const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getRecipes();
  }
});

async function getRecipes() {
  const query = document.getElementById('searchInput').value;

  if (!query) {
    return;
  }

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<div class="loader"></div>';

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await res.json();

    if (!data.meals) {
      resultsDiv.innerHTML = '<p>No recipes found. Try another search!</p>';
      return;
    }

    resultsDiv.innerHTML = data.meals
      .map(
        (meal) => `
          <div class="card" onclick="showRecipe('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
          </div>
        `
      )
      .join('');
  } catch (error) {
    resultsDiv.innerHTML =
      '<p>Error fetching recipes. Please try again later.</p>';
  }
}

async function showRecipe(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  const meal = data.meals[0];
  const instructionsFormatted = meal.strInstructions.split('.');
  let liContent = '';

  instructionsFormatted.forEach((instruction) => {
    if (instruction) {
      liContent += `<li class="mealInstructions">${instruction}</li>`; // Append HTML for each item
    }
  }); 
  document.getElementById('modalInstructions').innerHTML = liContent;

  document.getElementById('modalTitle').textContent = meal.strMeal;
  document.getElementById('modalImage').src = meal.strMealThumb;
  document.getElementById('recipeModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('recipeModal').style.display = 'none';
}
