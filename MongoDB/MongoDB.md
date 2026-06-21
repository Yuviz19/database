# MongoDB

- Install Mongo from the official documentation
- start the server and run 'mongosh'

- this will open on a 'test' database

- 'show dbs' -> list all the databases
  - admin
  - config
  - local -> are all the pre-existing databases (don't remove them)

- 'use db_name' -> to switch to a database
  - if db_name doesn't exists in the list, shell creates one
  - this still doesn't lists it in until anything is written in it

## MongoDB Terminology

| SQL      | MongoDB    |
| -------- | ---------- |
| Database | Database   |
| Table    | Collection |
| Row      | Document   |
| Column   | Field      |

- 'db.createCollection("collection_name")' -> create a new collection in a database
  - other options
    - db.createCollection("collection_name", {capped: true, size: 1048576, max: 100},{autoIndexId: true})
    - capped -> set a cap limit
    - size -> size of cap (in bytes)(10Mib here)
    - max -> max number of documents
    - autoIndexId -> true or false
  - 'show collections' -> show all the collections inside a database

- while creating a collection, we can also add some validations
  - so that inconsistent data is not being inserted

```js
db.createCollection("books", {
  validotor: {
    $jsonSchema: {
      required: ["name", "price"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and required",
        },
        price: {
          bsonType: "number",
          description: "must be a number and required",
        },
      },
    },
  },
  validationAction: "warn", // by default error
  // warned data still gets inserted
  // error data does not
});
```

- to edit a validator

```js
db.runCommand({
  collMod: "books", // collection modifier
  validotor: {
    $jsonSchema: {
      required: ["name", "price", "authors"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and required",
        },
        price: {
          bsonType: "number",
          description: "must be a number and required",
        },
        authors: {
          bsonType: "array",
          description: "must be an array and required",
          items: {
            bsonType: "object", // a json file itself
            required: ["name", "email"],
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and required",
              },
              email: {
                bsonType: "string",
              },
            },
          },
        },
      },
    },
  },
  validationAction: "warn",
});
```

- 'db.dropDatabase()' -> drop the current database (the one inside you are)
- 'show collections' -> get all the collections in a database
- 'db.collection_name.drop()' -> delete a collection

- 'db.collection_name.insertOne()' -> used to insert a document inside a collection
  - if collection_name doesn't exists, one is created
  - insertOne is used to insert one document

```shell
db.students.insertOne({
name:"Spongebob",
age: 30,
gpa: 3.7
})
```

- 'db.collection_name.find()' -> lists all the documents in a collection (in json format)

- 'db.collection_name.insertMany([{},{},{}....])' -> insert as many docs as u want (with [], brackets)
  - all documents doesn't need to be consistent, and can have as many fields as u want.
  - insertMany also takes some options as arguments
    1. ordered (true by default)
    - if we insert some docs, and any one in between fails
    - the rest also do not get inserted
    - use {ordered: false}, to remove this fallacy
    1. write concern (can be used by insertOne too)

## MongoDB Data Types

- while inserting data into documents, the several data types are incorporated
  1. String - within "" or '' (can contain spaces and special characters)
  2. Integer - a whole number (no decimal numbers)
  3. Double - contain decimals
  4. Boolean - either true or false
  5. Date - to use date as a data type use 'new Date()' -> gives current date and time, otherwise pass one within "..."
  6. Null - generally used to create a placeholder
  7. Array - a field with more than one value
  8. Nested Documents - json data in a field enclosed within {}, this can have multiple docs with []
  - aka 'object'

## Sorting and Limiting

### Sorting

- 'db.collection_name.find()' -> used to list all the documents in a collection
- 'db.collection_name.find().sort({field_name:1})' -> used to list all the documents within sorted order
  - '-1' for descending order

- the documents are sorted with ObjectId by default

### Limiting

- this is used to limit the number of documents, that are returned to us
- 'db.collection_name.find().limit(2)' -> returns 2 documents

## Find Method

- very much similar to WHERE clause in SQL
- '.find()' -> returns all the documents

- to get specific docs, we add arguments
- 'db.collection_name.find({query},{projection})'
- example -
  - db.students.find({name:"Spongebob"}) -> returns the document of Spongebob
    - u can use more than one filter for query (, separated)

-- projection is similar to SELECT clause in SQL

- with the projection parameter - we can decide what fields do we want to return
- example -
  - db.students.find({},{\_id: false, name: true, gpa: true}) -> if query is empty, all documents will be returned
  - by default \_id is set true


### Counting

- after the find command, if u want to count the number of results shown are
- ...find(...).count()

## Update

- 'db.collection_name.updateOne(filter, update)'

-- filter -> to apply that updation to
-- update -> tells what updation to do

- example -
  - db.collection_name.updateOne({name: "Spongebob"},{$set: {fullTime: true}})
    - if this field exists -> update
    - if not -> create a new field
  - in a collection it is possible for multiple docs to have same name, hence try to change stuff with ObjectId
- to remove a field, use the $unset operator as $unset: {fullTime: ""}

-- updateMany - used to update many documents at once

- 'db.students.updateMany({fullTime:{$exists: false}}, {$set:{fullTime: true}})'
  - if some field doesn't exists, then update it, so that it does

### $type

- similar to $exists
- $type is used to check the type of a particular field

## Delete

- In the Compass it is fairly easy, as u only have to press the trash can icon
- for the shell,
  - 'db.collection_name.deleteOne() or db.collection_name.deleteMany()'
  - it takes one parameter, {} -> the filter parameter
- example -> db.students.deleteOne({name:"Larry"})
  db.students.deleteMany({registrationDate:{$exists: false}})

## Comparison Operator

- db.collection_name.find({name: {$ne:"Spongebob"}}) -> returns everything except Spongebob
- db.collection_name.find({age: {$lt: 20}}) -> returns docs with age less than 20
  - u can also use less than equal to (lte)
- similar operators are $gt, $gte
- for getting a range db.collection_name.find({gpa:{$gte: 3, $lte: 4}})

- in operator
  - db.collection_name.find({name:{$in:["Spongebob", "Patrick", "Squidward"]}})
  - use an array, to get the names that lies within that array
  - u can also use 'not in' -> "nin" at the place of in

## Logical Operators

- return data based on expression's true or false value
  1. $and -> join query clauses and returns documents that match both conditions
  2. $or -> returns docs that match any one condition
  3. $not -> returns docs that match none of the conditions
  4. $nor

- for these to work, wrap all the conditions in []

- examples

1. AND -> fulltime && age lte 22
   db.collection_name.find({$and:[{fullTime: true},{age:{$lte: 22}}]})

2. OR -> 'same condition' at least one is true
   db.collection_name.find({$or:[{fullTime: true},{age:{$lte: 22}}]})

3. NOR -> 'same conditions' where both the conditions are false
   db.collection_name.find({$nor:[{fullTime: true},{age:{$lte: 22}}]})

4. NOT -> find students that are not above 30 (in age)
   db.collection_name.find({age:{$not:{$gte:30}})

### Counting

- after the 
### Counting

- after the 
### Counting

- after the 
   this query also provides null values

## Indexes

- Indexes offer efficient execution of queries in MongoDB.
  - without it MongoDB must perform a collection scan (scan every doc)
  - select the doc that matches the conditions

- however it takes more memory and slows the insertion, update and delete operations

- example
  - let - u search for a name among the docs
  - db.collection_name.find({name: "Larry"})
  - what this does it does a linear search of the documents (this would take time for large amounts of data)

- indexes are special data structures that store a tiny fraction of our collections in orderd format
- this is done to make the data more searchable (not manual searching)

### Under the hood

- they implement a B-tree
- example
- When you tell MongoDB to index a field (like email), it extracts the email from every document, sorts them, and arranges them into a B-Tree (Balanced Tree) data structure.

- the B-Tree has the value and a pointer (exact location of data)

### Common Type of Indexes

- default '\_id' - created by MongoDB
- single field index - for one specific field
  - 1 and -1 show descending and ascending orders
  - db.collection_name.createIndex({email:1})
- compound field indexes - multiple fields make the index value
  - db.users.createIndex({ lastname: 1, firstname: 1 })
- multikey index - if a field has an array, and that is converted to an index
  - a multikey index is created
    > tags: ['tech', 'news']
    > db.articles.createIndex({ tags: 1 })

#### The Index Tax

- every time u make an insert, update or delete operation, MongoDB
  1. updates the database
  2. rearrange the b-tree for every single index

- for too few indexes -> slow read queries (system bottleneck)
- for too many indexes -> slow write queries and high RAM/disk usage

- to check if a query used an index
  db.users.find({ email: "<test@example.com>" }).explain("executionStats")

- to get all the indexes of a collection
  - db.collection_name.getIndexes()
- to drop an index
  - db.collection_name.dropIndex("index_name")

#RECOMMENDATION
> use indexes, if a lot of searching is being done rather than CRUD
