require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DATABASE_URL
} = process.env;

// const sequelize = new Sequelize(DATABASE_URL, {
//   dialect: 'postgres',
//   ssl: {
//     require: true,
//     // rejectUnauthorized: false // You may need to set this to true in production
//   },
//   logging: false,
//   native: false
// });

const sequelize = new Sequelize(DATABASE_URL, {
  logging: false,
  native: false,
});

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
//   logging: false,
//   native: false,
// });

const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) =>
  {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

modelDefiners.forEach(model => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const { User, Advert } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
User.hasMany(Advert);
Advert.belongsTo(User);

// User.hasMany(Advert, {
//   foreignKey: 'clubId'
// });
// Advert.belongsTo(User);

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
