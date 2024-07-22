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


//postgresql://user:tzaxNExrjEP1cx1UhHviabuBXGhPpbHG@dpg-cqf0sqhu0jms739ler4g-a.oregon-postgres.render.com/store_1p6o

const sequelize = new Sequelize({
  database: 'store_1p6o',
  username: 'user',
  password: 'tzaxNExrjEP1cx1UhHviabuBXGhPpbHG',
  host: 'dpg-cqf0sqhu0jms739ler4g-a.oregon-postgres.render.com',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});


module.exports = sequelize;  
