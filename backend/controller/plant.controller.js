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

export async function getAllPlants(req, res){
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const plants = await Plant.find()
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(plants);
    } catch (error) {
        console.error('Error fetching plants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}