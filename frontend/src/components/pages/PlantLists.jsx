import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import AddPlant from '../AddPlant';
import Plant from '../Plant';
import { useSelector } from "react-redux";
import axios from "axios";
import CircularProgressThickness from '../CircularProgressThickness';


const PlantLists = () => {
    const apikey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const token = useSelector((state) => state.user.token);

    const [plants, setPlants] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const itemsPerPage = 5;

    const [mapCenter, setMapCenter] = useState({ lat: 23.2599, lng: 77.4126 });
    const [searchLat, setSearchLat] = useState('');
    const [searchLng, setSearchLng] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newPlant, setNewPlant] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        organization: '',
        sizeOfSiteMWAC: '',
        sizeOfSiteMWDC: '',
        projectCode: '',
    });

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    useEffect(() => {
        fetchPlants(page);
        // eslint-disable-next-line
    }, [page]);

    const fetchPlants = async (currentPage) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://thermography.onrender.com/getAllPlants?page=${currentPage}&limit=${itemsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const fetchedPlants = response.data;

            if (fetchedPlants.length < itemsPerPage) {
                setHasMore(false);
            }

            setPlants(prev => {
                const existingIds = new Set(prev.map(plant => plant._id));
                const newPlants = fetchedPlants.filter(plant => !existingIds.has(plant._id));
                return [...prev, ...newPlants];
            });

            // setPlants(prev => [...prev, ...fetchedPlants]);

            setLoading(false);

        } catch (error) {
            console.error("Error fetching plants:", error);
            setLoading(false);
        }
    };


    console.log("Plants", plants);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlant(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddPlant = async () => {
        try {
            const lat = parseFloat(newPlant.latitude);
            const lng = parseFloat(newPlant.longitude);

            // Validate latitude and longitude
            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid latitude or longitude");
                return; // Exit the function if values are invalid
            }

            const response = await axios.post("https://thermography.onrender.com/createPlant",
                newPlant,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = response.data;
            const plantToAdd = {
                id: data.id || plants.length + 1,
                name: newPlant.name,
                lat: lat,
                lng: lng,
                client: newPlant.organization,
                projectCode: newPlant.projectCode,
            };
            setPlants(prev => [plantToAdd, ...prev]);
            setShowModal(false);
            setNewPlant({
                name: '',
                address: '',
                latitude: '',
                longitude: '',
                organization: '',
                sizeOfSiteMWAC: '',
                sizeOfSiteMWDC: '',
                projectCode: '',
            });
        } catch (error) {
            console.error("Error adding plant:", error);
        }
    };


    const handleLatLngSearch = () => {
        if (searchLat && searchLng) {
            setMapCenter({
                lat: parseFloat(searchLat),
                lng: parseFloat(searchLng)
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 && !loading && hasMore) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="p-4" style={{ height: '100vh'}}>
            {/* Latitude Longitude Search */}
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="text"
                    value={searchLat}
                    onChange={(e) => setSearchLat(e.target.value)}
                    placeholder="Latitude"
                    className="border border-gray-300 p-2 rounded w-1/4"
                />
                <input
                    type="number"
                    value={searchLng}
                    onChange={(e) => setSearchLng(e.target.value)}
                    placeholder="Longitude"
                    className="border border-gray-300 p-2 rounded w-1/4"
                />
                <button
                    onClick={handleLatLngSearch}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Go
                </button>
            </div>

            {/* Google Map */}
            <LoadScript googleMapsApiKey={apikey}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={5}
                >
                    {plants.map((plant) => (
                        <Marker key={`${plant._id}-${plant.name}`} position={{ lat: parseFloat(plant.latitude), lng: parseFloat(plant.longitude) }} />
                    ))}

                </GoogleMap>
            </LoadScript>

            {/* Search and Add Button */}
            <div className="flex justify-between items-center my-4">
                <input
                    type="text"
                    placeholder="Search by name or project code..."
                    className="border border-gray-300 p-2 rounded w-1/2"
                />
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
                >
                    Add a new plant
                </button>
            </div>

            {/* Plant Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">S.No</th>
                            <th className="border px-4 py-2">Name of Plant</th>
                            <th className="border px-4 py-2">Client Portal</th>
                            <th className="border px-4 py-2">Project Code</th>
                            <th className="border px-4 py-2">Client</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plants.map((plant, index) => (
                            <tr key={`${plant.id}-${index}`}>
                                <Plant plant={plant} index={index} />
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <>
                    <div className='w-screen flex justify-center'>
                        <CircularProgressThickness />
                    </div>
                </>}
                {!hasMore && <div className="text-center py-2 text-gray-500">No more plants to load.</div>}
            </div>

            {/* Modal Popup */}
            {showModal && (
                <AddPlant
                    newPlant={newPlant}
                    handleInputChange={handleInputChange}
                    setShowModal={setShowModal}
                    handleAddPlant={handleAddPlant}
                />
            )}
        </div>
    );
};

export default PlantLists;
