function AddPlant({ newPlant, handleInputChange, setShowModal, handleAddPlant }){
    return(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <h2 className="text-xl font-bold mb-4 text-center">Add New Plant</h2>
                <div className="flex flex-col gap-2">
                    {Object.keys(newPlant).map((field) => (
                        <input
                            key={field}
                            type="text"
                            name={field}
                            value={newPlant[field]}
                            onChange={handleInputChange}
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            className="border border-gray-300 p-2 rounded"
                        />
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddPlant}
                        className="bg-blue-700 hover:bg-blue-800 text-white py-1 px-4 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddPlant;