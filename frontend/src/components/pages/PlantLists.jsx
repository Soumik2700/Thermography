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
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [pages, setPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [lastId, setLastId] = useState(null);


    console.log(plants.length);

    const itemsPerPage = 10;

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

    const fetchPlants = async () => {
        try {
            setIsLoading(true);
            let url = `https://thermography.onrender.com/getAllPlants?limit=${itemsPerPage}`;
            if (lastId) url += `&lastId=${lastId}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { plants: fetchedPlants, hasMoreData } = response.data;

            // If first load, set directly, else append
            setPlants(prev => {
                const seenIds = new Set(prev.map(p => p._id));
                const filtered = fetchedPlants.filter(p => !seenIds.has(p._id));
                return [...prev, ...filtered];
            });


            // Update the lastId for next fetch
            if (fetchedPlants.length > 0) {
                const lastFetched = fetchedPlants[fetchedPlants.length - 1];
                if (lastFetched && lastFetched._id) {
                    setLastId(lastFetched._id);
                }
            }


            setHasMore(hasMoreData);


            console.log("Fetched:", fetchedPlants.length);
            console.log("Before Append:", plants.length);
            console.log("Last ID set to:", fetchedPlants.at(-1)?._id);
        } catch (error) {
            console.error("Error fetching plants:", error);
        } finally {
            setIsLoading(false);
        }
        
    };

    useEffect(() => {
        fetchPlants(pages);
        // eslint-disable-next-line
    }, [pages]);

    useEffect(() => {
        function handleScroll() {
            if (
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
                hasMore && !isLoading
            ) {
                setPages(prevPage => prevPage + 1);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, isLoading]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlant(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // console.log("plants", plants);
    const handleAddPlant = async () => {
        try {
            const lat = parseFloat(newPlant.latitude);
            const lng = parseFloat(newPlant.longitude);

            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid latitude or longitude");
                return;
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
                id: data._id || plants.length + 1,
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

    return (
        <div className="p-4" style={{ height: '90vh' }}>
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

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={5}
            >
                {plants.map((plant) => (
                    <Marker
                        key={`${plant._id}`}
                        position={{ lat: parseFloat(plant.latitude), lng: parseFloat(plant.longitude) }}
                    />
                ))}
            </GoogleMap>

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
                {isLoading && (
                    <div className='w-screen flex justify-center'>
                        <CircularProgressThickness />
                    </div>
                )}
            </div>

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
