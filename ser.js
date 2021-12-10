const axios = require("axios");
const cheerio = require("cheerio");
const express = require('express');
const bodyParser= require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:true}));

// URL of the page we want to scrape


// Async function which scrapes the data
const db = new Map();
async function scrapeData(N) {
  try {
    const url = "https://www.imdb.com/search/title/?groups=top_1000&sort=user_rating&count="+N;
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $(".lister-item-content");
    // Stores data for all countries
    console.log("h1");
    listItems.each((idx, el) => {
      var movie = $(el).find("h3 a").text();
      
      console.log(movie);
      
      const listItems1 = $(el).find('p a');
      listItems1.each((idx, el1) => {
            var actor=$(el1).text();
            console.log(actor);

            if(db.has(actor))
            {
                db.get(actor).push(movie);
            }
            else{
                db.set(actor,[movie]);
            }

      });
      console.log(db);
     /* var hits=db.get(person);
      for(let i=0;i<M;i++)
      {
          console.log(hits[i]);
      }
      */
    });
    // Logs countries array to the console
    
  } catch (err) {
    console.error(err);
  }
}
// Invoke the above function
//scrapeData(4,"Suriya",2);
app.post("/fetch", async (req,res)=>{
  var n=req.body.n;
  await scrapeData(n);  
  res.redirect("localhost:3000/find");
});
app.post("/find", (req,res)=>{
    var person = req.body.person;
    var M= req.body.m;
    var hits=db.get(person);
    var result=[];
      for(let i=0;i<M;i++)
      {
          result.push(hits[i]);
      }
      res.send(result);

});
app.listen(3000, ()=>{
  console.log("im on");
})