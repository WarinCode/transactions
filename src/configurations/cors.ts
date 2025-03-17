const corsConfig = { 
    origin: "*", 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
    preflight: false
}

export default corsConfig;