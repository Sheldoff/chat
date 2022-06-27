const express           = require('express')
const app               = express()
const http              = require('http').createServer(app)
const io                = require('socket.io')(http)
const express_session   = require('express-session')
const config            = require('./config.js')

const mongoose          = require('mongoose')
const messageModel      = mongoose.model('messages', require('./mongoSchemas.js').messages)
const accountModel      = mongoose.model('accounts', require('./mongoSchemas.js').accounts)

const chatUsers = []

const main = async () => {
    mongoose.connection.on('error', console.error.bind(console, 'mongoose.connect error: '))
    mongoose.connection.once('open', () => console.log('mongoose.connect established: ' + mongoose.connection._connectionString))

    mongoose.connect(config.mongoDbUrl, config.mongooseOptions, async err => {
        if (err) return console.error(err)

        app.use(express.static(__dirname + '/public'))
        app.use(express_session({
            store:              require('connect-mongo').create({mongoUrl: mongoose.connection._connectionString}),
            secret:             'frog',
            resave:             true,
            saveUninitialized:  true,
            maxAge:             600e3// seconst that session will be alive 10 min
        }))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        app.get('/',        (req, res) => res.sendFile(__dirname + '/public/login.html'))
        app.get('/signIn',  (req, res) => res.sendFile(__dirname + '/public/signIn.html'))
        app.get('/chat',    (req, res) => res.sendFile(__dirname + '/public/chat.html'))

        app.post('/api/requestLogin', async (req, res) => {
            console.log(req.body.login)
            console.log(req.body.password)

            const newAccount = {
                login:              req.body.login,       			  
                password:	        req.body.password,
                username:	        req.body.login,
                registrationDate:   Date.now(),
                avaratURL:			''
            }

            const bdResponce = await accountModel.find({
                login:      req.body.login, 
                password:   req.body.password
            })[0]

            console.log(bdResponce)
            if (!bdResponce) return res.send('Login or password is incorrect')

            // console.log(bdResponce._id)
            // req.session._id = bdResponce._id


            // console.log(newAccount)

            // const result = await accountModel.insertMany([newAccount])

            //check is account already in DB
            // console.log(result)
            // const findedAccount = (await accountModel.find({
            //     username: req.body.username,
            //     password: req.body.password
            // }))[0]

            // console.log(findedAccount)

            // if (!findedAccount) res.send('User not registered')




            // if (!req.query.username) return res.sendStatus(400)
            // if (!req.query.password) return res.sendStatus(400)
            // req.session.address = req.query.address
            // res.send(req.session.id)
        })

        app.post('/api/requestRegister', (req, res) => {
            const username = req.body.username
            
        })
        
        io.on('connection', async  chatUser => {
            chatUsers.push(chatUser)
            console.log(chatUser.id) // unique id of user
            // io.emit('newUserConnected', {userId: chatUser.id})
            //socket - instance connected with specific client
            //io - instance connected with ALL clients
            chatUser.on('chatMessage', message => {
                //save message to DB
                messageModel.insertMany({// просьбa монгуса заpashaти цей об'єкт в табличку
                    name:       message.name,
                    message:    message.message,
                    timestamp:  Date.now()
                }) // insert many documents into database table that was described by model
            })
            

            const allMessagesFromDB = await messageModel.find()
            allMessagesFromDB.map(message => io.emit('newMessage', message))
        })

        io.on('disconnect', ioDisconnectionCallback) 
        messageModel.watch().on('change', objWithChanges => objWithChanges.fullDocument && io.emit('newMessage', objWithChanges.fullDocument) )

        http.listen(3000, () => console.log('started server') )
    })
}

main()

const ioDisconnectionCallback = chatUser => {
    chatUsers.delete(chatUser)
}