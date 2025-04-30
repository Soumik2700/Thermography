import Plant from "../model/plant.model.js";


export async function addNewPlant(req, res){
    const { name, address, latitude, longitude, organization, sizeOfSiteMWAC, sizeOfSiteMWDC, projectCode } = req.body;

    if(!name || !address || !latitude || !longitude || !organization || !sizeOfSiteMWAC || !sizeOfSiteMWDC || !projectCode){
        return res.status(400).json({message: "All fields are required!"});
    }

    try{
        const newPlant = new Plant({
            name, address, latitude, longitude, organization, sizeOfSiteMWAC, sizeOfSiteMWDC, projectCode
        })

        const savedPlant = await newPlant.save();
        if(!savedPlant){
            return res.status(400).json({message: "Error creating new plant!"});
        }

        res.status(201).json({savedPlant});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export async function getAllPlants(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lastId = req.query.lastId;

        const query = lastId ? { _id: { $lt: lastId } } : {};

        const plants = await Plant.find(query)
            .sort({ _id: -1 })
            .limit(limit);

        const totalCount = await Plant.countDocuments();
        const hasMoreData = plants.length === limit;

        res.status(200).json({ plants, totalCount, hasMoreData });
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function editPlant(req, res) {
    const { name, address, latitude, longitude, organization, sizeOfSiteMWAC, sizeOfSiteMWDC, projectCode } = req.body;

    if (!name || !address || !latitude || !longitude || !organization || !sizeOfSiteMWAC || !sizeOfSiteMWDC || !projectCode) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const plant = await Plant.findOne({ projectCode }); // Added 'await'

        if (!plant) {
            return res.status(404).json({ message: "Cannot find any plant!" });
        }

        // Update plant fields
        plant.name = name;
        plant.address = address;
        plant.latitude = latitude;
        plant.longitude = longitude;
        plant.organization = organization;
        plant.sizeOfSiteMWAC = sizeOfSiteMWAC;
        plant.sizeOfSiteMWDC = sizeOfSiteMWDC;

        // Save the updated plant
        const updatedPlant = await plant.save();

        res.status(200).json(updatedPlant);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getPlantDetails(req, res){
    const {plantId} = req.query;

    if(!plantId){
        return res.status(400).json({message: "Plant id is required!"});
    }

    try{
        const plant = await Plant.findOne({_id:plantId});
        if(!plant){
            return res.status(404).json({message: "No plant found!"});
        }

        res.status(200).json({plant});
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
