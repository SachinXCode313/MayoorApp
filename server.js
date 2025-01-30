// server.js
import express from 'express'; 
import cors from 'cors'; 
import routers from './src/routes/routes.js';

const app = express();
const PORT = process.env.PORT || 8000; 

app.use(express.json()); 
app.use(cors()); 

app.use('/api',routers)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});