const { Sequelize } = require('sequelize');
/*
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'Store',
    logging: false
});

module.exports = sequelize;
*/

const sequelize = new Sequelize({
  database: 'jwdy1f77ygcuoc3e',
  username: 'k2m6tdfsi3wsepaa',
  password: 'yo5mq7aib7mi9mas',
  host: 'tk3mehkfmmrhjg0b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true, // This will enforce SSL
      rejectUnauthorized: false // This option bypasses the verification of the certificate
    }
  },
  logging: false
});

module.exports = sequelize;
