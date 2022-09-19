import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import {render, screen} from '@testing-library/react';

import App from './App';

test("renders without crashing", () => {
	render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
});

test('renders ADD Button text', async () => {
	render(
		<BrowserRouter>
			<App />
		</BrowserRouter>
	);
	
	expect(screen.getByRole('button', {name: 'ADD'})).toBeInTheDocument();
});
