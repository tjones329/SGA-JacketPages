const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const mysql = require("mysql");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cors());

////////////////////////////////////////////////////////////////////////////////  SERVER & DB SETUP 

// Connect to the MySQL database
var connection = mysql.createConnection({
    host        :   "localhost",
    user        :   "root",
    password    :   "leafxrose1312"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// Use the database jacketpages_dev
connection.query("USE jpdev");

app.listen(process.env.PORT || 8081);   //server listening to localhost 8081

app.use(express.static("public"));  //automatically serves static files home.html and its css files

console.log("Running on port 8081"); 


////////////////////////////////////////////////////////////////////////////////  ROUTES TO HTML & CSS DOCS 

app.get('/', function(req, res){    // HOME - routes to home.html on startup - only directs to html file - css needs previous line to be displayed
  res.sendfile('public/home.html');
});

app.get('/jpbills', function(req, res){    // JPBILLS
  res.sendfile('public/jpbills.html');
});

app.get('/sgapeople', function(req, res){    // SGAPEOPLE
  res.sendfile('public/sgapeople.html');
});


////////////////////////////////////////////////////////////////////////////////  SGA PEOPLE 

//Gets list of all users in the user table 
app.get("/users", (req, res) => {
    connection.query(`SELECT * FROM users ORDER BY id DESC LIMIT 50`, function(err, rows) {
        res.send({data: rows});
    });
});

//Gets user in user table based on id 
//used in sgapeople.html to get first and last names 
app.get("/user", (req, res) => {
    connection.query(`SELECT * FROM users WHERE id=${req.query.id}`, function(err, rows) {
        res.send({data:
                 rows
        });
    });
});

//Gets most recently added user from user table
//used to get id to add to datbase in sgapeopleadd 
app.get("/last_member", (req, res) => {
    connection.query(`SELECT * FROM users ORDER BY id DESC LIMIT 1`, function(err, rows) {
        res.send({data: 
                  rows});
    });
});

//Gets list of all the people in the sga_people table 
app.get("/people", (req, res) => {
    connection.query(`SELECT * FROM sga_people`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

//Gets user in sga_table based on user_id 
app.get("/sga_member", (req, res) => {
    connection.query(`SELECT * FROM sga_people WHERE user_id=${req.query.user_id}`, function(err, rows) {
        res.send({data:
                 rows
        });
    });
}); 

//deletes a user from user table using their id passed in through the url
app.get("/delete_user", (req, res) => {
    //debugging
    res.write('You deleted the user with the id "' + req.query.id+'".\n');
    
    connection.query(`DELETE FROM users WHERE id=${req.query.id}`, function(err, rows) {
        if (err) console.log(err); 
    });
});

//deletes a member from sga_people table using their user_id passed in through the url
app.get("/delete_member", (req, res) => {
    //debugging
    res.write('You deleted the sga member with the user_id "' + req.query.user_id+'".\n');
    
    connection.query(`DELETE FROM sga_people WHERE id=${req.query.user_id}`, function(err, rows) {
        if (err) console.log(err); 
    });
});

//edits a user from user table using their id passed in through the url 
app.post("/edit_user", (req, res) => {
    //debugging
    res.write('You sent the name "' + req.body.firstname+'".\n');
    res.write('You sent the level"' + req.body.level+'".\n');
    res.write('You sent the email"' + req.body.email+'".\n');
    res.write('You sent the major"' + req.body.major+'".\n');
    res.write('You sent the year"' + req.body.year+'".\n');
    res.end()
    
    connection.query(`UPDATE users SET email='${req.body.email}', first_name='${req.body.firstname}', last_name='${req.body.lastname}', level='${req.body.level}', major='${req.body.major}', year='${req.body.year}' WHERE id=${req.query.id}`, function(err, rows) {
        if (err) console.log(err); 
    });
});

//edits a sga member using their id in the user table and user id in the sga_people table 
app.post("/edit_member", (req, res) => {
    //debugging
    console.log(req.data);
    res.write('You sent the name "' + req.body.firstname+'".\n');
    res.write('You sent the house "' + req.body.house+'".\n');
    res.write('You sent the department "' + req.body.department+'".\n');
    res.end()
    
    connection.query(`UPDATE sga_people SET house='${req.body.house}', department='${req.body.department}', status='${req.body.status}' WHERE user_id=${req.query.id}`, function(err, rows) {
        if (err) console.log(err); 
    });
    
});
 
//adds a new user into the users table 
//make sure major and year columns are added to database 
app.post("/add_user", (req, res) => {
    
    //debugging
    res.write('You sent the name "' + req.body.firstname+'".\n');
    res.write('You sent the gtusername "' + req.body.gtusername+'".\n');
    res.write('You sent the email "' + req.body.email+'".\n');
    res.write('You sent the major "' + req.body.major+'".\n');
    res.write('You sent the year "' + req.body.year+'".\n');
    res.end()
    
    //id is passed in through the url
    //in usersadd, ajax gets id of most recently added user than adds 1 to it. Passes this number through the url 
    connection.query(`INSERT INTO users (id, gt_user_name, email, first_name, last_name, major, year) VALUES ('${req.query.id}', '${req.body.gtusername}', '${req.body.email}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.major}', '${req.body.year}')`, function(err, rows) {
        if (err) console.log(err); 
    });
});

//adds a new member into the sga_people table 
app.post("/add_sga_member", (req, res) => {
    
    //debugging
    res.write('You sent the id "' + req.query.id+'".\n');
    res.write('You sent the house "' + req.body.house+'".\n');
    res.write('You sent the department "' + req.body.department+'".\n');
    res.end()
    
    //user id is passed in through the url 
    connection.query(`INSERT INTO sga_people (user_id, house, department) VALUES ('${req.query.id}', '${req.body.house}', '${req.body.department}')`, function(err, rows) {
        if (err) console.log(err); 
    });
});


////////////////////////////////////////////////////////////////////////////////  BILLS 

// Return the data of the bills submitted by a certain submitter
// Still prone to SQL injection attacks.
app.get("/bills_sub", (req, res) => {
    connection.query(`SELECT * FROM bills WHERE submitter=${req.param('submitter')}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get an individual bill's data
// Still prone to SQL injection attacks.
app.get("/bill_id", (req, res) => {
    // Return all bills belonging to a certain submitter. Still prone to SQL injection attacks.
    connection.query(`SELECT * FROM bills WHERE id=${req.param('id')}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get votes for a specific bill given id
// Still prone to SQL injection attacks.
app.get("/bill_votes", (req, res) => {
    // Return all bills belonging to a certain submitter. Still prone to SQL injection attacks.
    connection.query(`SELECT * FROM bill_votes WHERE id=${req.param('id')}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get an individual organization's data
// Still prone to SQL injection attacks.
app.get("/org", (req, res) => {
    // Return all bills belonging to a certain submitter. Still prone to SQL injection attacks.
    connection.query(`SELECT * FROM organizations WHERE id=${req.param('id')}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Delete the bill by a certain id
// Still prone to SQL injection attacks.
app.delete("/bill_id", (req, res) => {
    connection.query(`DELETE FROM bills WHERE id=${req.param("id")}`, function(err, rows) {
        if (err) res.send({err: err});
        else res.send(`id ${req.param("id")} deleted!`);
    });
});

// Get status for a certain bill given id
// Still prone to SQL injection attacks.
app.get("/bill_status", (req, res) => {
    connection.query(`SELECT name FROM bill_statuses WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get user given id
// Still prone to SQL injection attacks.
app.get("/user", (req, res) => {
    connection.query(`SELECT * FROM users WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get submitter for a certain bill given id
// Still prone to SQL injection attacks.
app.get("/bill_authors", (req, res) => {
    connection.query(`SELECT * FROM bill_authors WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Get submitter for a certain bill given id
// Still prone to SQL injection attacks.
app.put("/bill_passed", (req, res) => {
    connection.query(`UPDATE bills SET status=6 WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Approve a bill for the graduate president
// Still prone to SQL injection attacks.
app.put("/bill_sign_gp", (req, res) => {
    connection.query(`UPDATE bill_authors SET grad_pres_id=${req.param("gp_id")} WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Approve a bill for the graduate secretary
// Still prone to SQL injection attacks.
app.put("/bill_sign_gs", (req, res) => {
    connection.query(`UPDATE bill_authors SET grad_secr_id=${req.param("gs_id")} WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Approve a bill for the undergraduate president
// Still prone to SQL injection attacks.
app.put("/bill_sign_up", (req, res) => {
    connection.query(`UPDATE bill_authors SET undr_pres_id=${req.param("up_id")} WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Approve a bill for the undergraduate secretary
// Still prone to SQL injection attacks.
app.put("/bill_sign_us", (req, res) => {
    connection.query(`UPDATE bill_authors SET undr_secr_id=${req.param("us_id")} WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Approve a bill for the vice president of finance
// Still prone to SQL injection attacks.
app.put("/bill_sign_vf", (req, res) => {
    connection.query(`UPDATE bill_authors SET vp_fina_id=${req.param("vf_id")} WHERE id=${req.param("id")}`, function(err, rows) {
        res.send({data: 
            rows
        });
    });
});

// Create a new bill
// Still prone to SQL injection attacks.
app.post("/bill_create", (req, res) => {
    connection.query(`INSERT INTO bill_authors (undr_auth_id, grad_auth_id) VALUES 
            ('${req.param("data_Authors_undr_auth_id")}', '${req.param("data_Authors_grad_auth_id")}')`, function(err, rows) {
        connection.query(`INSERT INTO bills (create_date, last_mod_date, title, description, fundraising, type, category, org_id, dues, ugMembers, gMembers, auth_id, status) VALUES 
                (NOW(), NOW(), '${req.param("data_Bill_title")}', '${req.param("data_Bill_description")}', '${req.param("data_Bill_fundraising")}', '${req.param("data_Bill_type")}', 
                '${req.param("data_Bill_category")}', ${req.param("data_Bill_org_id")}, '${req.param("data_Bill_dues")}', '${req.param("data_Bill_ugMembers")}', 
                ${req.param("data_Bill_gMembers")}, ${rows.insertId}, 1)`,
                function(err, rows) {
            let billId = rows.insertId;
            for (let i = 0; req.param(`data_${i}_LineItem_line_number`); i++) {
                connection.query(`INSERT INTO line_items (line_number, bill_id, name, cost_per_unit, quantity, total_cost, amount, account, type, comments, last_mod_date) VALUES
                        (${req.param('data_${i}_LineItem_line_number')}, ${billId}, ${req.param('data_${i}_LineItem_name')}, ${req.param('data_${i}_LineItem_cost_per_unit')}, 
                                ${req.param('data_${i}_LineItem_quantity')}, ${req.param('data_${i}_LineItem_total_cost')}, 
                                ${req.param('data_${i}_LineItem_amount')}, ${req.param('data_${i}_LineItem_account')}, 
                                ${req.param('data_${i}_LineItem_type')}, ${req.param('data_${i}_LineItem_comments')}, NOW())`,
                function(err, rows) {
                    if (err) console.log(err);
                    console.log(req.param("data_0_LineItem_line_number"));
                });
            }
            res.send(rows);
        });
    });
});
