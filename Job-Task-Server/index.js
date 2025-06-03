const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'], // Adjust for production if needed
    credentials: true,
}));

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb52s.mongodb.net/mern-auth?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('MongoDB connected successfully!');

        const db = client.db('mern-auth');
        const usersCollection = db.collection('users');
        const shopsCollection = db.collection('shops');

        // Signup Route
        app.post('/auth/signup', async (req, res) => {
            const { username, password, shops } = req.body;
            if (
                !username ||
                !password ||
                !shops ||
                shops.length < 3 ||
                shops.length > 5 
            ) {
                return res.status(400).json({
                    message: "Invalid input data. Provide 3–5 shop names.",
                });
            }
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    message: "Password must be 8+ characters with a number and special character",
                });
            }
            try {
                const existingUser = await usersCollection.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ message: "Username already exists" });
                }

                for (const name of shops) {
                    const existingShop = await shopsCollection.findOne({ name });
                    if (existingShop) {
                        return res.status(400).json({ message: `Shop name ${name} already exists` });
                    }
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                await shopsCollection.insertMany(shops.map((name) => ({ name })));
                await usersCollection.insertOne({
                    username,
                    password: hashedPassword,
                    shops,
                });

                res.status(201).json({ message: "User created successfully" });
            } catch (error) {
                console.error('Signup error:', error);
                res.status(500).json({ message: "Server error while creating user" });
            }
        });

        // Signin Route
        app.post('/auth/signin', async (req, res) => {
            const { username, password, rememberMe } = req.body;

            try {
                const user = await usersCollection.findOne({ username });
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Incorrect password' });
                }

                const expiresIn = rememberMe ? '7d' : '30m';
                const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn });
                res.json({
                    message: 'Login successful',
                    token,
                    shopNames: user.shops,
                });
            } catch (error) {
                console.error('Signin error:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });

        // Validate Token Route
        app.get('/auth/profile', async (req, res) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY); 
                const user = await usersCollection.findOne({ username: decoded.username });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json({
                    username: user.username,
                    shopNames: user.shops,
                });
            } catch (error) {
                console.error('Profile error:', error);
                res.status(401).json({ message: 'Invalid token' });
            }
        });

        // Logout Route
        app.post('/auth/logout', (req, res) => {
            res.json({ message: 'Logged out successfully', success: true });
        });

        // Health Check
        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

run().catch(console.dir);

// Clean up MongoDB connection on process termination
// process.on('SIGINT', async () => {
//     await client.close();
//     console.log('MongoDB connection closed');
//     process.exit(0);
// });

app.get('/', (req, res) => {
    res.send('Hello from MERN Auth Server...');
});

app.listen(port, () => console.log(`Server running on port ${port}`));