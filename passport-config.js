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
      ) AS all_users
      WHERE id = ?
  `, [id]);
  return rows[0]; // Assuming you expect only one user per ID
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(`
      SELECT * FROM (
          SELECT id, email, password FROM nurses
          UNION ALL
          SELECT id, email, password FROM doctors
          UNION ALL
          SELECT id, email, password FROM staff
      ) AS all_users
      WHERE email = ?
  `, [email]);
  return rows[0]; // Assuming you expect only one user per email
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

