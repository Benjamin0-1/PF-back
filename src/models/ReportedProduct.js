const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');
const User = require('./User');
const Review = require('./Review');
const Favorite = require('./Favorite');

// Import nodemailer and other necessary modules
const nodemailer = require('nodemailer');

// Initialize nodemailer transporter
const nodemailerOptions = {
    service: 'gmail',
    auth: {
        user: 'oliver125125@gmail.com',
        pass: 'aiyp fvhl djxd rjny',
    }
};

async function initializeTransporter() {
    const transporter = nodemailer.createTransport(nodemailerOptions);
    return transporter;
}

async function sendMail(transporter, to, subject, message) {
    try {
        const info = await transporter.sendMail({
            from: nodemailerOptions.auth.user,
            to: to,
            subject: subject,
            text: message,
            html: `<p>${message}</p>`
        });
        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
        console.error(`Error sending email to ${to}: ${error}`);
        throw error;
    }
}

// Define ReportedProduct model
const ReportedProduct = sequelize.define('ReportedProduct', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products', 
            key: 'id',       
            onDelete: 'CASCADE', // This will automatically delete reported products when the referenced product is deleted
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    } // agreagr : reason
});

// BUGS: <-- EL COUNT NO SE ACTUALIZA.
async function checkReportCounts() {
    try {
        console.log('Checking report counts...');
        const products = await ReportedProduct.findAll({
            attributes: ['productId', [Sequelize.fn('COUNT', Sequelize.col('productId')), 'reportCount']],
            group: ['productId']
        });
        
        if (products.length === 0) {
            console.log('No reported products found.');
            return; // Exit early if there are no reported products
        }

        console.log('Found products:', products);

        for (const product of products) {
            console.log('Checking product:', product.productId);
            if (product.reportCount > 1) {
                console.log('Product report count exceeds threshold:', product.productId);

                const productId = product.productId;

                // Delete the product and its related data in a transaction
                await sequelize.transaction(async (transaction) => {
                    console.log('Starting transaction for product deletion:', productId);
                    await Product.destroy({ where: { id: productId }, transaction });
                    await Review.destroy({ where: { productId }, transaction });
                    await Favorite.destroy({ where: { productId }, transaction });
                    console.log('Product and related data deleted:', productId);
                });

                // Send email notification to users
                const users = await Favorite.findAll({
                    where: { productId },
                    include: [{ model: User, attributes: ['email'] }]
                });

                console.log('Sending emails to users:', users);
                
                const transporter = await initializeTransporter();
                for (const user of users) {
                    console.log('Sending email to:', user.email);
                    await sendMail(transporter, user.email, 'Producto Eliminado', `El producto con ID ${productId} ha sido eliminado debido a informes de usuarios.`);
                    console.log('Email sent to:', user.email);
                }

                console.log(`Product with ID ${productId} deleted due to reports.`);
            } else {
                console.log('Product report count does NOT exceed threshold:', product.productId);
            }
        }
    } catch (error) {
        console.error('Error checking report counts:', error);
    }
}


// Set interval to check report counts every 24 hours
setInterval(checkReportCounts, 24 * 60000);

ReportedProduct.beforeDestroy(async (instance, options) => {
    try {
        // Delete all reported products related to the product being deleted
        await ReportedProduct.destroy({ where: { productId: instance.productId }});
    } catch (error) {
        console.error(`Error deleting related reported products for product: ${error}`);
    }
});




module.exports = ReportedProduct;
