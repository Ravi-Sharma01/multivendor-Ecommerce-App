require('dotenv').config();

const mongoose = require('mongoose');
const connectDb = require('../../config/db.config');
const Permission = require('../../modules/auth/models/permission.model');
const Role = require('../../modules/auth/models/role.model');

const permissionNames = [
    // Customer
    'view_products',
    'create_order',
    'view_own_orders',
    'cancel_own_order',
    'manage_own_profile',

    // Vendor
    'create_product',
    'update_own_product',
    'delete_own_product',
    'view_own_orders',
    'update_order_status',
    'view_own_sales',

    // Admin
    'manage_users',
    'manage_roles',
    'manage_permissions',
    'manage_products',
    'manage_orders',
    'manage_categories',
    'view_reports',
];

const rolePermissions = {
    customer: [
        'view_products',
        'create_order',
        'view_own_orders',
        'cancel_own_order',
        'manage_own_profile',
    ],
    vendor: [
        'view_products',
        'create_product',
        'update_own_product',
        'delete_own_product',
        'view_own_orders',
        'update_order_status',
        'view_own_sales',
    ],
    admin: permissionNames,
};

const seedDatabase = async () => {
    try {
        await connectDb();

        const permissionMap = {};

        // Missing permissions insert hongi aur existing permissions reuse hongi
        for (const name of permissionNames) {
            const permission = await Permission.findOneAndUpdate(
                { name },
                { $setOnInsert: { name } },
                {
                    upsert: true,
                    new: true,
                }
            );

            permissionMap[name] = permission._id;
        }

        // Missing roles insert honge aur existing roles update honge
        for (const [roleName, permissionNamesForRole] of Object.entries(rolePermissions)) {
            const permissionIds = permissionNamesForRole.map(
                permissionName => permissionMap[permissionName]
            );

            await Role.findOneAndUpdate(
                { name: roleName },
                {
                    $set: {
                        permissions: permissionIds,
                    },
                },
                {
                    upsert: true,
                    new: true,
                }
            );
        }

        console.log('Permissions and roles seeded successfully');
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

if (require.main === module) {
    seedDatabase()
        .then(async () => {
            await mongoose.connection.close();
        })
        .catch(async error => {
            console.error('Seeding failed:', error.message);
            await mongoose.connection.close();
            process.exit(1);
        });
}

module.exports = seedDatabase;
