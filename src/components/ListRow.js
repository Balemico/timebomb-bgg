import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faQuestion,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const ListItem = (props) => {
	const game = props.game;

	const renderLinkedTitle = () => {
		if (game.bggData && game.bggData.bgg_url) {
			return (
				<a
					href={game.bggData.bgg_url}
					target='_blank'
					rel='noopener noreferrer'>
					<p>{game.title}</p>
				</a>
			);
		} else {
			return <p>{game.title}</p>;
		}
	};

	const renderGameImage = () => {
		if (game.img) {
			return (
				<a href={game.url}>
					<img
						src={game.img}
						alt={game.title}
						target='_blank'
						nrel='noopener noreferrer'
					/>
				</a>
			);
		} else {
			return (
				<div className='no-thumb'>
					<FontAwesomeIcon icon={faQuestion} />
				</div>
			);
		}
	};

	const renderRating = () => {
		if (game.bggData) {
			return game.bggData.bgg_rating > 0 ? (
				<span
					className={`rating__container ${
						game.bggData.target === 'Searched'
							? 'rating__container--searched'
							: null
					}`}>
					<p>{game.bggData.bgg_rating}</p>
				</span>
			) : (
				<span className='rating__container rating__container--empty'>
					<p>N/A</p>
				</span>
			);
		} else {
			return <FontAwesomeIcon icon={faSpinner} spin />;
		}
	};
	return (
		<li className='game__row'>
			<div className='game__row__entry game__row__entry--rating'>
				{renderRating()}
			</div>
			<div className='game__row__entry game__row__entry--img'>
				{renderGameImage()}
			</div>
			<div className='game__row__entry game__row__entry--title'>
				{renderLinkedTitle()}
			</div>
			<div className='game__row__entry game__row__entry--regular-price'>
				<p>{game.regular_price}</p>
			</div>
			<div className='game__row__entry game__row__entry--price'>
				<p>{game.price}</p>
			</div>
			<div className='game__row__entry game__row__entry--discount'>
				<p>{game.discount}</p>
			</div>
		</li>
	);
};

export default ListItem;
