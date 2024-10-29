import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Button, Collapse, IconButton, TextField,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import './App.css';

function App() {
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [open, setOpen] = React.useState(false);
  const authKey = process.env.REACT_APP_AUTH_KEY; // Auth key

  const [deliveryStatus, setDeliveryStatus] = useState('')


  useEffect(() => {
    // Connect to the WebSocket server (Backend running on localhost:8000)
    const ws = new WebSocket('wss://smsapp-3enu.onrender.com/');

    // Listen for WebSocket messages from the backend
    ws.onmessage = (event) => {
      const status = JSON.parse(event.data);  // Parse the incoming status message
      console.log('Delivery status received from backend:', status);
      setDeliveryStatus(JSON.stringify(status)); // Update delivery status in state
      setAlertTitle('Delivery Status');
      setAlertMessage('Delivery Status Received!');
      setAlertType('success');
    };

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Clean up WebSocket connection when component unmounts
    };
  }, []);


  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    

    // Prepare the request body
    const data = {
      "key": authKey,
      "msisdn": phoneNumber,
      "message": message,
      "sender_id": "Test",
      "callback_url": "https://smsapp-3enu.onrender.com"
    };

    try {
      const response = await fetch('https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(data),
      });

      // Check if the response is successful
      if (response.ok) {
        const result = await response.json();
        setAlertTitle('Delivered');
        setAlertMessage(`SMS sent successfully! ${result.job_id} ${result.msisdn} ${result.status} ` ); // Set success message
        setAlertType('success'); // Set alert type to success
        setOpen(true);
        console.log(result.job_id); // Log the response from the server
      } else {
        setAlertTitle('Failed');
        setAlertMessage('Failed to send SMS. Please try again!');
        setAlertType('error'); // Set alert type to error
        setOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertTitle('Error');
      setAlertMessage('An error occurred. Please try again.');
      setAlertType('error'); // Set alert type to error
      setOpen(true);
    }

    // Clear input fields
    setPhoneNumber('');
    setMessage('');
  };
  

  return (
    <div>
        <div className="split-background">
          <div className="text">Start Messaging</div>
          <form onSubmit={handleSubmit} className="sms-form">
            <TextField
              label="Contact Number"
              placeholder="Recipient's Contact"
              variant="standard"
              fullWidth
              border
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <TextField
              label="Message"
              placeholder='Your message here'
              variant="standard"
              fullWidth
              margin="normal"
              style={{ marginTop: '40px'}}
              multiline
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Collapse in ={open}>
              <Alert severity={alertType} style={{ marginTop: '50px', marginBottom: '20px', minHeight: '150px' }} action={
                <IconButton aria-label="close" color="inherit" size="small"
                  onClick={() => {
                    setOpen(false);
                  }}>
                    <CloseIcon fontsize="inherit"/>
                </IconButton>}>
                <AlertTitle>{alertTitle}</AlertTitle>
                {alertMessage}
                {deliveryStatus}
              </Alert>
            </Collapse>

            <Button type="submit" variant="contained" endIcon={<SendIcon/>} sx={{ marginTop: '40px', height: '55px', borderRadius:'40px', backgroundColor: '#2a98ec', '&:hover': {backgroundColor: '#176aa8'},}}>
              Send Message
            </Button>
          </form>
        </div>
      
      <div className="welcome">CONNECT</div>
      <div className="right-content">
        
      </div>
    </div>
   
  );

}

export default App;
