const express = require("express");
const app = express();
const port = 3000;

const bodyparser = require("body-parser");

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

app.listen(port, () => console.log("Listening on 3000"))

const connectionString = 'mongodb://localhost:27017/crud_es6'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then(client => {

		/* ******************** Database Connection ******************** */
		console.log("Connected to Database")
		const db = client.db("admin")
		const bookCollection = db.collection("books")

		
		app.set('view engine', 'ejs')
		app.use(bodyparser.urlencoded({extended: true}))
		app.use(bodyparser.json())
		app.use(express.static('public'))

		/* ******************** List ******************** */
		app.get('/', (req, res) => {
			const bookData = bookCollection.find().toArray().then(results => {
				res.render('list.ejs', {bookData: results})
			})
			.catch (error => console.log(error))
		})

		/* ******************** Create ******************** */
		app.get('/create', (req, res) => {
			res.render('create.ejs')
		})

		/* ******************** Insert ******************** */
		app.post('/add', (req, res) => {
			let insertData = {
				'name': req.body.name,
				'author': req.body.author,
				'description': req.body.description,
			}

			bookCollection.insertOne(insertData)
			.then(results => {
				res.redirect('/')
			})
			.catch(error => console.log(error))
		})

		/* ******************** Edit ******************** */
		app.get('/edit/:id', (req, res) => {
			var queryData = {_id: new mongodb.ObjectID(req.params.id)}

			bookCollection.find(queryData).toArray()
			.then(results => {
				res.render('edit.ejs', {bookData: results})
			})
			.catch(error => console.log(error))
		})

		/* ******************** Update ******************** */
		app.post('/update', (req, res) => {
			let queryData = {_id: new mongodb.ObjectID(req.body.id)}

			let updateData = {
				$set: {
					'name': req.body.name,
					'author': req.body.author,
					'description': req.body.description,
				}
			}

			bookCollection.updateOne(queryData, updateData)
			.then(results => {
				res.redirect('/')
			})
			.catch(error => console.log(error))
		})

		/* ******************** Delete ******************** */
		app.get('/delete/:id', (req, res) => {
			var queryData = {_id: new mongodb.ObjectID(req.params.id)}

			bookCollection.deleteOne(queryData)
			.then(results => {
				res.redirect('/');
			})
			.catch(error => console.log(error))
		})
	})