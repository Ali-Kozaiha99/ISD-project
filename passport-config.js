const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db');

async function getUserById(id) {
  const [rows] = await pool.query(`
      SELECT * FROM (
          SELECT id, email, password FROM nurses
          UNION ALL
          SELECT id, email, password FROM doctors
          UNION ALL
          SELECT id, email, password FROM staff
          UNION ALL
          SELECT id, email, password FROM admition
      ) AS all_users
      WHERE id = ?
  `, [id]);
  return rows[0]; // Assuming you expect only one user per ID
}

async function getUserByEmail(email) {
    const [nurseRows] = await pool.query(`
        SELECT id, email, password FROM nurses WHERE email = ?
    `, [email]);
  
    if (nurseRows.length > 0) {
      return nurseRows[0];
    }
  
    const [doctorRows] = await pool.query(`
        SELECT id, email, password FROM doctors WHERE email = ?
    `, [email]);
  
    if (doctorRows.length > 0) {
      return doctorRows[0];
    }
  
    const [staffRows] = await pool.query(`
        SELECT id, email, password FROM staff WHERE email = ?
    `, [email]);
  
    if (staffRows.length > 0) {
      return staffRows[0];
    }
  
    const [admissionRows] = await pool.query(`
        SELECT id, email, password FROM admition WHERE email = ?
    `, [email]);
  
    if (admissionRows.length > 0) {
      return admissionRows[0];
    }
  
    return null;
  }
  

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => { 
        done(null, user.id); 
    });

    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);
    });
}

module.exports = {
  initialize,
  getUserByEmail,
  getUserById
};
