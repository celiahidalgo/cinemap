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



const baseUrl = 'https://api.themoviedb.org/3/';
const options = {
  params: {
      api_key: process.env.api_key,
  }
};



router.get('/main', async function(req, res){
  const films = await axios
  .get(`${baseUrl}discover/movie`, options)
  .catch(e => res.status(500).send("error"));
  res.render('main', { 
    title: "cinemap | Feed",
    pelis: films.data.results,
  });
  
    saveOnDB(films.data.results);
  });

  router.get('/series', async function(req, res){
    const series = await axios
    .get(`${baseUrl}discover/tv`, options)
    .catch(e => res.status(500).send("error"));
    res.render('series', { 
      title: "cinemap | Feed",
      pelis: series.data.results,
    });
    
      saveOnDB(series.data.results);
    });
  
    router.get('/results', async function(req, res){
    if (req.query.search) {
      options.params.query = req.query.search;
      const films = await axios
      .get(`${baseUrl}search/movie`, options)
      .catch(e => res.status(500).send("error"));
      res.render('results', { 
        title: "cinemap | Results",
        pelis: films.data.results,
      });
    }});


  router.get("/film/:id", async function(req, res) {
    const param = req.params.id;  
    const films = db.peliculas;
    const film = films.find(function(data){ return data.id == param});

    res.render("detalle", { title: "cinemap | detalle", film});
  });



// router.get('/main', async function(req, res) {

//   const films = await axios 
//     .get (cinemap, {
//       params : { 
//         page: '1', 
//         language: 'en-US',
//         api_key: process.env.api_key },
//         body: '{}' 
//       }
//     )
//     .catch(e => res.status(500).send("error"));

//   res.render('main', { 
//     title: "cinemap | Feed",
//     pelis: films.data.results,
//   });
  
//     saveOnDB(films.data.results);
//   });



  // router.get('/results', async function(req, res) {
  //   const filterSearch =
  //     req.query.search && req.query.search !== "null"
  //       ? req.query.search
  //       : undefined;
  //   const filmsS = await axios 
  //     .get (searchCinemap, {
  //       params : { 
  //         page: '1', 
  //         language: 'en-US',
  //         query: filterSearch, 
  //         api_key: process.env.api_key },
  //       }
  //     )
  //     .catch(e => res.status(500).send("error"));
  
  //   res.render('results', { 
  //     title: "cinemap | Results",
  //     pelis: filmsS.data,
  //   });
    

  //   });
  


module.exports = router;
