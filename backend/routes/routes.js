import { createUser, login } from "../controller/user.controller.js";
import { addNewPlant, getAllPlants } from "../controller/plant.controller.js";
import { verifyToken } from "../middlewares/mid.verifyToken.js";


export function userRoutes(app){
    app.post("/register", createUser);
    app.post("/login", login);
}

export function plantRoutes(app){
    app.post("/createPlant", verifyToken, addNewPlant);
    app.get("/getAllPlants", verifyToken, getAllPlants);
}