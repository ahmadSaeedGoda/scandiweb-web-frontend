import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainContent from "../../MainContent";
import AddProduct from "../../AddProduct";
import NoContent from "../NoContent";
import './App.css';

export default function App () {
	return (
		<Routes>
			<Route path="/" element={ <MainContent /> } />
			<Route path="/add-product" element={ <AddProduct /> } />
			<Route path="*" element={<NoContent />} />
		</Routes>
	);
}
