import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AddProduct from "../AddProduct";
import { fetchDataService } from '../../services/fetchDataService';
import getBaseUrl from '../../services/serverUrlRetriever';
import MainContent from "../MainContent";
import NoContent from "../Stateless/NoContent";
import { productTypesResponseToProductTypeModelsArrayTransformer } from '../../transformers/productTypesResponseToProductTypeModelsArray.transformer';
import { productTypesResponseToDropdownOptionsListTransformer } from '../../transformers/productTypesResponseToDropdownOptionsList.transformer';
import './App.css';

export default function App () {

    const [productTypes, setProductTypes] = useState([]);

    const [productTypesOptions, setProductTypesOptions] = useState([]);

	useEffect(() => {
		fetchDataService({
			url: `${getBaseUrl()}/products/types`,
			body: {method: "GET"}
		})
		.then(
			body => {
				setProductTypes(
					productTypesResponseToProductTypeModelsArrayTransformer(body.data)
				);

				setProductTypesOptions(
					productTypesResponseToDropdownOptionsListTransformer(body.data)
				);
			}
		);
	}, []);

	return (
		<Routes>
			<Route path="/" element={ <MainContent /> } />

			<Route
				path="/add-product"
				element={<AddProduct productTypes={productTypes} productTypesOptions={productTypesOptions} />}
			/>

			<Route path="*" element={<NoContent />} />
		</Routes>
	);
}
