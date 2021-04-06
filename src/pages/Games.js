import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

import Card from '../components/Card';
import List from '../components/List';

const Games = () => {
	const [gamesData, setGamesData] = useState({ results: [] });
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		// attiva il fetch dei prodotti sulla pagina <currentPage> ogni volta che
		// ne viene incrementato il numero
		fetchGames();
	}, [currentPage]);

	const fetchGames = () => {
		console.log('Fetch DDData page ', currentPage);
		// GET per i prodotti alla pagina <currentPage>
		axios
			.get(`/api/timebomb/${currentPage}`)
			.then((ddResult) => {
				const gamesDD = ddResult.data;

				// se fetch ok, modifica lo stato interno aggiungendo
				// i risultati ricevuti dallo scraping
				setGamesData((prevState) => ({
					...prevState,
					results: [...prevState.results, ...gamesDD.results],
					info: gamesDD.info,
				}));

				// per ogni titolo ottenuto dallo scraping, lancia la
				// chiamata per recuperarne il rating
				gamesDD.results.forEach((game) => {
					axios
						.get(`/api/game/${game.title}`)
						.then((bggResult) => {
							// aggiungo le informazioni di BGG all'oggetto
							game.bggData = bggResult.data;
							// aggiorno lo stato con le nuove informazioni
							setGamesData((prevState) => {
								let games = [...prevState.results];
								games.map((g) => (g.title === game.title ? game : g));
								return {
									...prevState,
									results: [...games],
								};
							});
						})
						.catch((e) => {
							console.log(`Errore nel fetch /api/game/${game.title}`, e);
						});
				});
			})
			.catch((e) => {
				console.log(`Errore nel fetch /api/timebomb/${currentPage}`, e);
			});
	};

	const handlecurrentPage = () => {
		// se non si è ancora raggiunto il numero massimo
		// di pagine aumenta il <currentPage>
		if (currentPage < gamesData.info.pages) {
			setCurrentPage((prevState) => prevState + 1);
		}
	};

	const renderGamesList = () => {
		if (gamesData.results && gamesData.info) {
			// InfiniteScroll esegue lo scraping dei risultati non appena
			// raggiunge il termine della lista, se <currentPage> non ha ancora raggiunto
			// il suo valore massimo
			return (
				<InfiniteScroll
					dataLength={gamesData.results.length}
					next={handlecurrentPage}
					height={600}
					hasMore={currentPage < gamesData.info.pages}
					loader={
						<div className='card__loader card__loader--infinite'>
							<FontAwesomeIcon icon={faSpinner} spin />
						</div>
					}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>Fine dei risultati</b>
						</p>
					}>
					<List games={gamesData.results} />
				</InfiniteScroll>
			);
		} else {
			return (
				<div className='card__loader'>
					<FontAwesomeIcon icon={faSpinner} spin />
				</div>
			);
		}
	};

	return (
		<section className='games'>
			<Card className='games__container'>
				<h1 className='card__title'>TimeBomb!</h1>
				<div className='card__content'>{renderGamesList()}</div>
			</Card>
		</section>
	);
};

export default Games;
