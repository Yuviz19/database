// creating collections and adding validations

db.createCollection("students", {
  validator: {
    $jsonSchema: {
      required: ["name", "age", "email", "department"],
      properties: {
        name: {
          bsonType: "string",
          description: "name is required and should be a string"
        },
        age: {
          bsonType: "int",
          description: "age is required and should be a number"
        },
        email: {
          bsonType: "string",
          description: "email is required and should be a string"
        },
        department: {
          bsonType: "string",
          enum: ["CSE","ECE","ME","CE"],
          description: "department is required and should be a string"
        }
      }
    }
  },
  validationAction: "error"
})

db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      required: ["title", "code", "credits"],
      properties: {
        title: {
          bsonType: "string",
          description: "title is required and should be a string"
        },
        code: {
          bsonType: "string",
          description:"code is required and should be a string"
        },
        credits: {
          bsonType: "int",
          minimum: 0,
          maximum: 160,
          description: "credits are required, must be an integer and b/w 0 and 160"
        }
      }
    }
  },
  validationAction: "error"
})

db.createCollection("enrollment", {
  validator: {
    $jsonSchema: {
      required: ["studentId", "courseId", "semester"],
      properties: {
        studentId: {
          bsonType: "objectId",
          description: "needs an objectId (student reference)"
        },
        courseId: {
          bsonType: "objectId",
          description: "needs an objectId (course reference)"
        },
        semester: {
          bsonType: "int",
          minimum: 1,
          maximum: 8,
          description: "required integer field between 1 and 8"
        }
      }
    }
  },
  validationAction: "error"
})

// to make each unique
db.students.createIndex(
  { "email": 1 },
  { unique: true }
)

db.courses.createIndex(
  { "code": 1 },
  { unique: true }
)

// inserting documents
// students
db.students.insertMany([
  {
    name: "Alice",
    age: 20,
    email: "alice@uni.edu",
    department: "CSE"
  },
  {
    name: "Bob",
    age: 22,
    email: "bob@uni.edu",
    department: "ECE"
  },
  {
    name: "Charlie",
    age: 19,
    email: "charlie@uni.edu",
    department: "CSE"
  },
  {
    name: "David",
    age: 24,
    email: "david@uni.edu",
    department: "ME"
  },
  {
    name: "Emma",
    age: 21,
    email: "emma@uni.edu",
    department: "CE"
  }
])

// courses
db.courses.insertMany([
  {
    title: "Database Management Systems",
    code: "CS301",
    credits: 4
  },
  {
    title: "Operating Systems",
    code: "CS302",
    credits: 4
  },
  {
    title: "Computer Networks",
    code: "CS303",
    credits: 3
  },
  {
    title: "Data Structures and Algorithms",
    code: "CS201",
    credits: 5
  }
])

// Student and Course after Insertions
[
  { _id: ObjectId('6a38be2cc58cbd5d567394d5'), name: 'Alice' },
  { _id: ObjectId('6a38be2cc58cbd5d567394d6'), name: 'Bob' },
  { _id: ObjectId('6a38be2cc58cbd5d567394d7'), name: 'Charlie' },
  { _id: ObjectId('6a38be2cc58cbd5d567394d8'), name: 'David' },
  { _id: ObjectId('6a38be2cc58cbd5d567394d9'), name: 'Emma' }
]
[
  {
    _id: ObjectId('6a38be74c58cbd5d567394da'),
    title: 'Database Management Systems',
    code: 'CS301'
  },
  {
    _id: ObjectId('6a38be74c58cbd5d567394db'),
    title: 'Operating Systems',
    code: 'CS302'
  },
  {
    _id: ObjectId('6a38be74c58cbd5d567394dc'),
    title: 'Computer Networks',
    code: 'CS303'
  },
  {
    _id: ObjectId('6a38be74c58cbd5d567394dd'),
    title: 'Data Structures and Algorithms',
    code: 'CS201'
  }
]

// inserting enrollment
db.enrollment.insertMany([
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d5"),
    courseId: ObjectId("6a38be74c58cbd5d567394da"),
    semester: 3
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d5"),
    courseId: ObjectId("6a38be74c58cbd5d567394db"),
    semester: 3
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d5"),
    courseId: ObjectId("6a38be74c58cbd5d567394dc"),
    semester: 3
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d6"),
    courseId: ObjectId("6a38be74c58cbd5d567394da"),
    semester: 5
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d6"),
    courseId: ObjectId("6a38be74c58cbd5d567394dd"),
    semester: 5
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d7"),
    courseId: ObjectId("6a38be74c58cbd5d567394dd"),
    semester: 2
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d8"),
    courseId: ObjectId("6a38be74c58cbd5d567394db"),
    semester: 6
  },
  {
    studentId: ObjectId("6a38be2cc58cbd5d567394d9"),
    courseId: ObjectId("6a38be74c58cbd5d567394dc"),
    semester: 4
  }
])

// Challanges
// 1. Find all students older than 20.
db.students.find({ age: { $gt: 20 } })

// 2. Find all students NOT in CSE.
db.students.find({ department: { $ne: "CSE" } })

// 3. students aged b/w 18 and 22 (i'm including 18 and 22, else gt and lt gets used)
db.students.find({ age: { $gte: 18, $lte: 22 } })

// 4. sort students by age (descending order)
db.students.find().sort({ age: -1 })

// 5. for students, return name and department
db.students.find({}, { _id: false, name: true, department: true })

// 6. find how many students belong to "ECE" department
db.students.find({ department: "ECE" }).count()

// 7. add hosteller to each student document
db.students.updateMany({}, { $set: { hosteller: true } })

// 8. remove hosteller from "Bob"
db.students.updateOne({ name: "Bob" }, { $unset: { hosteller: "" } })

// 9. find students where field hosteller exists
db.students.find({ hosteller: { $exists: true } })

// 10. delete all students older than 25
db.students.deleteMany({ age: { $gte: 25 } })
