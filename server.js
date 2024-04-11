if(process.env.NODDE_ENV !== "production"){
    require('dotenv').config()
}
//const configurePassport = require('./configurePassport');
const pool = require('./db');
const path = require('path');
const express=require('express')
const app=express()
const bcrypt=require('bcrypt')
//const initializePassport=require('./passport-config')
const passport = require('passport')
const flash=require('express-flash')
const session = require('express-session')
const methodOverride=require('method-override')

 

const { initialize, getUserByEmail, getUserById } = require('./passport-config');


// Call initialize function passing your Passport instance and user functions
initialize(passport, getUserByEmail, getUserById);




/*
initializePassport(passport, 
    email=>users.find(user=> user.email=== email),
    id=>users.find(user=> user.id=== id))
*/
    /*Certainly! The line you provided is calling the initializePassport function with two arguments:

passport: This is an instance of Passport.js, a popular authentication middleware for Node.js applications. Passport.js provides a comprehensive set of strategies for authenticating users via various methods such as username and password, OAuth, and more.

email => users.find(user => user.email === email): This is an arrow function that serves as a callback to retrieve a user object based on their email address. Let's break it down:

email => ...: This part declares an arrow function with one parameter, email. This function will be called with an email address as an argument.

users.find(...): This part is a method call on an array named users. The find method is used to search through the users array and find the first element that satisfies a provided condition.

user => user.email === email: This is an arrow function used as the condition for the find method. It takes a user object as a parameter and checks if the email property of the user object is equal to the email address passed as an argument to the outer arrow function.

So, overall, this line is configuring Passport.js to use a function that searches for a user in an array (users) based on their email address when attempting to authenticate a user. This is typically used with a local authentication strategy where user data is stored locally (for example, in a database) rather than relying on external authentication providers like OAuth.




 */
const users=[]
app.set('view-engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      console.log(method,req.body._method)
      delete req.body._method
      return method
    }
  }))
app.use(express.static('public'));

app.get('/',checkAuthenticated,(req,res)=>{
    res.render('index.ejs',{name:req.user.email})
})
app.get('/a',(req,res)=>{
    res.render('index.ejs',{name:'ali'})
})

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
})
app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    const userEmail = req.user.email;

    // Add your conditional logic here to render different pages based on the user's email
    if (userEmail === '32130341@students.liu.edu.lb') {
        // Render a specific page for example1@example.com
        res.redirect('/a');
    }  else {
        // Default redirect to the homepage '/'
        res.redirect('/');
    }
});
 


app.get('/register',  async (req, res) => {
    try {
        const [doctorRows, doctorFields] = await pool.query('SELECT * FROM Doctors');
        const [nurseRows, nurseFields] = await pool.query('SELECT * FROM nurses');
        const [staffRows, staffFields] = await pool.query('SELECT * FROM staff');
        const [admitionRows, admitionFields] = await pool.query('SELECT * FROM admition');

        
        res.render('register.ejs', { doctors: doctorRows, nurses: nurseRows, staff: staffRows,admitions:admitionRows });

    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
    }
}); 

 

/*app.post('/user',async (req,res)=>{
const u=users.find(u=> u.name=req.body.name)
if(user==null){
    return res.status(400).send('connect find user')}
    try{
if(  await bcrypt.compare(req.body.password,u.password)){
    res.send('yaay')
}
else{
    res.send('not allowed')
}
    }catch{
        res.status(500).send()

    }

})
*/

/*app.get('/user',(req,res)=>{
    res.json(users)
})
app.post('/user',async (req,res)=>{
try{
    const hashedPasswordd=await bcrypt.hash(req.body.password,10)
console.log(hashedPasswordd)
const u={name: req.body.name, password:hashedPasswordd}
users.push(u)
res.status(201).send()

}
catch(e){
res.status(500).send()
}

})*/

