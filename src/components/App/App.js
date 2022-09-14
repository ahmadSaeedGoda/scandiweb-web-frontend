import { Route, Routes } from 'react-router-dom';
import AddProduct from "../AddProduct";
import MainContent from "../MainContent";
import NoContent from "../Stateless/NoContent";
import './App.css';

export default function App () {

	return (
		<Routes>
			<Route path="/" element={ <MainContent /> } />

			<Route path="/add-product" element={<AddProduct />} />

			<Route path="*" element={<NoContent />} />
		</Routes>
	);
}
