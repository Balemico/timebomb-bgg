import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';

import Games from './pages/Games';

const App = () => {
	return (
		<Router>
			<Switch>
				<Route path='/' exact>
					<Games />
				</Route>
			</Switch>
			<Redirect to='/' />
		</Router>
	);
};

export default App;
