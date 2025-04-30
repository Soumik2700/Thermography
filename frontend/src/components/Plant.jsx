import { Link } from "react-router-dom";

function Plant({plant, index}){
    const plantId = plant?._id;
    return(
        <>
            <td className="border px-4 py-2">{index + 1}</td>
            
            <td className="border px-4 py-2">
                <Link to={`/plants/${plantId}/plantMissions`} className="text-blue-500 underline">
                    {plant.name}
                </Link>
            </td>
            <td className="border px-4 py-2">
                <a href="#" className="text-blue-500 underline">Open Portal ({plant.name})</a>
            </td>
            <td className="border px-4 py-2">{plant.projectCode}</td>
            <td className="border px-4 py-2">{plant.client}</td>
            <td className="border px-4 py-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2">
                    Link Client Plant
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                    Edit
                </button>
            </td>
        </>
    );
}

export default Plant;