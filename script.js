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
	// ---- MOVIES API ----
	// Simple trending loader (shows top 2 titles).
	const apiKey = "137124cc58b5c81f3a8e92b442c4dfea";

	/**
	 * Returns a valid poster image URL or a placeholder if missing.
	 * @param {string | null | undefined} path
	 * @returns {string}
	 */
	const posterURL = (path) =>
		path
			? `https://image.tmdb.org/t/p/w200${path}`
			: "https://via.placeholder.com/120x180?text=No+Image";

	/**
	 * Load trending movies from TMDB and display top 2.
	 */
	async function loadTrendingMovies() {
		const container = document.getElementById("movies-cell");
		if (!container) return;

		// ✅ FIX: Only affect the movie output area, not the entire cell
		const out = container.querySelector("#movies-output");
		if (out) out.textContent = "Loading movies...";

		try {
			const resp = await fetch(
				`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
			);
			const data = await resp.json();

			if (!data || !data.results || data.results.length === 0) {
				if (out) out.textContent = "No movies available.";
				return;
			}

			// ✅ If output area doesn’t exist, create it (search bar stays untouched)
			let outputArea = document.getElementById("movies-output");
			if (!outputArea) {
				outputArea = document.createElement("div");
				outputArea.id = "movies-output";
				container.prepend(outputArea);
			}

			/** @type {Array<{ title: string, vote_average?: number, poster_path?: string }>} */
			const movies = data.results.slice(0, 2); // only 2 movies

			const moviesHTML = movies
				.map(
					(movie) => `
          <div class="movie-box">
            <strong>${movie.title}</strong>
            <div>⭐ ${movie.vote_average ?? "N/A"}</div>
            <img
              src="${posterURL(movie.poster_path)}"
              class="api-img"
              alt="${movie.title}"
              loading="lazy"
            >
          </div>
        `
				)
				.join("");

			outputArea.innerHTML = moviesHTML;
		} catch (err) {
			if (out) out.textContent = "Error loading movies 😭";
			console.error(err);
		}
	}
	
	// Run it AFTER placeholders
	// (Temporarily comment out if those functions aren’t defined yet)
	try {
		loadDog();
		loadCat();
		loadWeather();
		loadCurrency();
	} catch (e) {
		console.warn("Some API loaders not defined yet — skipping extras.");
	}
	loadTrendingMovies();
})