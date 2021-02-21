const express = require('express')
const server = express()

// pegar o banco de dados
const db = require('./database/db')

server.use(express.static("public")) //  localhost:3000/styles/main.css

// habilitar o uso do req.body
server.use(express.urlencoded({extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", function(req, res){
    return res.render("index.html", {title: "um título"})
})

server.get("/create-point", function(req, res){
    return res.render("create-point.html")
})

server.post("/savepoint", function(req, res){
    const rb = req.body

    // inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        rb.image,
        rb.name,
        rb.address,
        rb.address2,
        rb.state,
        rb.city,
        rb.items
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)  
})

server.get("/search", function(req, res){
    const search = req.query.search

    if(search == ""){
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    // consultar os dados na tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length
        
        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows , total: total})
    })
})

server.listen(3000)