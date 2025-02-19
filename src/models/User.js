const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('user', 'superuser'),
                defaultValue: 'user'
            }
        },
        {
            timestamps: true,
            tableName: 'users',
        }
    );

    // Hash password before saving to the database
    User.beforeCreate(async (user) => {
        const salt = await bcrypt.genSalt(10); // Generate salt
        user.password = await bcrypt.hash(user.password, salt); // Hash password
    });

    return User;
};
