const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const group = sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    groupname: Sequelize.STRING,
    admin:Sequelize.INTEGER // admin who created the group
});

module.exports=group;
