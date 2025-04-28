import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    organization: {
        type: String,
        trim: true,
    },
    sizeOfSiteMWAC: {
        type: Number,
    },
    sizeOfSiteMWDC: {
        type: Number,
    },
    projectCode: {
        type: String,
        unique: true,
        trim: true,
    }
}, {
    timestamps: true
});

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
