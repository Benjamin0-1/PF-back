const stripe = require('stripe')('sk_test_51P7RX608Xe3eKAmZLRdLEZqVedzK4Cv6EJks2vZg0qpjIxobSBvDXFJPUJE4wumqsOSuU1FMxzEyWEsXTZnIJEU000Spkdfy3x');

const express = require('express')
const app = express();

app.use(express.json()); // Middleware to parse JSON body
const Product = require('./models/Product');

app.post('/create-checkout-session', async (req, res) => {
    const products = req.body.products;

    try {
        const transaction = await sequelize.transaction(); // Start a transaction
        
        const items = [];
        const outOfStockProducts = [];

        for (const product of products) {
            const productFromDB = await Product.findByPk(product.id, { transaction });

            if (!productFromDB) {
                await transaction.rollback(); // Rollback the transaction if a product is not found
                return res.status(400).json({ error: `Product with ID ${product.id} not found.` });
            }

            if (product.quantity > productFromDB.stock) {
                await transaction.rollback(); // Rollback the transaction if a product is out of stock
                outOfStockProducts.push(productFromDB.name);
                return res.status(400).json({ error: `Product ${productFromDB.name} is out of stock.` });
            }

            // Update the stock quantity
            productFromDB.stock -= product.quantity;
            await productFromDB.save({ transaction });

            // Add the product to the checkout session items
            items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productFromDB.name,
                        images: [productFromDB.image]
                    }
                },
                quantity: product.quantity
            });
        }

        // Commit the transaction if all products are valid and stock is updated successfully
        await transaction.commit();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items,
            mode: 'payment',
            success_url: 'https://yourwebsite.com/success', // Replace with your actual success URL
            cancel_url: 'https://yourwebsite.com/cancel', // Replace with your actual cancel URL
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        await transaction.rollback(); // Rollback the transaction in case of an error
        res.status(500).json({ error: 'Internal server error' });
    }
});
