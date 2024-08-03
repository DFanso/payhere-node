# PayHere-Node

This is a Node.js application that integrates with the PayHere payment gateway to initiate payments and handle notifications. The application is built using Express.js and demonstrates a simple payment form, initiation of payments, and processing payment notifications.

## Table of Contents
- [PayHere-Node](#payhere-node)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [POST /initiate-payment](#post-initiate-payment)
    - [POST /notify](#post-notify)
  - [Environment Variables](#environment-variables)
  - [Test Cards](#test-cards)
  - [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/DFanso/payhere-node.git
    ```

2. Navigate to the project directory:

    ```sh
    cd payhere-node
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

## Usage

1. Put the Domain as `localhost` in the PayHere Dashboard if you Using Ngrok put `ngrok-free.app`

2. Create a `.env` file in the root directory and add your environment variables:

    ```env
    PORT=3000
    MERCHANT_ID=your_merchant_id
    MERCHANT_SECRET=your_merchant_secret
    DOMAIN=http://localhost:3000
    ```

3. Start the server:

    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000/sdk.html` to see the payment form which uses the SDK version of the PayHere.

5. Open your browser and navigate to `http://localhost:3000/api.html` to see the payment form which uses the API version of the PayHere.

6. Fill in the form with your test card details and submit the form to initiate a payment.

## API Endpoints

### POST /initiate-payment

Initiates a payment with the provided user details.

**Request Body:**

```json
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "0771234567",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    "order_id": "12345",
    "items": "Test Item",
    "currency": "LKR",
    "amount": "1000.00"
}
```

**Response:**

```json
{
    "sandbox": true,
    "preapprove": true,
    "merchant_id": "your_merchant_id",
    "return_url": "http://localhost:3000/return",
    "cancel_url": "http://localhost:3000/cancel",
    "notify_url": "http://localhost:3000/notify",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "0771234567",
    "address": "123 Main Street",
    "city": "Colombo",
    "country": "Sri Lanka",
    "order_id": "12345",
    "items": "Test Item",
    "currency": "LKR",
    "amount": "1000.00",
    "hash": "calculated_hash"
}
```

### POST /notify

Handles payment notifications from PayHere.

**Request Body:**

```json
{
    "merchant_id": "your_merchant_id",
    "order_id": "12345",
    "payhere_amount": "1000.00",
    "payhere_currency": "LKR",
    "status_code": "2",
    "md5sig": "notification_hash"
}
```

**Response:**

- `200 OK` for successful processing.
- `500 Internal Server Error` for errors.

## Environment Variables

| Variable        | Description                      |
| --------------- | -------------------------------- |
| `PORT`          | The port the server runs on      |
| `MERCHANT_ID`   | Your PayHere merchant ID         |
| `MERCHANT_SECRET`| Your PayHere merchant secret     |
| `DOMAIN`        | Your application domain          |

## Test Cards

You can use the following test card numbers to simulate successful payments:

- **Visa**: 4916217501611292
- **MasterCard**: 5307732125531191
- **AMEX**: 346781005510225

For 'Name on Card', 'CVV', and 'Expiry date', you can enter any valid data. Any card except the above test cards will result in a failed payment.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.