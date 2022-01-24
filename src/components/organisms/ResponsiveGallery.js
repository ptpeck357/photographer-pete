import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Gallery from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';

import { Tabs, Tab, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';

import { MDBNavbarNav, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from 'mdb-react-ui-kit';
import NavBarItem from '../atoms/NavBarItem';
import NavBarLink from '../atoms/NavBarLink';

import { shuffleArray } from '../../utils/helpers/functions';

const ResponsiveGallery = ({ imageArrayProp, showFilter }) => {
	const [imageArray, setImageArray] = useState([]);
	const [filterType, setFilterType] = useState('*');
	const [currentImage, setCurrentImage] = useState(0);
	const [viewerIsOpen, setViewerIsOpen] = useState(false);

	const openLightbox = useCallback((event, { photo, index }) => {
		setCurrentImage(index);
		setViewerIsOpen(true);
	}, []);

	const closeLightbox = () => {
		setCurrentImage(0);
		setViewerIsOpen(false);
	};

	const filterImage = (filterType) => {
		let imagesCopy = imageArrayProp;

		let newArray = imagesCopy.filter((img) => {
			let searchValue = img.category;
			return searchValue.includes(filterType);
		});

		if(filterType === '*'){
			newArray = shuffleArray(newArray);
		}

		setImageArray(newArray);
	};

	const renderFilter = () => {
		const cursorStyle = { cursor: 'pointer' };

		return (
			<Tabs id="Tab" defaultTab="one" className="GalleryContainer">
				<TabList className="TabList" style={{ border: 'none', margin: '0em 0 1em 0em', color: 'black' }}>
					<Tab style={cursorStyle} tabFor="one" onClick={() => filterImage('*')}>Home</Tab>
					<Tab style={cursorStyle} tabFor="six" onClick={() => filterImage('people')}>People</Tab>
					<Tab style={cursorStyle} tabFor="five" onClick={() => filterImage('nightsky')}>Night Sky</Tab>
					<Tab style={cursorStyle} tabFor="three" onClick={() => filterImage('washington')}>Washington</Tab>
					<Tab style={cursorStyle} tabFor="two" onClick={() => filterImage('montana')}>Montana</Tab>
					<Tab tabFor="four">
						<NavBarLink className="text-dark" link="/projects">More</NavBarLink>
					</Tab>
				</TabList>
			</Tabs>
		);
	};

	useEffect(() => {
		filterImage('*')
	}, []);

	return (
		<div className="content page-section spad text-center App">
			{renderFilter()}
			<Gallery photos={imageArray} onClick={openLightbox} direction={"column"} lazyload={true} />
			<ModalGateway>
				{viewerIsOpen ? (
					<Modal onClose={closeLightbox}>
						<Carousel
							currentIndex={currentImage}
							views={imageArray.map(x => ({
								...x,
								srcset: x.srcSet,
								caption: x.title
							}))}
						/>
					</Modal>
				) : null}
			</ModalGateway>
		</div>
	);
};

ResponsiveGallery.propTypes = {
	imageArrayProp: PropTypes.array.isRequired,
	showFilter: PropTypes.bool
};

ResponsiveGallery.defaultProp = {
	imageArrayProp: [],
	showFilter: false
};

export default ResponsiveGallery;