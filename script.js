document.addEventListener("DOMContentLoaded", () => {
	/**
	 * Set the textContent of an element by id.
	 * @param {string} id - Element id
	 * @param {string} text - Text to set
	 */
	const setText = (id, text) => {
		const el = document.getElementById(id)
		if (el) el.textContent = text
	}

	setText("dog-cell", "Dog API")
	setText("cat-cell", "Cat API")
	setText("weather-cell", "Weather API")
	setText("currency-cell", "Currency API")
	setText("movies-cell", "Movies API")
	setText("github-cell", "GitHub API")
	setText("joke-cell", "Joke API")
	setText("free-choice-cell", "Your Choice API")
})

 // ---- DOG API ----
  async function loadDog() {
		const dogCell = document.getElementById("dog-cell");
		if (!dogCell) return; // guard for null
		dogCell.textContent = "Fetching dog...";

    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await response.json();

      dogCell.innerHTML = `<img src="${data.message}" alt="Random Dog" class="api-img">`;
    } catch (error) {
      dogCell.textContent = "Error loading dog.";
    }
  }

  async function loadCat() {
		const catCell = document.getElementById("cat-cell")
		if (!catCell) return // guard for null
		catCell.textContent = "Fetching cat..."

		try {
			const response = await fetch("https://api.thecatapi.com/v1/images/search")
			const data = await response.json()

			catCell.innerHTML = `<img src="${data[0].url}" alt="Random Cat" class="api-img">`
		} catch (error) {
			catCell.textContent = "Error loading cat."
     }
}
   // ---- WEATHER API ----
async function loadWeather() {
	const weatherCell = document.getElementById("weather-cell");
	if (!weatherCell) return;
	weatherCell.textContent = "Fetching weather...";

	try {
		// Rochester MN coordinates
		const latitude = 44.016369;
		const longitude = -92.475395;

		const response = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
		);
		const data = await response.json();

		const temp = data.current_weather.temperature;
		const wind = data.current_weather.windspeed;

		weatherCell.innerHTML = `
      <div class="weather-box">
        <strong> Rochester  Weather</strong><br>
        Temp: ${temp}°F<br>
        Wind: ${wind} km/h
      </div>
    `;
	} catch (error) {
		weatherCell.textContent = "Weather unavailable.";
	}
}


  // run it AFTER placeholders
	loadDog();
	loadCat();
	loadWeather();
