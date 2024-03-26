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
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

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



app.get('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const [doctorRows, doctorFields] = await pool.query('SELECT * FROM Doctors');
        const [nurseRows, nurseFields] = await pool.query('SELECT * FROM nurses');
        const [staffRows, staffFields] = await pool.query('SELECT * FROM staff');
        
        res.render('register.ejs', { doctors: doctorRows, nurses: nurseRows, staff: staffRows });

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

app.post('/register',checkNotAuthenticated,async(req,res)=>{
    try{
    const hashedPassword=await bcrypt.hash(req.body.password,10)
    if(req.body.role==="a"){
    await pool.query("INSERT INTO nurses (id, name, email, password, birthDate, section, rank, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
        req.body.id,
        req.body.name,
        req.body.email,
        hashedPassword,
        req.body.birthDate,  
        req.body.section,
        req.body.rank,
        req.body.phoneNumber
    ]);}


    else if(req.body.role==="b"){
        await pool.query("INSERT INTO Doctors (name, email, password, birthDate, spaciality, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)", [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.birthDate,  
            req.body.spaciality,
            req.body.phoneNumber
        ]);
        }

        else if(req.body.role==="s"){
            await pool.query("INSERT INTO Staff (email, password, staffSpaciality, type) VALUES (?, ?, ?, ?)", [
                req.body.email,
                hashedPassword,
                req.body.staffSpaciality,  
                req.body.type
            ]);
            
            }
            else{
                await pool.query("INSERT INTO `users`(`id`, `username`, `email`) VALUES (9,'[value-2]','[value-3]')")
            }



    res.redirect('/login')
    console.log(users)
    }catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data: ' + error.message);
    }
    })



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