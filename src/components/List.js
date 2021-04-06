import React from 'react';

import ListRow from './ListRow';

const List = (props) => {
	const gamesData = props.games;

	const getListHeader = () => {
		return (
			<li className='game__row game__row--header'>
				<div className='game__row__entry game__row__entry--rating'>
					BGG Rating
				</div>
				<div className='game__row__entry game__row__entry--img'></div>
				<div className='game__row__entry game__row__entry--title'>
					Titolo
				</div>
				<div className='game__row__entry game__row__entry--regular-price'>
					Prezzo regolare
				</div>
				<div className='game__row__entry game__row__entry--price'>
					Prezzo Scontato
				</div>
				<div className='game__row__entry game__row__entry--discount'>
					Sconto %
				</div>
			</li>
		);
	};
	return (
		<ul className='games__list'>
			{getListHeader()}
			{gamesData &&
				gamesData.map((game, i) => {
					return <ListRow key={i} game={game} />;
				})}
		</ul>
	);
};

export default List;
