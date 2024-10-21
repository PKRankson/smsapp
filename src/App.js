import React, { useState } from 'react';
import { Alert, AlertTitle, Button, Collapse, IconButton, TextField,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './App.css';

function App() {
  // State variables for phone number, message, alert, and alert type
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); 
  const [open, setOpen] = React.useState(false);
  const authKey = process.env.REACT_APP_AUTH_KEY; // Add your auth key here

  // Handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Prepare the request body
    const data = {
      "key": authKey,
      "msisdn": phoneNumber,
      "message": message,
      "sender_id": "Test",
      "callback_url": "https://f369-154-160-0-198.ngrok-free.app"
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
    
    <div className="split-background">
      <div className="container">
        <div className="text">Welcome To My SMS App</div>

        <form onSubmit={handleSubmit} className="sms-form">
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            border
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Collapse in ={open}>
            <Alert severity={alertType} style={{ marginTop: '10px', marginBottom: '15px' }} action={
              <IconButton aria-label="close" color="inherit" size="small"
                onClick={() => {
                  setOpen(false);
                }}>
                  <CloseIcon fontsize="inherit"/>
              </IconButton>}>
              <AlertTitle>{alertTitle}</AlertTitle>
              {alertMessage}
            </Alert>
          </Collapse>

          <Button type="submit" variant="outlined">
            Send Message
          </Button>
        </form>
      </div>
      <div className="right-side"></div>
      <div className="background"></div>
    </div>
  );


}

export default App;
