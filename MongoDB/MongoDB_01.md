# Embedding vs Referencing

- it is the way to store data physically into a database
- example -> let we have an idea for 3 separate entities
  1. User
  2. Project
  3. Tasks
  - A user can have many projects.
  - A project can have many tasks.

> Now question to ask:
> -> Where should the task data physically live?

- there are 2 possibilities

## Embedding

- Store the tasks inside the project document

```json
{
  "_id": "project1",
  "name": "Project Camp",

  "tasks": [
    {
      "title": "Build API",
      "status": "done"
    },
    {
      "title": "Setup Auth",
      "status": "pending"
    }
  ]
}
```

- everything is inside one document
- MongoDB likes this, because it can fetch all data in a single query
  - no joins, no extra lookup

## Referencing

- store tasks separately
- projects keep the tasks Ids only

- for Project -

```json
{
  "_id": "project1",
  "name": "Project Camp",
  "tasks": ["task1", "task2"]
}
```

- for Tasks -

```json
{
  "_id": "task1",
  "title": "Build API",
  "status": "done"
}

{
  "_id": "task2",
  "title": "Setup Auth",
  "status": "pending"
}
```

- that's the core question -> when to keep data together or separate.

### When to Embed?

When the child data:

1. Belongs to only one parent
   example- a task comment only belongs to a single task

2. Is usually read together
   example- for a blog, u need a title, content and author name

3. Doesn't grow forever
   example- When comments are not a lot, if they are huge in number, use a separate collection

```json
{
  "title": "Popular Post",
  "comments": [
    ...
  ]
}
```

> [!NOTE]
> A MongoDB document has a max size of 16 mebibytes

### When to Reference

Use Referencing when

1. Data is shared
   example- Users and Projects
   - u can use a separate collection to store the users that belong to a certain project

2. Data grows a lot
   example- Tasks may become humongous (tens of thousands of documents)

3. Child data needs its own life cycle

### Mongoose Referencing

```js
const taskSchema = new Schema({
  title: String,

  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
});
```
