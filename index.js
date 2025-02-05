const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 8000;

// Middleware to parse JSON
app.use(express.json());

// Database Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb_node',
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connection established successfully');
    }
});

app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

app.get('/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    const sql = 'SELECT * FROM students WHERE id = ?';
    
    connection.query(sql, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(results[0]);
    });
});

app.post('/students', (req, res) => {
    const { name, note } = req.body;
    
    if (!name || !note) {
        return res.status(400).json({ message: 'Name and Note are required' });
    }

    const sql = 'INSERT INTO students (name, note) VALUES (?, ?)';
    connection.query(sql, [name, note], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert error' });
        }
        res.status(201).json({ message: 'New student added', id: result.insertId });
    });
});

app.put('/students/:studentId', (req, res) => {
    const { studentId } = req.params;
    const { name, note } = req.body;

    const sql = 'UPDATE students SET name = ?, note = ? WHERE id = ?';
    connection.query(sql, [name, note, studentId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database update error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student updated successfully' });
    });
});

app.delete('/students/:studentId', (req, res) => {
    const { studentId } = req.params;

    const sql = 'DELETE FROM students WHERE id = ?';
    connection.query(sql, [studentId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});
