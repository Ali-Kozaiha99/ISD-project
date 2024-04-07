const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ISD_project',
    /*waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0*/
}).promise()
module.exports = pool;
/*module.exports = pool.promise();


const db = require('./db'); // Assuming your db.js is in the same directory

// Create a table
async function createTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL
            )
        `;
        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
*/


/*pool.query("SELECT * FROM users")
    .then(result => {
        console.log(result); // Log the result
    })
    .catch(error => {
        console.error('Error executing query:', error.message);
    });*/

    /*
    const db = require('./db');
    async function getUser() {
        try {
const sql="INSERT INTO `users`(`id`, `username`, `email`) VALUES (3,'[value-2]','[value-3]')"  
await pool.query(sql);
console.log('Table add to successfully');         
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }
    
    getUser()
    */
   /*
    const db = require('./db');

    async function createTable() {
        try {
            const sql = `
                CREATE TABLE IF NOT EXISTS Doctors (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    birthDate DATE NOT NULL,
                    spaciality VARCHAR(255) NOT NULL,
                    phoneNumber VARCHAR(20) NOT NULL
                )
            `;
            await db.query(sql);
            console.log('Table created successfully');
        } catch (error) {
            console.error('Error creating table:', error);
        }
    }
    
    // Call the function to create table
    createTable();
    */
/*
    const db = require('./db');

    async function createTable() {
        try {
            const sql = `
                CREATE TABLE IF NOT EXISTS Doctors (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    birthDate DATE NOT NULL,
                    spaciality VARCHAR(255) NOT NULL,
                    phoneNumber VARCHAR(20) NOT NULL
                )
            `;
            await db.query(sql);
            console.log('Table created successfully');
        } catch (error) {
            console.error('Error creating table:', error);
        }
    }
    
    // Call the function to create table
    createTable();
    */

    /*async function createTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS Doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                staffSpaciality VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL
            ) AUTO_INCREMENT = 3001;`; // Start the auto-increment from 3001

        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
 */
/*

const db = require('./db');

async function createTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS nurses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                birthDate DATE NOT NULL,
                gender VARCHAR(10) NOT NULL,
                section VARCHAR(255) NOT NULL,
                rank VARCHAR(255) NOT NULL,
                phoneNumber VARCHAR(20) NOT NULL
            ) AUTO_INCREMENT = 200
        `;
        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
 */




/*

const db = require('./db');

async function createTable() {
    try {
        const sql = `
        CREATE TABLE Tasks (
            task_id INT PRIMARY KEY AUTO_INCREMENT,
            details TEXT,
            added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            doctor_id INT,
            nurse_id INT,
            patient_id INT,
            checked_by_nurse_date TIMESTAMP,
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (nurse_id) REFERENCES nurses(nurse_id),
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        )
        `;
        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
*/
/*

const db = require('./db');

async function createTable() {
    try {
        const sql = `
        CREATE TABLE Tasks (
            task_id INT PRIMARY KEY AUTO_INCREMENT,
            details TEXT,
            added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            doctor_id INT,
           
            file_id INT
        )
        `;
        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
*/




    










/*
    const db = require('./db');

async function createTable() {
    try {
        const sql = `
        SET FOREIGN_KEY_CHECKS = 0
        `;
        await db.query(sql);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

// Call the function to create table
createTable();
*/