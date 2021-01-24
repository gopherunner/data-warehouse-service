const User = require('../models/users');
const bcrypt = require('bcrypt');

async function bulkInitData() {

    let existsAdminUser = await User.find({
        email: 'admin@datawarehouse.com'
    });
    // console.log("[DEBUG] => Data: " + existsAdminUser);

    if (existsAdminUser == '') {
        console.log("[INFO] Creating the Admin user...");
        // Lets create the a newly admin user
        adminPassword = process.env.ADMIN_PASS
        if (adminPassword) {
            const salt = await bcrypt.genSalt(10);
            adminPassword = await bcrypt.hash(adminPassword, salt);
        }

        const newAdminUser = new User({
            firstname: "Acamica",
            lastname: "Admin",
            email: "admin@datawarehouse.com",
            profile: "admin",
            password: adminPassword 
        });

        try {
            const adminUserSaved = await newAdminUser.save();
            console.log("[INFO] Admin User created successfully!: " + adminUserSaved);
        } catch(error) {
            console.log("[ERROR] While trying to create the Admin User, error msg: " + error);
        }
    } else {
        console.log("[INFO] Bypassing Admin user creation since an Admin already exists!");
    }
}

module.exports = bulkInitData;
