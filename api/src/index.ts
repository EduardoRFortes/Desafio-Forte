

import express from "express"
import cors from "cors"

import clientRoutes from "./routes/clientRoutes"; 
import './database/db'; 
import loanRoutes from "./routes/loanRoutes";
import bookRoutes from './routes/bookRoutes'; 

const API_PORT = 8080

const api = express()

api.use(cors({
    origin: "*",
}))

api.use(express.json()); 


api.get("/", (request, response) => {
    response.send("API is up!")
})





api.use("/api/clients", clientRoutes); 


api.use("/api/loans", loanRoutes); 


api.use("/api/books", bookRoutes); 

api.listen(API_PORT, "0.0.0.0", () => {
    console.log(`API running on port ${API_PORT}`)
})