import React, { useCallback, useEffect, useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchMoviesHandler = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			//https://swapi.dev/api/films - The Star wars API
			const response = await fetch('https://react-http-a82d2-default-rtdb.europe-west1.firebasedatabase.app/movies.json');
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			const data = await response.json();
			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate
				});
			}
			setMovies(loadedMovies);
		} catch (error) {
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchMoviesHandler();

		return () => {};
	}, [fetchMoviesHandler]);

	async function addMovieHandler(movie) {
		const response = await fetch('https://react-http-a82d2-default-rtdb.europe-west1.firebasedatabase.app/movies.json', {
			method: 'POST',
			body: JSON.stringify(movie),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		console.log(data);
	}

	let content = <h1>Found no movies</h1>;
	if (movies.length > 0) content = <MoviesList movies={movies} />;
	if (error) content = <h1>{error}</h1>;
	if (isLoading) content = <h1>Loading...</h1>;

	return (
		<React.Fragment>
			<section>
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
