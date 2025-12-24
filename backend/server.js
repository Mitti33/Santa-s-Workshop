//Bring Express to the kitchen
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require('path');
const cors = require('cors');
const db = require('./db');
const cron = require('node-cron');
const {sendGiftEmail} = require('./mailer');
const {sendConfirmationEmail} = require('./mailer');
const {generateSantaLetter} = require('./gemini');
const { generateHFImage } = require('./huggingface');
const { generateTurboImage } = require('./huggingface');
const {isSafeWish} = require('./moderation');

//Turn on the oven
const app = express();

//Enable CORS for frontend requests
app.use(cors());

//Allow server to understand JSON data
app.use(express.json());

//Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

//Define routes

//Getting something on server from backend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

//Posting something from server to backend
app.post('/api/letters', async (req, res) => {

    //Set cutoff - Is it time over for submissions?
    const cutoff = new Date('2025-12-24T22:59:00+05:30'); 
    const now = new Date(); 
    if (now > cutoff) { 
        return res.status(403).json({ ok: false, msg: "Submissions closed 🎄. Santa's busy packing gifts!" }); 
    }

    const { name, email, wish, message } = req.body;

    if(!name || !email || !wish)
        return res.status(400).json({ok: false, error: 'Missing required fields'});

    const created_at = new Date().toISOString();

    if (!(isSafeWish(wish))) { 
        return res.status(400).json({ 
            ok: false, 
            error: "Santa can only accept kind and safe wishes 🎄" 
        }); 
    }

    

    //Insert into database
    const gift_token = Math.random().toString(36).substring(2, 10);

    db.run(
        `INSERT INTO letters (name, email, wish, message, created_at, gift_token) VALUES(?, ?, ?, ?, ?, ?)`,
        [name, email, wish, message || '', created_at, gift_token],
        function(err){
            if(err){
                console.error('DB Error: ', err);
                return res.status(500).json({ok: false, error: 'Database error'});
            }
            res.json({ ok: true/*, msg: 'Letter saved!'*/, id: this.lastID, token: gift_token});
        }
    );
    console.log('Letter received: ', name, email, wish, message);
});

// Show all saved letters
app.get('/api/all-letters', (req, res) => {
  db.all(`SELECT * FROM letters`, [], (err, rows) => {
    if (err) {
      console.error('DB read error:', err);
      return res.status(500).json({ ok: false, error: 'Database error' });
    }
    res.json(rows); // send all rows back as JSON
  });
});

//Send email
app.post('/api/send-email', async (req, res) => {
    const { email } = req.body;
    db.get(`SELECT * FROM letters WHERE email = ?`, [email], async (err, row) => {
        if (err || !row) {
            return res.status(404).json({ ok: false, error: 'Letter not found' });
        }
        try {
            await sendConfirmationEmail({ to: row.email, name: row.name, wish: row.wish });
            res.json({ ok: true, msg: 'Email sent!' });
        } catch (err) {
            console.error('Email error:', err);
            res.status(500).json({ ok: false, error: 'Failed to send email' });
        }
    });
});


//Gift route
app.get('/gift/:token', async (req, res) => {
    const token = req.params.token;
    db.get(`SELECT * FROM letters WHERE gift_token = ?`, [token], async (err, row) => {
        if(err || !row)
            return res.status(404).send('Gift not found 🎁');
        try{
            const santaLetter = await generateSantaLetter(row.name, row.wish);
            const imageUrl = await generateTurboImage(row.wish);
            res.send(` 
                <html>
                <body style="text-align:center; background:#f0f8ff;">
                <h1>🎄 Merry Christmas, ${row.name}!</h1>
                <p>Santa read your wish: <b>${row.wish}</b></p>
                <p>Your message: ${row.message}</p>
                <p>✨ Enjoy your magical gift ✨</p>
                <img src="${imageUrl}" alt="Gift" style="max-width:500px;" />
                <br>
                <div style="
                    display:block;
                    margin: auto;
                    text-align:left;
                    border:1px solid #ccc;
                    padding:16px;
                    margin-top:20px;
                    max-width:600px;
                    background:#fff;
                    border-radius:8px;
                    ">
                    ${santaLetter.replace(/\n/g, "<br>")}
                </div>
                <p style="text-align: center; color: pink">Made with love by Mitti.</p>
                </body>
                </html>
            `);
        } catch(error){
            console.error("AI error: ", error);
            res.send("<h1>🎁 Santa is still painting your gift, please try again later!</h1>");
        }
        
    });
});

// Schedule: 7 AM IST on Dec 25 
cron.schedule('0 7 25 12 *', () => {
    db.all(`SELECT * FROM letters`, [], async (err, rows) => {
        if (err) 
            return console.error(err); 
        for (const row of rows) { 
            const giftUrl = `http://localhost:3000/gift/${row.gift_token}`; 
            try { 
                await sendGiftEmail({ 
                    to: row.email, 
                    name: row.name, 
                    wish: row.wish, 
                    giftUrl 
                }); 
                console.log(`Sent gift email to ${row.email}`); 
            } catch (err) { 
                console.error(`Failed to send email to ${row.email}:`, err); 
            } 
        } 
    }); 
}, { timezone: "Asia/Kolkata" });

//Listen to my port!
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});