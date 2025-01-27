

const {Pool,Client}= require('pg');

const connectionString='postgressql://postgres:password@localhost:5432/database'


const client= new Client({
    connectionString:connectionString
})
client.connect()
client.query('Select * from public."database1"', (err,res)=> {
            console.log(err,res);
            client.end() 
            //alert("Data Saved");
        })
