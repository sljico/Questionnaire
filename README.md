To set up the database, in the config/databse.js file replace 

	"development": {
	    'host': 'localhost',
        'user': 'root',
        'password': ''
	}

with the credentials of your MySQL account and the name of your local database. 
Next install all of Node dependencies with npm and start the web server
`npm install`,

Create a new MySQL database `node scripts/create_database.js`,
Add admin into database using query from `query.txt`

`npm start`


Now the app will be accessible from a web browser at [http://localhost:3000/]()