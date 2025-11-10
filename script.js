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

	// ---- DOG API ----
	async function loadDog() {
		const dogCell = document.getElementById("dog-cell")
		if (!dogCell) return // guard for null
		dogCell.textContent = "Fetching dog..."

		try {
			const response = await fetch("https://dog.ceo/api/breeds/image/random")
			const data = await response.json()

			dogCell.innerHTML = `<img src="${data.message}" alt="Random Dog" class="api-img">`
		} catch (error) {
			dogCell.textContent = "Error loading dog."
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
		const weatherCell = document.getElementById("weather-cell")
		if (!weatherCell) return
		weatherCell.textContent = "Fetching weather..."

		try {
			// Rochester MN coordinates
			const latitude = 44.016369
			const longitude = -92.475395

			const response = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
			)
			const data = await response.json()

			const temp = data.current_weather.temperature
			const wind = data.current_weather.windspeed

			// Convert Celsius to Fahrenheit and format values
			const tempF = ((temp * 9) / 5 + 32).toFixed(1)
			const windRounded = Number(wind).toFixed(1)

			weatherCell.innerHTML = `
				<div class="weather-box">
					<strong> Rochester Weather</strong><br>
					Temp: ${tempF}°F<br>
					Wind: ${windRounded} km/h
				</div>
			`
		} catch (error) {
			weatherCell.textContent = "Weather unavailable."
		}
	}
	// ---- CURRENCY API ----
	async function loadCurrency() {
		const currencyCell = document.getElementById("currency-cell")
		if (!currencyCell) return
		currencyCell.textContent = "Fetching currency..."

		try {
			// Get USD to EUR conversion
			const response = await fetch(
				"https://api.exchangerate-api.com/v4/latest/USD"
			)
			const data = await response.json()

			// Use Guatemalan Quetzal (GTQ). If GTQ isn't available, fall back to EUR then display 'N/A'.
			const usdToGtqRaw = data.rates && data.rates.GTQ
			const usdToEurRaw = data.rates && data.rates.EUR
			const usdToGtq =
				typeof usdToGtqRaw !== "undefined"
					? Number(usdToGtqRaw).toFixed(2)
					: null
			const usdFallback =
				typeof usdToEurRaw !== "undefined"
					? Number(usdToEurRaw).toFixed(2)
					: null

			const displayRate = usdToGtq ?? usdFallback ?? "N/A"
			const displayLabel = usdToGtq ? "GTQ" : usdFallback ? "EUR" : ""

			currencyCell.innerHTML = `
			<div class="currency-box">
				<strong>Currency</strong><br>
				1 USD = ${displayRate} ${displayLabel}
			</div>
		`
		} catch (error) {
			currencyCell.textContent = "Currency data unavailable."
		}
	}
	// ---- MOVIES API (TMDb) ----
	// If `title` is provided, search TMDb for that title; otherwise show trending.
	/**
	 * @param {string} [title]
	 */
	async function loadMovies(title) {
		const moviesCell = document.getElementById("movies-cell")
		if (!moviesCell) return
		moviesCell.textContent = "Fetching movies..."

		try {
				const apiKey = "137124cc58b5c81f3a8e92b442c4dfea"
				let url;
				if (title) {
					url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
				} else {
					url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
				}

				const response = await fetch(url)
				const data = await response.json()

				const movie = data.results && data.results[0]
				if (!movie) {
					moviesCell.textContent = "No movie found.";
					return;
				}

				const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "";

				moviesCell.innerHTML = `
				  <div class="movie-box">
				    <strong>${movie.title}</strong><br>
				    ⭐ ${movie.vote_average || "N/A"}<br>
				    ${poster ? `<img src="${poster}" class="api-img" alt="${movie.title}">` : ""}
				  </div>
				`
		} catch (error) {
			moviesCell.textContent = "Movie unavailable."
		}
	}
	// Add movie search controls to the movies cell so users can request any title
	const moviesCellForControls = document.getElementById("movies-cell")
	if (moviesCellForControls) {
		const controls = document.createElement("div")
		controls.className = "movie-controls"
		controls.innerHTML = `<input id="movie-input" placeholder="Search movie title..." /> <button id="movie-search">Search</button>`
		// Insert controls at top of the movies cell
		moviesCellForControls.prepend(controls)

		const input = controls.querySelector("#movie-input")
		const btn = controls.querySelector("#movie-search")
		if (btn && input) {
			/** @type {HTMLInputElement} */
			const inputEl = /** @type {HTMLInputElement} */ (input)
			/** @type {HTMLButtonElement} */
			const btnEl = /** @type {HTMLButtonElement} */ (btn)
			btnEl.addEventListener("click", () =>
				loadMovies(inputEl.value || "Gladiator")
			)
			inputEl.addEventListener("keyup", (e) => {
				if (e && /** @type {KeyboardEvent} */ (e).key === "Enter")
					loadMovies(inputEl.value || "Gladiator")
			})
		}
	}
	// run it AFTER placeholders
	loadDog();
	loadCat();
	loadWeather();
	loadCurrency();
	loadMovies();
})