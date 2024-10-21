const express = require('express')
const app = express();

app.use(express.json());
app.post('/', (req,res) => {
    const deliveryStatus = req.body;
    console.log('Delivery status received:', deliveryStatus);
    res.status(200).send('Callback received');
});

app.listen(8000, () => { 
    console.log('Backend server listening on port 3000');
});  