const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const groupMember = sequelize.define('groupmember',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique:true
    },
    groupname: Sequelize.STRING,
    admin:Sequelize.INTEGER,
    // isAdmin: {
    //     type: Sequelize.BOOLEAN,
    //     allowNull:false
    // }
    //useId and groupId will be created through association automatically
});

module.exports = groupMember;