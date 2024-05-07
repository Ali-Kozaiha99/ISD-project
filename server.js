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

const multer = require('multer');
const storage=multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,'file_uploads')
    },
    filename:(req,file,cd)=>{
console.log(file)
cd(null,Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({storage:storage})
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
app.use('/file_uploads', express.static(path.join(__dirname, 'file_uploads'))); 
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
            await pool.query('DELETE FROM admition WHERE id = ?',[id])
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

                    const query = ' SELECT fc.*, f.patient_name FROM file_case fc JOIN file f ON fc.file_id = f.file_id WHERE fc.dr_id = ?';

                    // Execute the query with the userId as a parameter
                    const [dr_patientsRows] = await pool.query(query, req.user.id);
                   
                    res.render('tasks.ejs', { tasks: tasksRows, isDoctor: true,done_task_nurse_info:nurseRows,dr_patients:dr_patientsRows });
                    
                } 
                 else {
                    res.render('tasks.ejs', { tasks: tasksRows, isDoctor: false,done_task_nurse_info:nurseRows,dr_patients:[]});
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
        const sql = "SELECT * FROM admition WHERE id = ?";
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
        const query = `SELECT f.*, ap.date_added,ap.room_name
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
 
    if (existingPatientt.length > 0) {
        console.log("User already added");
        console.log(existingPatientt)

        res.redirect('/file?existingPatientId=' + existingPatientt[0].file_id); // Redirect with patient ID in query parameter


    } else {
        await pool.query("INSERT INTO `admission_patient` (`file_id`) VALUES (?)", [req.body.file_id]);
        await pool.query(`INSERT INTO file_case (file_id)
        SELECT * FROM (SELECT ?) AS tmp
        WHERE NOT EXISTS (
            SELECT file_id FROM file_case WHERE file_id = ?
        ) LIMIT 1;
         `, [req.body.file_id,req.body.file_id]);
        res.redirect('/file?existingPatientId=' + [req.body.file_id]);
         
    }
}); 

 
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
    const query = `SELECT * FROM floors`;
        const [floorRows] = await pool.query(query);
        const query1 = `SELECT r.*
        FROM rooms r
        LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
        WHERE r.floor_number = 1
          AND ap.room_name IS NULL;
        `;
        const [floor1Rows] = await pool.query(query1);
        const query2 = `SELECT r.*
        FROM rooms r
        LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
        WHERE r.floor_number = 2
          AND ap.room_name IS NULL;
        `;
        const [floor2Rows] = await pool.query(query2);
        const query3 = `SELECT r.*
        FROM rooms r
        LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
        WHERE r.floor_number = 3
          AND ap.room_name IS NULL;
        `;
        const [floor3Rows] = await pool.query(query3);
        const query4 = `SELECT r.*
        FROM rooms r
        LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
        WHERE r.floor_number = 4
          AND ap.room_name IS NULL;
        `;
        const [floor4Rows] = await pool.query(query4);
        /*SELECT doctors.name
        FROM doctors
        JOIN file_case ON doctors.id = file_case.dr_id; */



        const existingPatientId = req.query.existingPatientId;
        console.log(existingPatientId)
        const query5 = `
        SELECT  * FROM doctors 
        `;
         
        const [query5Rows] = await pool.query(query5);


        const query6 = `
        SELECT * FROM surgery WHERE file_id=?
      `;
      
      const [surgeryInfo] = await pool.query(query6, [existingPatientId]);
      
      const query7 = `
      SELECT * FROM file WHERE file_id=?
    `;
    const [personalFileInfo] = await pool.query(query7, [existingPatientId]);
    const query8 = `
    SELECT * FROM allergy WHERE file_id=?
  `;
  const [allergyInfo] = await pool.query(query8, [existingPatientId]);
  const query9 = `
  SELECT admission_patient.room_name, file_case.dr_id, doctors.name AS doctor_name
  FROM admission_patient
  JOIN file_case ON admission_patient.file_id = file_case.file_id
  JOIN doctors ON file_case.dr_id = doctors.id
  WHERE admission_patient.file_id = ?;
  
;
  `;
  let roomInfoo = []; // Initialize roomInfoo outside the if-else block

  const [roomInfo] = await pool.query(query9, [existingPatientId]);
  if (roomInfo.length > 0) { // Check if roomInfo has any data
      roomInfoo = roomInfo[0]; // Assign roomInfo[0] to roomInfoo if roomInfo has data
  }
  
  const query10 = `
      SELECT *
      FROM file_case
      WHERE file_id = ?
      AND case_id = (SELECT MAX(case_id) FROM file_case WHERE file_id = ?);
  `;
  
  const [file_case_id] = await pool.query(query10, [existingPatientId, existingPatientId]);
  
  const query11 = `
      SELECT dr_id
      FROM file_case
      WHERE file_id = ?
      ORDER BY case_id DESC
      LIMIT 1;
  `;
  
  const [file_case_dr] = await pool.query(query11, [existingPatientId]);
   
  res.render('file.ejs', { 
      floors: floorRows, 
      floor1: floor1Rows, 
      floor2: floor2Rows, 
      floor3: floor3Rows, 
      floor4: floor4Rows, 
      existingPatientId: existingPatientId, 
      DRs: query5Rows, 
      surgeryInfo: surgeryInfo, 
      personalFileInfo: personalFileInfo, 
      allergyInfo: allergyInfo, 
      roomInfoo: roomInfoo, // Pass roomInfoo instead of roomInfo[0]
      file_case_id: file_case_id[0], // Accessing first element from file_case_id
      file_case_dr: file_case_dr[0] // Accessing first element from file_case_dr
  });
  
})     
app.post('/file', async (req, res) => {
    try {
        let selectedRoom;
        let fileId = req.body.file_id; // Assuming file_id is provided in the request body
        const formType = req.body.formType;

        // Check which room select has a value
        if (req.body.selectedRoom1) {
          selectedRoom = req.body.selectedRoom1;
        } else if (req.body.selectedRoom2) {
          selectedRoom = req.body.selectedRoom2;
        } else if (req.body.selectedRoom3) {
          selectedRoom = req.body.selectedRoom3;
        } else if (req.body.selectedRoom4) {
          selectedRoom = req.body.selectedRoom4;
        }
        const SurgeryForm =req.body.surgery
        console.log('selectedRoom', selectedRoom)
        if(SurgeryForm){
          const file_id=req.body.file_id
          const surgery_name=req.body.surgery_name
          const report=req.body.report
          const date=req.body.date
          const surgen=req.body.surgen
          const [resultt] = await pool.query(`INSERT INTO surgery(file_id, surgery_name, report, date, surgen) VALUES (?,?,?,?,?)`,[file_id,surgery_name,report,date,surgen])
           
        }
        const allergy=req.body.allergy
        if(allergy){
          const file_id=req.body.file_id
          const genral_allergy=req.body.genral_allergy
          const medicine_allergy=req.body.medicine_allergy
          const [resultt] = await pool.query(`INSERT INTO allergy(medicine_allergy, genral_allergy, file_id) VALUES (?,?,?)`,[medicine_allergy,genral_allergy,file_id])

        }
        const qus=req.body.questions
        if(qus){
            const symptoms=req.body.symptoms
            const q1 = req.body.q1;
const q2 = req.body.q2;
const q3 = req.body.q3;
const q4 = req.body.q4;
const q5 = req.body.q5;
const q6 = req.body.q6;
const q7 = req.body.q7;
const q8 = req.body.q8;
const q9 = req.body.q9;
const q10 = req.body.q10;
const q11 = req.body.q11;
const q12 = req.body.q12;
const q13 = req.body.q13;
const q14 = req.body.q14;
const q15 = req.body.q15;
const q16 = req.body.q16;
const q17 = req.body.q17;
const q18 = req.body.q18;
const q19 = req.body.q19;
const q20 = req.body.q20;
const q21 = req.body.q21;
const q22 = req.body.q22;
const q23 = req.body.q23;


            const query12=`
UPDATE file_case
SET symptoms = ?,q1=?, q2=?, q3=?, q4=?, q5=?, q6=?, q7=?, q8=?, q9=?, q10=?, q11=?, q12=?, q13=?, q14=?, q15=?, q16=?, q17=?, q18=?, q19=?, q20=?, q21=?, q22=?, q23=?
WHERE file_id = ?
  AND case_id = (SELECT MAX(case_id) FROM file_case WHERE file_id = ?);

`
const [file_case_questions] = await pool.query(query12, [symptoms,q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23,fileId,fileId]);
        } 
        if (selectedRoom && fileId) {
           console.log('selectedRoom', selectedRoom)
            const [resulttt] = await pool.query('UPDATE `file` SET `birth_date` = ?, `setFromInside` = 1 WHERE `file_id` = ?', [req.body.birthD, fileId]);

            const [result] = await pool.query('UPDATE `admission_patient` SET `room_name` = ? WHERE `file_id` = ?', [selectedRoom, fileId]);
          const [resultt] = await pool.query('INSERT INTO `file_case` (`file_id`, `dr_id`) VALUES (?, ?)', [fileId, req.body.Dr_name]);
        }
        const addCase=req.body.addCase
        if(addCase){

            const new_case = await pool.query('INSERT INTO file_case ( file_id) VALUES (?)', [fileId]);
            
        }
          // Query the database to get updated room information
          const query = `SELECT * FROM floors`;
          const [floorRows] = await pool.query(query);
          const query1 = `SELECT r.*
          FROM rooms r
          LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
          WHERE r.floor_number = 1
            AND ap.room_name IS NULL;
          `;
          const [floor1Rows] = await pool.query(query1);
          const query2 = `SELECT r.*
          FROM rooms r
          LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
          WHERE r.floor_number = 2
            AND ap.room_name IS NULL;
          `;
          const [floor2Rows] = await pool.query(query2);
          const query3 = `SELECT r.*
          FROM rooms r
          LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
          WHERE r.floor_number = 3
            AND ap.room_name IS NULL;
          `;
          const [floor3Rows] = await pool.query(query3);
          const query4 = `SELECT r.*
          FROM rooms r
          LEFT JOIN admission_patient ap ON r.room_name = ap.room_name
          WHERE r.floor_number = 4
            AND ap.room_name IS NULL;
          `;
          const [floor4Rows] = await pool.query(query4);

          // Query for doctors information
          const query5 = `SELECT  * FROM doctors`;
          const [query5Rows] = await pool.query(query5);

          const existingPatientId = req.query.existingPatientId;
          const query6 = `
          SELECT  * FROM surgery where file_id=?
          `;
          const [surgeryInfo] = await pool.query(query6,existingPatientId);
          console.log(existingPatientId)
          const query7 = `
          SELECT * FROM file WHERE file_id=?
        `;
        const [personalFileInfo] = await pool.query(query7, [existingPatientId]);
        const query8 = `
        SELECT * FROM allergy WHERE file_id=?
      `; 
      const [allergyInfo] = await pool.query(query8, [existingPatientId]);
      const query9 = `
      SELECT admission_patient.room_name, file_case.dr_id, doctors.name AS doctor_name
      FROM admission_patient
      JOIN file_case ON admission_patient.file_id = file_case.file_id
      JOIN doctors ON file_case.dr_id = doctors.id
      WHERE admission_patient.file_id = ?;
      
    ;
      `;
      const [roomInfoo] = await pool.query(query9, [existingPatientId]);
 
 const query10=`SELECT *
 FROM file_case
 WHERE file_id = ?
   AND case_id = (SELECT MAX(case_id) FROM file_case WHERE file_id = ?);
 `
const [file_case_id] = await pool.query(query10, [existingPatientId,existingPatientId]);
          res.render('file.ejs', { 
            floors: floorRows, 
            floor1: floor1Rows, 
            floor2: floor2Rows, 
            floor3: floor3Rows, 
            floor4: floor4Rows, 
            existingPatientId: existingPatientId,
            DRs: query5Rows ,
            surgeryInfo:surgeryInfo,
            personalFileInfo:personalFileInfo,allergyInfo,
            roomInfoo:roomInfoo[0],file_case_id:file_case_id[0]
          });
 
      } catch (error) {
        console.error('Error updating room in the database:', error);
        // Handle error or send an error response to the client
        res.status(500).send('Internal server error');
      }
});


app.get('/file_tests',async (req, res) =>{
    res.render('test.ejs')
})
app.post('/file_tests',upload.single('file'),async (req, res) =>{
    console.log("here",req.body.file_id)
    const id=req.body.file_id
     const query = `
     SELECT * FROM lab WHERE file_id=?
     `;
      
     const [patient_tests] = await pool.query(query, [id]);
     res.render('test.ejs',{patient_tests});
    
}) 
app.get('/file_scan',async (req, res) =>{
    res.render('scanHistory.ejs')
})
app.post('/file_scan',upload.single('file'),async (req, res) =>{
    console.log("here",req.body.file_id)
    const id=req.body.file_id
     const query = `
     SELECT * FROM scan WHERE file_id=?
     `;
      
     const [patient_tests] = await pool.query(query, [id]);
     res.render('scanHistory.ejs',{patient_tests});
    
})   
app.get('/file_case',async (req, res) =>{
    res.render('casesHistory.ejs')
})
app.post('/file_case',async (req, res) =>{

    const id=req.body.file_id
     const query = `
     SELECT * FROM file_case WHERE file_id=? ORDER BY case_time DESC;
     `;
      
     const [patient_cases] = await pool.query(query, [id]);
     res.render('casesHistory.ejs',{patient_cases});
    
})   

app.post('/surgery',async (req, res) =>{
 const file_id=req.body.file_id
 const surgery_name=req.body.surgery_name
 const report=req.body.report
 const date=req.body.date
 const surgen=req.body.surgen
 const [resultt] = await pool.query(`INSERT INTO surgery(file_id, surgery_name, report, date, surgen) VALUES (?,?,?,?,?)`,[file_id,surgery_name,report,date,surgen])
 res.render('file.ejs')

})
app.get('/AI', async (req, res) => {
    res.render('AI.ejs'); 
}); 
async function islab(userId) {
    try {
        const sql = "SELECT * FROM staff WHERE id = ? AND type = 'lab'";
        const [rows, fields] = await pool.query(sql, [userId]);
        // If rows.length > 0, it means the user exists in the doctor table and has type=lab
        return rows.length > 0;
    } catch (error) {
        console.error("Error checking lab:", error);
        return false;
    }
}

app.get('/lab', async (req, res) => {
    try {
        console.log(req.user.id)
        const isUserDoctor = await isDoctor(req.user.id);
        const isUserlabStaff = await islab(req.user.id);
        // Fetch all data from the lab table
        if(isUserlabStaff){
        const query5 = await pool.query("SELECT * FROM `lab`");
        const labData = query5[0]; // Access the rows returned by the query
        // Render an HTML page and pass the fetched data to it
        res.render('lab.ejs', { labData, isDoctor:isUserDoctor,islab:isUserlabStaff,dr_patients:[] });
        }
        else if(isDoctor){
            const id = req.user.id;
            const sql = 'SELECT * FROM `lab` WHERE `dr_name` = ?';
            
            // Execute the select query
            const labData = await pool.query(sql, [id]);
            const query = ' SELECT fc.*, f.patient_name FROM file_case fc JOIN file f ON fc.file_id = f.file_id WHERE fc.dr_id = ?';

            // Execute the query with the userId as a parameter
            const [dr_patientsRows] = await pool.query(query, req.user.id);
            console.log(labData)
            res.render('lab.ejs', { labData:labData[0], isDoctor: isUserDoctor, islab: isUserlabStaff,dr_patients:dr_patientsRows });
            
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('error.ejs', { errorMessage: 'Error fetching lab data' });
    }
});
 
    
app.post('/lab', upload.single('file'), async (req, res) => {
    try {
        const isUserDoctor = await isDoctor(req.user.id);
        const isUserlabStaff = await islab(req.user.id);


        const { test_name, file_idd } = req.body;
        const {  filename } = req.file||{};
 
        console.log("file_idd:",file_idd)
        // Insert both form data and file information into the database
        if(isUserDoctor){
            const { test_name } = req.body;
            const dr_name = req.user.id;
            const file_id = req.body.patient_id;
        console.log("file_id ",file_id)

        await pool.query("INSERT INTO `lab` (`test_name`, `dr_name`,`file_id`) VALUES ( ?, ?, ?)", [
          test_name,
          dr_name,
         
          file_id
          
        ]);   
    } 
    else if(isUserlabStaff){

        await pool.query("UPDATE `lab` SET `file_filename` = ? WHERE `test_id` = ?", [
            filename,
            file_idd
          ]);
          
    }
        if(isUserlabStaff){
            const query5 = await pool.query("SELECT * FROM `lab`");
            const labData = query5[0]; // Access the rows returned by the query
            // Render an HTML page and pass the fetched data to it
            res.render('lab.ejs', { labData, isDoctor:isUserDoctor,islab:isUserlabStaff,dr_patients:[]});
            }
            else if(isDoctor){
                const query = ' SELECT fc.*, f.patient_name FROM file_case fc JOIN file f ON fc.file_id = f.file_id WHERE fc.dr_id = ?';

                // Execute the query with the userId as a parameter
                const [dr_patientsRows] = await pool.query(query, req.user.id);
                const id = req.user.id;
                const sql = 'SELECT * FROM `lab` WHERE `dr_name` = ?';
                
                // Execute the select query
                const labData = await pool.query(sql, [id]);
                console.log(labData)
                res.render('lab.ejs', { labData:labData[0], isDoctor: isUserDoctor, islab: isUserlabStaff ,dr_patients:dr_patientsRows});
                
            }
    } catch (error) { 
        console.error('Error:', error);
        res.render('error.ejs', { 
            errorMessage: 'Error uploading file and saving form data' 
        });
    }
});

async function isScan(userId) {
    try {
        const sql = "SELECT * FROM staff WHERE id = ? AND type = 'scan'";
        const [rows, fields] = await pool.query(sql, [userId]);
        // If rows.length > 0, it means the user exists in the doctor table and has type=lab
        return rows.length > 0;
    } catch (error) {
        console.error("Error checking lab:", error);
        return false;
    }
}

app.get('/scan', async (req, res) => {
    try {
        console.log(req.user.id)
        const isUserDoctor = await isDoctor(req.user.id);
        const isUserScanStaff = await isScan(req.user.id);
        // Fetch all data from the lab table
        if(isUserScanStaff){
        const query5 = await pool.query("SELECT * FROM `scan`");
        const scanData = query5[0]; // Access the rows returned by the query
        // Render an HTML page and pass the fetched data to it
        res.render('scan.ejs', { scanData, isDoctor:isUserDoctor,isScan:isUserScanStaff,dr_patients:[]});
        }
        else if(isDoctor){
            const id = req.user.id;
            const sql = 'SELECT * FROM `scan` WHERE `dr_id` = ?';
            
            // Execute the select query
            const scanData = await pool.query(sql, [id]);
            const query = ' SELECT fc.*, f.patient_name FROM file_case fc JOIN file f ON fc.file_id = f.file_id WHERE fc.dr_id = ?';
            const [dr_patientsRows] = await pool.query(query,[id]);
            res.render('scan.ejs', { scanData:scanData[0], isDoctor: isUserDoctor, isScan: isUserScanStaff, dr_patients: dr_patientsRows });
            
        }
    } catch (error) {
        console.error('Error:', error);
        res.render('error.ejs', { errorMessage: 'Error fetching scan data' });
    }
});
 
 
app.post('/scan', upload.single('file'), async (req, res) => {
    try {
        const isUserDoctor = await isDoctor(req.user.id);
        const isUserScanStaff = await isScan(req.user.id);
        const { scan_name } = req.body;
        const dr_id = req.user.id;
        const {  filename } = req.file||{};
        const file_idd=req.body.file_idd
        const file_id = req.body.patient_id;
 

        if(isUserDoctor){
            await pool.query("INSERT INTO `scan` (`scan_name`, `dr_id`,`file_id`) VALUES (?, ?,?)", [
                scan_name,
              dr_id,
             file_id
              
            ]);
        } 
        else if(isUserScanStaff){
            await pool.query("UPDATE `scan` SET `result` = ? WHERE `scan_id` = ?", [
                filename,
                file_idd
              ]);
        }
        if(isUserScanStaff){
            const query5 = await pool.query("SELECT * FROM `scan`");
            const scanData = query5[0]; // Access the rows returned by the query
            // Render an HTML page and pass the fetched data to it
            
            res.render('scan.ejs', { scanData, isDoctor:isUserDoctor,isScan:isUserScanStaff,dr_patients:[]});
            }
            else if(isDoctor){
                const id = req.user.id;
                const sql = 'SELECT * FROM `scan` WHERE `dr_id` = ?';
                
                // Execute the select query
                const scanData = await pool.query(sql, [id]);
                const query = ' SELECT fc.*, f.patient_name FROM file_case fc JOIN file f ON fc.file_id = f.file_id WHERE fc.dr_id = ?';
                const [dr_patientsRows] = await pool.query(query, req.user.id);
                res.render('scan.ejs', { scanData:scanData[0], isDoctor: isUserDoctor, isScan: isUserScanStaff, dr_patients:dr_patientsRows });
                
            }
    } catch (error) { 
        console.error('Error:', error);
        res.render('error.ejs', { 
            errorMessage: 'Error uploading file and saving form data' 
        });
    }
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