const express = require('express');
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db.json");
// !AVISO Necesitamos un /db.json ==> { "peliculas": [] }
const db = JSON.parse(fs.readFileSync(dbPath), "utf8");

function saveOnDB(data) { 
  const rawFilms = db.peliculas;
  const totalFilms = [...rawFilms, ...data];
  const dataToWrite = { peliculas: totalFilms };
  const dataString = JSON.stringify(dataToWrite);
  
  fs.writeFileSync(dbPath, dataString, "utf8");
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const cinemap = 'https://api.themoviedb.org/3/movie/popular';

router.get('/main', async function(req, res) {
  
  const films = await axios 
    .get (cinemap, {
      params : { page: '1', language: 'en-US', api_key: process.env.api_key },
        body: '{}' 
      }
    )
    .catch(e => res.status(500).send("error"));

  const dataToSave = films.data.results.map(result => ({
    ...result,
  }));


  res.render('main', { 
    title: "cinemap | Feed",
    pelis: dataToSave,
  });
  
    saveOnDB(dataToSave);
  });

  router.get("/:id", async function(req, res) {
    const param = req.params.id;  
    const films = db.peliculas;
    const film = films.find(function(data){ return data.id == param});
    console.log(film);

    res.render("detalle", { title: "cinemap | detalle", film});
  });

module.exports = router;
