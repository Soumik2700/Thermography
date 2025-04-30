import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function PlantMissions() {
    const { id } = useParams();
    const token = useSelector((state) => state.user.token);
    const [plant, setPlant] = useState({});

    useEffect(() => {
        async function getPlantDetails() {
            try {
                const response = await axios.get(`https://thermography.onrender.com/getPlantDetails?plantId=${id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });

                const data = response.data;
                // console.log(data);
                setPlant(data.plant);
            } catch (err) {
                console.err(err);
            }
        }

        getPlantDetails();
    }, [])

    console.log("use state plant", plant);

    return (
        <div className="p-6 space-y-6 overflow-x-hidden">
            <h1 className="text-2xl font-bold">Plant Missions</h1>

            {/* Plant Info Section */}
            <div className="grid grid-cols-3 gap-4 border p-4 rounded shadow">
                <div>
                    <p className="font-semibold">Name of plant:</p>
                    <p>{plant.name}</p>
                    <p className="text-sm text-gray-500">S3ID: (75257beb-98ae-4376-9ded-76e7e376d334)</p>
                </div>
                <div>
                    <p className="font-semibold">Total modules in Drone Data:</p>
                    <p>1000</p>
                </div>
                <div>
                    <p className="font-semibold">Total modules in Layout:</p>
                    <p>1000</p>
                </div>
                <div>
                    <p className="font-semibold">Geo location:</p>
                    <p>{plant.address} {`(${plant.latitude}, ${plant.longitude})`}</p>
                </div>

                {/* sizeOfSiteMWAC
                :
                50
                sizeOfSiteMWDC
                :
                50 */}
                <div>
                    <p className="font-semibold">Total capacity:</p>
                    <p>{`${plant.sizeOfSiteMWAC}MW AC, ${plant.sizeOfSiteMWDC}MW DC`}</p>
                </div>
                <div>
                    <p className="font-semibold">OrthoTIF:</p>
                    <Link to="#" className="text-blue-500 underline">Click here</Link>
                </div>
                <div>
                    <p className="font-semibold">DEM:</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">Upload</button>
                </div>
                <div>
                    <p className="font-semibold">Layout:</p>
                    <p className="text-green-600 font-semibold">✔ Processed</p>
                    <div className="flex space-x-2 mt-1">
                        <button className="px-2 py-1 bg-blue-500 text-white rounded">📄</button>
                        <button className="px-2 py-1 bg-blue-500 text-white rounded">⬇</button>
                    </div>
                </div>
                <div>
                    <p className="font-semibold">Irradiance File:</p>
                    <button className="flex items-center px-2 py-1 bg-blue-500 text-white rounded">Open File? ✎</button>
                </div>
                <div>
                    <p className="font-semibold">Visual images processing:</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">Start</button>
                    <p className="text-blue-500 text-sm underline cursor-pointer mt-1">Open dashboard</p>
                </div>
                <div>
                    <p className="font-semibold">Thermal OrthoTIF:</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">Upload</button>
                </div>
                <div>
                    <p className="font-semibold">Shadow Map:</p>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">Upload</button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">Create a new mission</button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded border">Refresh</button>
                </div>
                <input type="text" placeholder="Search.." className="border px-3 py-2 rounded w-1/3" />
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mt-4 border-b pb-2">
                <button className="text-blue-600 font-semibold">User Missions</button>
                <button className="text-gray-500">System Missions</button>
                <button className="text-gray-500">OrthoTIFs</button>
            </div>

            {/* Table */}
            <table className="w-full mt-4 border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2">S.No</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Created</th>
                        <th className="border px-4 py-2">Images</th>
                        <th className="border px-4 py-2">S3Id</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        {
                            name: "Block - 1",
                            created: "Last month",
                            images: 4003,
                            s3id: "181032a0-eb46-46a0-b129-df523fe56cc1",
                            buttons: ["✔", "🖼️", "✎", "🗑️"]
                        },
                        {
                            name: "Block - 2",
                            created: "2 weeks ago",
                            images: 0,
                            s3id: "1b0de5fd-c96c-400f-a60c-870ab6aec8ba",
                            buttons: ["✎", "🗑️"]
                        },
                        {
                            name: "block 3",
                            created: "Last week",
                            images: 0,
                            s3id: "ba871228-4cdc-4f6e-9773-1dd66cdc8101",
                            buttons: ["✎", "🗑️"]
                        }
                    ].map((mission, i) => (
                        <tr key={i}>
                            <td className="border px-4 py-2">{i + 1}</td>
                            <td className="border px-4 py-2 text-blue-500 underline cursor-pointer">{mission.name}</td>
                            <td className="border px-4 py-2">{mission.created}</td>
                            <td className="border px-4 py-2">{mission.images}</td>
                            <td className="border px-4 py-2">{mission.s3id}</td>
                            <td className="border px-4 py-2">
                                <div className="flex space-x-2">
                                    {mission.buttons.map((btn, j) => (
                                        <button key={j} className="px-2 py-1 bg-blue-600 text-white rounded">
                                            {btn}
                                        </button>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PlantMissions;
