const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.use(express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        io.emit('chat message', {
            message: data.message,
            name: data.name
        })
    })
})


http.listen(3000, () => {
    console.log('started server')
})

// 0 создать github (как работает vscode and github)
// 1 устaновить Mongodb
// 2 создать базу данных
// 3 создать таблицу messages
// 4 on submit => save in to ''messages''
// 5 после авторизации скачать с баз даннх все сообщения и отобразить их (io.emit)
// 6 улучшить интерфейс