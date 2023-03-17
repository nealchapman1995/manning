// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8010;  // Set a port number at the top so it's easy to change in the future
const methodOverride = require('method-override');

var db = require('./db-connector')

CreateSoldierTable = "CREATE TABLE `Soldiers` (`soldier_id` int(11) NOT NULL AUTO_INCREMENT,`soldier_name` varchar(45) NOT NULL,`rank` varchar(45) NOT NULL,`address` varchar(45) DEFAULT NULL,`soldier_status` varchar(45) DEFAULT NULL,`Squads_squad_id` int(11) NOT NULL,`Weapons_weapon_id` int(11) NOT NULL, PRIMARY KEY (soldier_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;"
CreateWeaponTabler = "CREATE TABLE `Weapons` (`weapon_id` int(11) NOT NULL, `weapon_model` varchar(45) NOT NULL, `weapon_status` varchar(45) DEFAULT NULL, `Squads_squad_id` int(11) DEFAULT NULL PRIMARY KEY (weapon_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;"
SelectSoldiers = "SELECT * FROM Soldiers;";
SelectWeapons = "SELECT * FROM Weapons;";
SelectSquad = "SELECT * FROM Squads;";
SelectBuilding = "SELECT * FROM Buildings;";
SelectVehicles = "SELECT * FROM Vehicles;";
SelectKeys = "SELECT * FROM 'Keys';";


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

let weapons = ""
let soldiers = ""
let squads = ""
let buildings = ""
let vehicles = ""
let keys = ""

/*
    ROUTES
*/
app.get('/', function(req, res)
    {   
        db.pool.query(SelectWeapons, function(err, results, fields){
            weapons = results
            db.pool.query(SelectSquad, function(err, results, fields){
                squads = results
                db.pool.query(SelectSoldiers, function(err, results, fields){
                    soldiers = results 
                    res.render('soldiers', {soldiers, weapons, squads})  
                })
            })
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
        console.log(err)
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

app.put('/squads/edit', async(req, res) => {
    let squad_edit = `UPDATE Squads SET squad_leader = '${req.body.squad.leader}', squad_name = '${req.body.squad.name}' WHERE squad_id = ${req.body.squad.id}`;
    db.pool.query(squad_edit, function(err, results, fields) {
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

app.put('/weapons/edit', (req, res) => {
    let weapons_edit = `UPDATE Weapons SET weapon_model = '${req.body.weapon.model}', weapon_status = '${req.body.weapon.status}', Squads_squad_id = ${req.body.weapon.squadid} WHERE weapon_id = ${req.body.weapon.id}`;
    db.pool.query(weapons_edit, (err, results, fields) => {
        console.log(err)
        res.redirect('/weapons')
    })
})

app.delete('/weapons/delete/:id', (req, res) => {
    let weapons_delete = `DELETE FROM Weapons WHERE weapon_id = ${req.params.id}`;
    db.pool.query(weapons_delete, (err, results, fields) => {
        console.log(err)
        res.redirect('/weapons')
    })
})

app.post('/weapons/new', (req, res) => {
    let weapon_insert = `INSERT INTO Weapons (weapon_model, weapon_status, Squads_squad_id)
    VALUES ('${req.body.weapon.model}', '${req.body.weapon.status}', '${req.body.weapon.squadid}');`
    db.pool.query(weapon_insert, (err, results, fields) => {
        console.log(err)
        res.redirect('/weapons')
    })
})

app.get('/weapons', function(req, res){
    db.pool.query(SelectSquad, function(err, results, fields){
        squads = results
        db.pool.query(SelectWeapons, function(err, results, fields) {
            weapons = results
            res.render('weapons', {squads, weapons})
        })
    })
    
});

app.put('/vehicles/edit', (req, res) => {
    let vehicle_edit = `UPDATE Vehicles SET vehicle_type = '${req.body.vehicle.type}', vehicle_capacity = ${req.body.vehicle.capacity}, vehicle_status = '${req.body.vehicle.status}', Squads_squad_id = ${req.body.vehicle.squadid}, Weapons_weapon_id = ${req.body.vehicle.weaponid} WHERE vehicle_id = ${req.body.vehicle.id};`
    db.pool.query(vehicle_edit, (err, results, fields) => {
        console.log(err)
        res.redirect('/vehicles')
    })
})

app.post('/vehicles/new', (req, res) => {
    let vehicle_insert = `INSERT INTO Vehicles (vehicle_type, vehicle_capacity, vehicle_status, Squads_squad_id, Weapons_weapon_id)
    VALUES ('${req.body.vehicle.type}', '${req.body.vehicle.capacity}', '${req.body.vehicle.status}', ${req.body.vehicle.squadid}, ${req.body.vehicle.weaponid});`
    db.pool.query(vehicle_insert, (err, results, fields) => {
        console.log(err)
        res.redirect('/vehicles')
    })
})

app.delete('/vehicles/delete/:id', (req, res) => {
    let vehicle_delete = `DELETE FROM Vehicles WHERE vehicle_id = ${req.params.id}`
    db.pool.query(vehicle_delete, (err, results, fields) => {
        console.log(err)
        res.redirect('/vehicles')
    })
})

app.get('/vehicles', function(req, res) {
    db.pool.query(SelectSquad, function(err, results, fields){
        squads = results
        db.pool.query(SelectWeapons, function(err, results, fields) {
            weapons = results
            db.pool.query(SelectVehicles, (err, results, fields) => {
                vehicles = results
                res.render('vehicles', {vehicles, squads, weapons})
            })
            
        })
    })
    
});

app.get('/keys', function(req, res) {
    db.pool.query(SelectBuilding, (err, results, fields) => {
        buildings = results
        db.pool.query(SelectVehicles, (err, results, fields) => {
            vehicles = results
            db.pool.query(SelectKeys, (err, results, fields) => {
                keys = results
                console.log(keys)
                res.render('buildings', {keys, vehicles, buildings})
            })
        })

    })
});

app.delete('/buildings/delete/:id', (req, res) => {
    let buildings_delete = `DELETE FROM Buildings WHERE building_id = ${req.params.id}`
    db.pool.query(buildings_delete, (err, results, fields) => {
        res.redirect('/buildings')
    })
});

app.post('/buildings/new', (req, res) => {
    let new_building = `INSERT INTO Buildings (building_name, building_address)
    VALUES ('${req.body.building.name}', '${req.body.building.address}');`
    db.pool.query(new_building, (err, results, fields) => {
        console.log(err)
        res.redirect('/buildings')
    })
})

app.put('/buildings/edit', (req, res) => {
    let building_edit = `UPDATE Buildings SET building_name = '${req.body.building.name}', building_address = '${req.body.building.address}' WHERE building_id = ${req.body.building.id}`;
    db.pool.query(building_edit, (err, results, fields) => {
        console.log(err)
        res.redirect('/buildings')
    })
})

app.get('/buildings', function(req, res) {
    db.pool.query(SelectBuilding, (err, results, fields) => {
        buildings = results
        res.render('buildings', {buildings})
    })
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