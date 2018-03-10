## Simple Crawler

### To Run Follow the below steps:
* clone the repo 

      git clone git@github.com:saikatharryc/scrapIt.git
* Go to the project directory and run
      
            npm install
  ***it will install all dependencies, in `node_modules` folder.***

* To Run application 

            npm start
***it will run on port 3000, incase you want to define port: `npm start --port <PORT_NO>`***

* To Start Scrapping do a **GET** call to this below api:
         
         http://localhost:3000/scrap

    ***This will insert the basic details in your database as well.***
* To update fields like `services` in database, do a **GET** call to below api:

             http://localhost:3000/update
* To Search or filter data do **GET** call to below api:
            
            http://localhost:3000/search

   ***parameter you can pass:***
   ```
   name,      ## Regex Match
   rating_gt, ## get rating Grater than
   rating_lt, ## get rating Less than
   location,  ## Regex Match
   mobile_no, ## Regex Match
   services   ## Regex Match

## ***Note:***
* Database config file:  `./config/config.js`