app.post('/register',async(req,res)=>{
    try{
    const hashedPassword=await bcrypt.hash(req.body.password,10)
    if(req.body.role==="a"){
    await pool.query("INSERT INTO nurses (id, name, email, password, birthDate,gender, section, rank, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)", [
        req.body.id,
        req.body.name,
        req.body.email,
        hashedPassword,
        req.body.birthDate, 
        req.body.gender , 
        req.body.section,
        req.body.rank,
        req.body.phoneNumber
    ]);}


    else if(req.body.role==="b"){
        await pool.query("INSERT INTO Doctors (name, email, password, birthDate,gender, spaciality, phoneNumber) VALUES (?, ?, ?, ?, ?, ?,?)", [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.birthDate,
            req.body.gender,  
            req.body.spaciality,
            req.body.phoneNumber
        ]);
        }

        else if(req.body.role==="s"){
            await pool.query("INSERT INTO Staff (email, password, staffSpaciality, type) VALUES (?, ?, ?, ?)", [
                req.body.email,
                hashedPassword,
                req.body.spaciality,  
                req.body.type
            ]);
            
            }

            else if(req.body.role==="admition"){
                await pool.query("INSERT INTO `admition`(name, email,password, dateOfBirth,phone_number,gender  ) VALUES (?, ?, ?, ?, ?,?)", [
                    req.body.name,
                    req.body.email,
                    hashedPassword,
                    req.body.birthDate,  
                    req.body.phoneNumber,
                    req.body.gender 
                ]);
                }

            else{
                await pool.query("INSERT INTO `users`(`id`, `username`, `email`) VALUES (9,'[value-2]','[value-3]')")
            }



    res.redirect('/register')
    console.log(users)
    }catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data: ' + error.message);
    }
    })






    app.delete('/register/:id', async (req, res) => {
        const id = req.params.id;
    
        try {
            // Disable foreign key checks
            await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    
            // SQL query to delete a record from the 'doctors' table based on ID or from the 'nurses' table if the ID is found there
            await pool.query('DELETE FROM doctors WHERE id = ?', [id]);

            // Delete record from the 'nurses' table
            await pool.query('DELETE FROM nurses WHERE id = ?', [id]);
            await pool.query('DELETE FROM Staff WHERE id = ?', [id]);

            // Execute the delete query with both 'id' values passed as parameters
            //await pool.query(sql, [id, id]);
    
            // Re-enable foreign key checks
            await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
            console.log('user deleted successfully');
            res.json({ redirect: '/register' }); // Redirect to the register page after successful deletion
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
  





   

    async function isDoctor(userId) {
        try {
            const sql = "SELECT * FROM doctors WHERE id = ?";
            const [rows, fields] = await pool.query(sql, [userId]);
            // If rows.length > 0, it means the user exists in the doctor table
            return rows.length > 0;
        } catch (error) {
            console.error("Error checking doctor:", error);
            return false;
        }
    } 
    async function getNameById(id, tableName) {
        try {
            const [rows, fields] = await connection.execute(`SELECT name FROM ${tableName} WHERE id = ?`, [id]);
    
            if (rows.length > 0) {
                return rows[0].name;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching name:', error);
            throw error;
        }
    }



    async function getNameById(id, tableName) {
        try {
            const [rows, fields] = await pool.query(`SELECT name FROM ${tableName} WHERE id = ?`, [id]);
    
            if (rows.length > 0) {
                return rows[0].name;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching name:', error);
            throw error;
        }
    }

     
        app.get('/tasks', async (req, res) => {
            try {
                const query = `
                SELECT tasks.*, doctors.name AS doctor_name
                FROM tasks
                LEFT JOIN doctors ON tasks.doctor_id = doctors.id
            `;
            const [tasksRows] = await pool.query(query);
                        const query1 = `
                        SELECT nurses.name, done_tasks.taskId FROM done_tasks INNER JOIN nurses ON done_tasks.nurse_id = nurses.id WHERE done_tasks.taskId IN (SELECT taskId FROM tasks WHERE tasks.task_id = done_tasks.taskId);

                        
            `;/* SELECT tasks.task_id, nurses.*
            FROM tasks
            INNER JOIN done_tasks ON tasks.task_id = done_tasks.taskId
            INNER JOIN nurses ON done_tasks.nurse_id = nurses.id
            WHERE done_tasks.taskId IS NOT NULL;
            */
const query2=`SELECT tasks.task_id FROM tasks LEFT JOIN done_tasks ON tasks.task_id = done_tasks.taskId WHERE done_tasks.taskId IS NOT NULL;
`
const [doneRows] = await pool.query(query2);
console.log(doneRows)
            const [nurseRows] = await pool.query(query1);
console.log(nurseRows.id)
                const isUserDoctor = await isDoctor(req.user.id);
                if (nurseRows.length > 0) {
                    // The query returned results, do something with them
                    console.log("Tasks found:", nurseRows);
                } else {
                    // No tasks found
                    console.log("No tasks found.");
                }
                if (isUserDoctor) { 

                   
                    res.render('tasks.ejs', { tasks: tasksRows, isDoctor: true,done_task_nurse_info:nurseRows });
                   
                } 
                 else {
                    res.render('tasks.ejs', { tasks: tasksRows, isDoctor: false,done_task_nurse_info:nurseRows});
                } 
            } catch (error) {
                console.error('Error retrieving tasks or checking user type:', error);
                res.status(500).send('Internal Server Error');
            }  
        }); 
           
    app.post('/tasks', async (req, res) => {
    try {
        // Check if req.user.id exists in the doctor table
        const isUserDoctor = await isDoctor(req.user.id);
        const formType = req.body.formType;
        if (isUserDoctor) {
/*
            if (formType === 'deleteTasks'){
                const deleteTaskId = req.body.deleteTaskId;
                if (deleteTaskId) {
                    // Execute SQL query to delete task from database
                    const query = 'DELETE FROM tasks WHERE task_id = ?';
                    pool.query(query, [deleteTaskId], (error, results) => {
                        if (error) {
                            console.error('Error deleting task:', error);
                            res.status(500).send('Internal Server Error');
                        } else {
                            console.log('Task deleted successfully');
                            // Redirect to the same page or render the tasks page again
                            res.redirect('/tasks');
                        }
                    });
                }
            
            } 
*/
            
            if (formType === 'addTask'){
            await pool.query("INSERT INTO `tasks` (`details`, `doctor_id`, `file_id`) VALUES ( ?, ?, ?)", [
                req.body.details,
                req.user.id, // Assuming req.user.id contains the doctor's ID from the session
                req.body.patient_id,]); 
                res.redirect('/tasks')  
            }
            else if (formType === 'submitTasks') {res.redirect('/tasks') }
        } else {   if (formType === 'submitTasks') {
            const taskIds = req.body.taskIds;
            // Render tasks.ejs with isDoctor set to false
            //res.status(403).send("Forbidden: User is not a doctor");
            
            if (taskIds && taskIds.length > 0) {
                for (const taskId of taskIds) {
                    console.log(taskId)
                    await pool.query("INSERT INTO `done_tasks` (`taskId`, `nurse_id`) VALUES (?, ?)", [
                        taskId,
                        req.user.id
                    ]);
                } 
            } 
res.redirect('/tasks') 
         }
         else if (formType === 'addTask') {res.redirect('/tasks') } 
          } 
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});  


app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Disable foreign key checks
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        // SQL query to delete a record from the 'tasks' table based on ID
        const sql = 'DELETE FROM tasks WHERE task_id = ?';

        // Execute the delete query
        await pool.query(sql, [id]);

        // Re-enable foreign key checks
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Task deleted successfully');
        res.json({ redirect: '/tasks' }); // Redirect to the tasks page after successful deletion
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
});


async function isAdmition(userId) {
    try {
        const sql = "SELECT * FROM file WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [userId]);
        // If rows.length > 0, it means the user exists in the doctor table
        return rows.length > 0;
    } catch (error) {
        console.error("Error checking doctor:", error);
        return false;
    }
}
app.get('/admition', async (req, res) => {
    try {
        const query = `SELECT * FROM file`;
        const [fileRows] = await pool.query(query);
        console.log('Fetched files:', fileRows); // Log fetched files for debugging
        res.render('admition.ejs', { files: fileRows });
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/admition', async (req, res) => {
    const isUseradmition = await isAdmition(req.user.id);
    if(isUseradmition){
    await pool.query("INSERT INTO `file` (`patient_name`, `file_id`, `phone_number`) VALUES ( ?, ?, ?)", [
        req.body.patient_name,
        req.body.patient_id,
        req.body.phone_number
    ]); 
        res.redirect('/admition')  
}
})
/*SELECT f.*, ap.date_added
FROM file f
INNER JOIN admission_patient ap ON f.file_id = ap.file_id;
 */
app.get('/admissionPatient', async (req, res) => {

    try {
        const query = `SELECT f.*, ap.date_added
        FROM file f
        INNER JOIN admission_patient ap ON f.file_id = ap.file_id;`;
        const [admission_patientRows] = await pool.query(query);
        console.log('Fetched files:', admission_patientRows); // Log fetched files for debugging
        res.render('admissionPatient.ejs', { admission_patients: admission_patientRows });
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/admissionPatient', async (req, res) => {
    const [existingPatientt] = await pool.query('SELECT * FROM admission_patient WHERE file_id = ?', [
        req.body.file_id,
    ]);
    console.log(req.body.file_id)
    console.log(existingPatientt)


    if( existingPatientt.length > 0 ){
       /* const sql = "SELECT * FROM file WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [userId]);
        res.render('/admition',{mes:'user already added'})*/
        console.log("user already added")
        res.redirect('/file')
    }
    else{
        console.log("here i am")
    await pool.query("INSERT INTO `admission_patient` (`file_id`) VALUES ( ?)", [
        
        req.body.file_id,
        
    ]); 
    res.redirect('/file')
    }
})
 
app.delete('/admissionPatient/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Disable foreign key checks
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');

        // SQL query to delete a record from the 'tasks' table based on ID
        const sql = 'DELETE FROM admission_patient WHERE file_id = ?';

        // Execute the delete query
        await pool.query(sql, [id]);

        // Re-enable foreign key checks
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Task deleted successfully');
        res.json({ redirect: '/admissionPatient' }); // Redirect to the tasks page after successful deletion
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/file', async (req, res) => {
    res.render('file.ejs'); 

})
app.get('/AI', async (req, res) => {
    res.render('AI.ejs'); 
});

/*
app.delete('/deleteTask', (req, res) => {
    console.log('DELETE request received for /deleteTask route');
    const id = parseInt(req.body.id);

    const query = 'DELETE FROM tasks WHERE task_id = ?';
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting task:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Task deleted successfully');
            res.redirect('/tasks'); // Redirect to the tasks page after successful deletion
        }
    });
});
*/

 
/*
<h1>Tasks List</h1>
<ul>
    <% tasks.forEach(task => { %>
        <li><%= task.details %> </li>
    <% }) %>
</ul> */
/*else {
                // Respond with an error message if req.user.id does not exist in the doctor table
                res.status(403).send("Forbidden: User is not a doctor");
            }


/*
app.delete('/logout', (req, res) => {
    req.logOut(); // Terminate the session
    res.redirect('/login'); // Redirect the user to the login page
})*/
app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return  res.redirect('/')
    }
    next()
}

app.listen(3000)   

/*<h1>hi <%= name %></h1>
<form id="logoutForm" action="/logout" method="POST"> <!-- Form submission method set to POST -->
    <input type="hidden" name="_method" id="methodOverride" value="DELETE"> <!-- Method override for DELETE -->
    <input type="hidden" name="originalMethod" value="POST"> <!-- Store the original method -->
    <button type="submit">Log Out</button> <!-- Submit button -->
</form>
<a href="/tasks">tasks</a> <!-- Link to tasks page -->

<script>
    document.getElementById("logoutForm").addEventListener("submit", function(event) {
        const originalMethod = document.getElementById("logoutForm").elements["originalMethod"].value;
        document.getElementById("methodOverride").value = originalMethod; // Set method override to original method
    });
</script>*/