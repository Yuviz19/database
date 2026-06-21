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
db.students.insertMany
