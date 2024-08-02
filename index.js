const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const cors = require('cors');  // Import the cors package
const app = express();

const PORT = 3000;
const MERCHANT_ID = '1227834';  // Replace with your actual sandbox Merchant ID
const MERCHANT_SECRET = 'MTU3MjExNDk4ODIwNjAwMTYxNzAxMTgzMDk4MjM2NTc5MDk0MDUx';  // Replace with your actual sandbox Merchant Secret

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/initiate-payment', (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        country,
        order_id,
        items,
        currency,
        amount
    } = req.body;

    const amountFormatted = parseFloat(amount).toFixed(2);
    const hashedSecret = crypto.MD5(MERCHANT_SECRET).toString().toUpperCase();
    const hash = crypto.MD5(MERCHANT_ID + order_id + amountFormatted + currency + hashedSecret).toString().toUpperCase();

    const formData = {
        merchant_id: MERCHANT_ID,
        return_url: "https://4ec7-112-134-198-64.ngrok-free.app/return",
        cancel_url: "https://4ec7-112-134-198-64.ngrok-free.app/cancel",
        notify_url: "https://4ec7-112-134-198-64.ngrok-free.app/notify",
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        country: country,
        order_id: order_id,
        items: items,
        currency: currency,
        amount: amountFormatted,
        hash: hash
    };

    res.json(formData);
});

app.post('/notify', (req, res) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

    const local_md5sig = crypto.MD5(
        `${MERCHANT_ID}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto.MD5(MERCHANT_SECRET).toString().toUpperCase()}`
    ).toString().toUpperCase();

    if (local_md5sig === md5sig && status_code == '2') {
        // Payment is successful, update your database
        console.log('Payment successful');
        // TODO: Update your database as payment success
    } else {
        // Payment verification failed
        console.log('Payment verification failed');
    }
    console.log(status_code)

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
