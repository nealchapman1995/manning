// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8020;  // Set a port number at the top so it's easy to change in the future
const methodOverride = require('method-override');

var db = require('./db-connector')

CreateSoldierTable = "CREATE TABLE `Soldiers` (`soldier_id` int(11) NOT NULL AUTO_INCREMENT,`soldier_name` varchar(45) NOT NULL,`rank` varchar(45) NOT NULL,`address` varchar(45) DEFAULT NULL,`soldier_status` varchar(45) DEFAULT NULL,`Squads_squad_id` int(11) NOT NULL,`Weapons_weapon_id` int(11) NOT NULL, PRIMARY KEY (soldier_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;"
CreateWeaponTabler = "CREATE TABLE `Weapons` (`weapon_id` int(11) NOT NULL, `weapon_model` varchar(45) NOT NULL, `weapon_status` varchar(45) DEFAULT NULL, `Squads_squad_id` int(11) DEFAULT NULL PRIMARY KEY (weapon_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;"
SelectSoldiers = "SELECT * FROM Soldiers;";
SelectWeapons = "SELECT * FROM Weapons;";
SelectSquad = "SELECT * FROM Squads;";


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

let weapons = ""
let soldiers = ""
let squads = ""

db.pool.query(CreateSoldierTable, function(err, results, fields){
});




/*
    ROUTES
*/
app.get('/', function(req, res)
    {   
        db.pool.query(SelectWeapons, function(err, results, fields){
            weapons = results
        })

        db.pool.query(SelectSquad, function(err, results, fields){
            squads = results
        })

        db.pool.query(SelectSoldiers, function(err, results, fields){
            soldiers = results 
            res.render('soldiers', {soldiers, weapons, squads})  
        })
         
    });

app.post('/new_soldier', async(req, res) => {
    let soldier_insert = `INSERT INTO Soldiers (soldier_name, rank, address, soldier_status, Squads_squad_id, Weapons_weapon_id) VALUES('${req.body.soldier.name}', '${req.body.soldier.rank}', '${req.body.soldier.address}', '${req.body.soldier.status}', ${req.body.soldier.squadID}, ${req.body.soldier.weaponID})`;
    db.pool.query(soldier_insert, function(err, results, fields) {
        res.redirect('/')
    })
})

app.delete('/delete_soldier/:id', async(req, res) => {
    let soldier_delete = `DELETE FROM Soldiers WHERE soldier_id = ${req.params.id}`;
    db.pool.query(soldier_delete, function(err, results, fields) {
        res.redirect('/')
    })
})

app.put('/edit_soldier', async(req, res) => {
    let soldier_edit = `UPDATE Soldiers SET soldier_name = '${req.body.soldier.name}', rank = '${req.body.soldier.rank}', address = '${req.body.soldier.address}', soldier_status = '${req.body.soldier.status}', Squads_squad_id = ${req.body.soldier.squadID}, Weapons_weapon_id = ${req.body.soldier.weaponID} WHERE soldier_id = ${req.body.soldier.id}`;
    db.pool.query(soldier_edit, function(err, results, fields) {
        res.redirect("/")
    })
})

app.post('/squads/new', (req, res) => {
    let squad_insert = `INSERT INTO Squads (squad_leader, squad_name) VALUES ('${req.body.squad.leader}', '${req.body.squad.name}');`
    db.pool.query(squad_insert, function(err, results, fields){
        console.log(err)
        res.redirect('/squads')
    })
})

app.delete('/squads/delete/:id', async(req, res) => {
    let squad_delete = `DELETE FROM Squads WHERE squad_id = ${req.params.id}`;
    db.pool.query(squad_delete, function(err, results, fields) {
        console.log(err)
        res.redirect('/squads')
    })
})

app.get('/squads', function(req, res){
    db.pool.query(SelectSquad, function(err, results, fields){
        squads = results
        res.render('squads', {squads})
    })
});

app.get('/weapons', function(req, res){
    res.render('weapons')
});

app.get('/vehicles', function(req, res) {
    res.render('vehicles')
});

app.get('/keys', function(req, res) {
    res.render('keys')
});

app.get('/buildings', function(req, res) {
    res.render('buildings')
});

app.get('/key_holders', function(req,res) {
    res.render('keyholders')
})

    /*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});