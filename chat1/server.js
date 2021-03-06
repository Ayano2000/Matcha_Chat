var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var dbUrl = "mongodb+srv://Yano:80058024@cluster0-jszpy.mongodb.net/matcha_chat";

// Gets all messages so change this to be messages specifically from the chat
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

// gets messages from a specific user
app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

// sends the messages and adds them to the db
app.post('/messages', async (req, res) => {
  try{
    var message = new Message({name: "Arata", message: req.body.message});

    var savedMessage = await message.save()
      console.log('saved');
    // so we can censor messages
    var censored = await Message.findOne({message:'badword'});
      if(censored)
        await Message.remove({_id: censored.id})
      else
        io.emit('message', req.body);
      res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('Message Posted')
  }

})

io.on('connection', () =>{
  console.log('a user is connected')
})

mongoose.connect(dbUrl ,{} ,(err) => {
  console.log('mongodb connected',err);
})

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});