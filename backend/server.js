const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ChatMessage = require('./models/ChatMessage');

const app =  express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = 'mongodb+srv://mongo:mongo@chat-app-mern.ijejiwd.mongodb.net/?retryWrites=true&w=majority&appName=CHAT-APP-MERN' ;

// Middleware
app.use(cors());
app.use(express.json());


//Routes
app.get('/', (req, res) => {
    res.send('Backend side get...');
});

// Get all notes
app.get('/messages', async(req, res) => {
    try{
        const messages = await ChatMessage.find();
        res.json(messages);
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});

// Create the new notes
app.post('/messages', async(req, res) => {
    const {user, message} = req.body;

    const messages = new ChatMessage({user, message});

    try{
        const newMessage = await messages.save();
        res.status(200).json(newMessage);
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
});

// Update the note
app.put('/messages/:id', async(req, res) => {
    const {user, message} = req.body;
    const messageId = req.params.id;

    try{
        const updateMessage = await ChatMessage.findByIdAndUpdate(
            messageId,
            {user, message},
            {new: true}
        );
        res.json(updateMessage);
    }catch(error){
        res.status(500).json({message : error.message});
    }
});

// Delete the note
app.delete('/messages/:id', async(req, res) => {
    try{
        await ChatMessage.findByIdAndDelete(req.params.id);
        res.json({message: 'ChatMessage deleted successfully'});
    }catch(error){
        res.status(500).json({message : 'ChatMessage not found'});
    }
});

// MongoDB connection
mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log("Mongo Connected successfully...");
        app.listen(PORT, (console.log(`Server is running on http://localhost:${PORT}`)));
    })
    .catch((error) => {
        console.log(error.message);
    });


