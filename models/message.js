const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const groupmessage = sequelize.define('groupmessage',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    message:Sequelize.STRING,
    name:Sequelize.STRING,
    type:Sequelize.STRING
});

module.exports=groupmessage;