const express  = require('express');
const app = express();
const port = 8000;
const mysql = require('mysql');

app.use(express.json())




// ser connection database 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb_node',
})

//cheack db connection

connection.connect((err) => {
    if(err){
        console.log(`Database connection error: `, err)
    }else{
        console.log(`Database connection is connected successfully`)
    }
})

//

app.get('/', (req, res) => {

    const sql = "SELECT * FROM students"
    connection.query(sql, (err, result) => {
    if(err){
        console.log(`esql querry error `, err);
    }else{
    res.json(result)
    }
 })
})


// Find All Students
app.get('/', (req, res) => {
    res.send(students)
})

// Find one Student
app.get('/:studentId', (req, res) => {
    const { studentId } = req.params;
   const foundStudent = students.find((item) => item.id === Number(studentId))
    if(foundStudent){
        res.status(200).json({
            message: 'Found Student',
            data: foundStudent
        })
    }
})

app.delete('/:studentId', (req, res) => {
    const { studentId } = req.params;
    const foundStudent = students.find((item) => item.id === Number(studentId))
    if(!foundStudent){
      // console.log(`The stendent with this ID: ${studentId} Not Found`)
        res.status(500).json({
            message: `The stendent with this ID: ${studentId} Not Found`
        })
    }else{
        const newStudentData = students.filter((item) => item.id !== Number(studentId))
        if(newStudentData){
            res.status(200).json({
                data: newStudentData
            })            
        }

    }

})

// Create New Students 

app.post('/create', (req,res) => {
let { newStudent } = req.body
newStudent = {
    id: students.length + 1,
    ...newStudent,
}
students.push(newStudent)
res.status(200).json({
    data : students,
})
})

// Update New Students
app.put('/update/:studentId', (req,res) => {
const { studentId } = req.params;
if(studentId){
    // check student id existing
  let foundStudent = students.find((item) => item.id === Number(studentId))
   const index = students.indexOf(foundStudent)
   students[index] = {
        ...foundStudent,
        note: foundStudent.note + 1
   }
   console.log(students)
   res.json({
    updatedStudents: students,
    updatedItem: students[index]
   })
}

})


app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`)
})