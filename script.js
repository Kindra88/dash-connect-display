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
	const apiKey = "137124cc58b5c81f3a8e92b442c4dfea"

	/**
	 * Returns a valid poster image URL or a placeholder if missing.
	 * @param {string | null | undefined} path
	 * @returns {string}
	 */
	const posterURL = (path) =>
		path
			? `https://image.tmdb.org/t/p/w200${path}`
			: "https://via.placeholder.com/120x180?text=No+Image"

	/**
	 * Sets up the movie search bar and event listeners.
	 */
	function setupMovieSearch() {
		const container = document.getElementById("movies-cell")
		if (!container || container.querySelector(".movie-controls")) return

		const controls = document.createElement("div")
		controls.className = "movie-controls"
		controls.innerHTML = `
    <input id="movie-input" type="text" placeholder="Search movie title...">
    <button id="movie-search-btn">Search</button>
  `
		container.insertBefore(controls, container.firstChild)

		const input = controls.querySelector("#movie-input")
		const button = controls.querySelector("#movie-search-btn")

		// ✅ Create output area if missing (search bar stays untouched)
		let outputArea = document.getElementById("movies-output")
		if (!outputArea) {
			outputArea = document.createElement("div")
			outputArea.id = "movies-output"
			container.appendChild(outputArea)
		}
		const output = outputArea

		const runSearch = async () => {
			const title = input.value.trim()
			if (!title) return loadTrendingMovies()

			output.textContent = "Searching..."
			try {
				const resp = await fetch(
					`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
						title
					)}`
				)
				const data = await resp.json()
				if (!data.results || data.results.length === 0) {
					output.textContent = "No results found."
					return
				}

				const movies = data.results.slice(0, 2)
				output.innerHTML = movies
					.map(
						(m) => `
          <div class="movie-box">
            <strong>${m.title}</strong>
            <div>⭐ ${m.vote_average ?? "N/A"}</div>
            <img src="${posterURL(m.poster_path)}" class="api-img" alt="${m.title
							}">
          </div>`
					)
					.join("")
			} catch (err) {
				console.error("Error fetching movie data", err)
				output.textContent = "Error fetching movie."
			}
		}

		button.addEventListener("click", runSearch)
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") runSearch()
		})
	}

	/**
	 * Load trending movies from TMDB and display top 2.
	 */
	async function loadTrendingMovies() {
		const container = document.getElementById("movies-cell")
		if (!container) return

		const outputArea = container.querySelector("#movies-output")
		if (outputArea) outputArea.textContent = "Loading movies..."

		try {
			const resp = await fetch(
				`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`
			)
			const data = await resp.json()

			if (!data || !data.results || data.results.length === 0) {
				if (outputArea) outputArea.textContent = "No movies available."
				return
			}

			/** @type {Array<{ title: string, vote_average?: number, poster_path?: string }>} */
			const movies = data.results.slice(0, 2) // only 2 movies
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
          </div>`
				)
				.join("")

			if (outputArea) outputArea.innerHTML = moviesHTML
		} catch (err) {
			if (outputArea) outputArea.textContent = "Error loading movies 😭"
			console.error(err)
		}
	}

	// ---- JOKES CELL ----
	function setupJokeCell() {
		const jokes = [
			`"Knock, knock." 
			"Who’s there?" ... very long pause ..."Java."`,
			`"Knock knock!" "Who is there?" "Yah!" "Yah who?" "No, not Yahoo — Google."`,
			`Q. Why did the monkey fall from the tree? A. Its node got deleted.`,
			`Q. What do you call when 8 mosquitos bit you? A. A mosquito byte.`,
			`Why did the CSS selector go to therapy? It had too many issues with class.`,
			`Why did the HTML and CSS break up? Because they had too many issues with class.`,
			`Why did the JavaScript developer break up with React? Because they couldn't handle the Inter-DOMinational differences.`,
			`How do you comfort a JavaScript bug? You console it.`,
			`Why did the JavaScript developer go broke? Because he used up all his cache.`,
			`Why did the React class component feel relieved? Because it was now off the hook.`,
		]

		const jokeText = document.getElementById("joke-text")
		const jokeButton = document.getElementById("joke-button")

		// Randomizer
		function showRandomJoke() {
			const randomIndex = Math.floor(Math.random() * jokes.length)
			jokeText.textContent = jokes[randomIndex]
		}

		jokeButton.addEventListener("click", showRandomJoke)
	}

	// ---- GITHUB API ----//

	async function loadGitHubProfile() {
		const username = "Kindra88";
		const url = `https://api.github.com/users/${username}`;

		const container = document.getElementById("github-content");
		if (!container) return;

		container.textContent = "Loading GitHub data...";

		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error("GitHub API request failed");

			const data = await response.json();

			container.innerHTML = `
      <img src="${data.avatar_url}" alt="GitHub Avatar">
      <h3>${data.login}</h3>
      <p>Public Repos: ${data.public_repos}</p>
      <p>Followers: ${data.followers}</p>
      <a href="${data.html_url}" target="_blank">View Profile</a>
    `;
		} catch (error) {
			container.innerHTML = "<p>Could not load GitHub data.</p>";
			console.error(error);
		}
	}


	// ---- RUN AFTER PLACEHOLDERS ----
	try {
		loadDog();
		loadCat();
		loadWeather();
		loadCurrency();
	} catch (e) {
		console.warn("Some API loaders not defined yet — skipping extras.");
	}


		setupMovieSearch();
		loadTrendingMovies();
		setupJokeCell();
		loadGitHubProfile();
	});