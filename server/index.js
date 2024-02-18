import expressApp  from "express";
import axios from 'axios';
import mongoose from "mongoose";
import cors from "cors";
import { UserModel, userSchema } from "./modules/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'email-validator';
import dotenv from 'dotenv';

const app = expressApp();
const dbConnectionUri =  process.env.DB_CONNECTION_URI
app.use(expressApp.json());
app.use(cors());
dotenv.config();

mongoose.connect(dbConnectionUri);

// Hash the password 
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  });

// Handle the login endpoint
app.post('/login', async(req, res) => {
    const {email, password} = req.body;

    try {
        if(!email){
            return res.json({
                error:'Email is required'
            })
        };
        if(!password){
            return res.json({
                error: 'Password is required'
            })
        };

        // find a user in the database
        const user = await UserModel.findOne({ email });
            if(user){
                const passwordMatch = await bcrypt.compare(password, user.password);
                if(passwordMatch) {
                    // generate a JWT token for authentication
                    const token = jwt.sign({ userId: user._id }, 'secretKey', {
                        expiresIn: '8h',
                    });
                    res.json({ 
                        success: true, 
                        token 
                    });
                } else {
                    res.json({ 
                        success: false, 
                        message: 'Invalid username or password' 
                    });
                }
            } else {
                res.json("Invalid username or password")
            }
    } catch(err) {
        res.json({success: false, message: err.message });
    }
});

// Handle the registration endpoint
app.post('/register', async(req, res) => { 
    try{
        const { name, email, password } = req.body;

        if (!validator.validate(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            })
        }
        
        if(!name){
            return res.json({
            error: 'Name is required'
            })
        };
        if(!email){
            return res.json({
                error:'Email is required'
            })
        };
        if(!password || password.length < 6){
            return res.json({
                error: 'Password should be at least 6 characters long'
            })
        };

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;


        const existedEmail = await UserModel.findOne({email})
        if(existedEmail) {
            return res.json({
            error: 'Email is already registered'
            })
        };

        const newUser = await UserModel.create(req.body);
        res.json({ 
            success: true, 
            user: newUser 
        });

    } catch (err) {
        res.json({ 
            success: false, 
            message: err.message 
        })
    }
});

// Endpoint to fetch current weather data
app.get('/weather', async (req, res) => {
    const { lat, lon, isCelsius } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    let unit;
    if(isCelsius === 'true') {    
        unit = 'metric';
    } else {
        unit = 'imperial';
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch forecast weather data
app.get('/forecast', async (req, res) => {
    const { lat, lon, isCelsius } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
    let unit;
    if(isCelsius === 'true') {    
        unit = 'metric';
    } else {
        unit = 'imperial';
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to fetch city data
app.get('/direct', async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;
  
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${apiKey}`
      );
      res.json(response.data);

    } catch (error) {
      console.error('Error fetching forecast data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});  

// Endpoint to fetch searched news data
app.get('/search', async (req, res) => {
    const { q } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    try {
        const response = await axios.get(
        `https://content.guardianapis.com/search?q=${q}&api-key=${apiKey}&show-fields=thumbnail&page-size=5`
        );
        res.json(response.data);

    } catch (error) {
        console.error('Error fetching news data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});  


const proxyAndSend = async (url, res) => {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      res.contentType('image/png');
      res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

app.get('/proxy/temp_new/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://tile.openweathermap.org/map/temp_new/${z}/${x}/${y}.png?appid=${apiKey}`;
    proxyAndSend(url, res);
});

app.get('/proxy/precipitation_new/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://tile.openweathermap.org/map/precipitation_new/${z}/${x}/${y}.png?appid=${apiKey}`;
    proxyAndSend(url, res);
});

app.get('/proxy/wind_new/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://tile.openweathermap.org/map/wind_new/${z}/${x}/${y}.png?appid=${apiKey}`;
    proxyAndSend(url, res);
});

app.get('/proxy/pressure_new/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://tile.openweathermap.org/map/pressure_new/${z}/${x}/${y}.png?appid=${apiKey}`;
    proxyAndSend(url, res);
});

app.get('/proxy/clouds_new/:z/:x/:y', async (req, res) => {
    const { z, x, y } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://tile.openweathermap.org/map/clouds_new/${z}/${x}/${y}.png?appid=${apiKey}`;
    proxyAndSend(url, res);
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
