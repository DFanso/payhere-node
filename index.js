const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto-js');
const cors = require('cors');
const app = express();
require('dotenv').config();
const md5 = require('crypto-js/md5');

const PORT = process.env.PORT || 3000;
const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_SECRET = process.env.MERCHANT_SECRET;
const DOMAIN = process.env.DOMAIN;

console.log(MERCHANT_ID, MERCHANT_SECRET);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/initiate-payment', (req, res) => {
    try {
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

        // Validate required fields
        const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country', 'order_id', 'items', 'currency', 'amount'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        console.log(req.body);
        // Format the amount
        const amountFormatted = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
        const hashedSecret = md5(MERCHANT_SECRET).toString().toUpperCase();
        const hash = md5(MERCHANT_ID + order_id + amountFormatted + currency + hashedSecret).toString().toUpperCase();

        const formData = {
            sandbox: true,
            preapprove: true,
            merchant_id: MERCHANT_ID,
            return_url: `${DOMAIN}/return`,
            cancel_url: `${DOMAIN}/cancel`,
            notify_url: `${DOMAIN}/notify`,
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
            amount: amountFormatted,
            hash
        };
        console.log(formData);
        res.json(formData);
    } catch (error) {
        console.error('Error in initiate-payment:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/notify', (req, res) => {
    try {
        const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

        const local_md5sig = md5(
            `${MERCHANT_ID}${order_id}${payhere_amount}${payhere_currency}${status_code}${md5(MERCHANT_SECRET).toString().toUpperCase()}`
        ).toString().toUpperCase();

        if (local_md5sig === md5sig && status_code == '2') {
            // Payment is successful, update your database
            console.log('Payment successful for order:', order_id);
            console.log('Badu wada!')
        } else {
            // Payment verification failed
            console.log('Payment verification failed for order:', order_id);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error in notify endpoint:', error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
