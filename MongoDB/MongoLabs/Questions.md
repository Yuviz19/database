# MongoDB CLI Lab 1 — University Management System

--- GIVEN BY GPT

Open `mongosh`.

Create a database:

```js
use university
```

Your job is to design it.

---

## Phase 1 — Design

You have:

### Students

* name
* age
* email
* department

### Courses

* title
* code
* credits

### Enrollments

Students can enroll in many courses.

Courses can have many students.

---

### Question 1

Before touching the keyboard:

Would you:

A)

```js
Student
 └─ courses:[]
```

B)

```js
Course
 └─ students:[]
```

C)

Separate enrollment collection

```js
Enrollment
{
 studentId,
 courseId
}
```

Pick one.

Defend it.

Only after deciding should you type anything.

---

## Phase 2 — Create Collections

Create:

```text
students
courses
enrollments
```

using CLI.

No Compass.

---

## Phase 3 — Insert Data

Insert:

### Students

```text
Alice
Bob
Charlie
David
Emma
```

Give them:

* different ages
* different departments

---

### Courses

```text
DBMS
Operating Systems
Computer Networks
```

with course codes.

---

### Enrollments

Create enough data so:

* Alice takes 3 courses
* Bob takes 2
* Emma takes 1

---

## Phase 4 — Query Challenges

Now answer ONLY using Mongo queries.

---

### Challenge 1

Find all students older than 20.

---

### Challenge 2

Find all students NOT in CSE.

---

### Challenge 3

Find students aged:

```text
18–22
```

---

### Challenge 4

Sort students by age descending.

---

### Challenge 5

Return only:

```text
name
department
```

No `_id`.

---

### Challenge 6

Count how many students belong to ECE.

---

### Challenge 7

Add:

```js
hosteller: true
```

to every student.

One query.

---

### Challenge 8

Remove hosteller from Bob.

---

### Challenge 9

Find students where:

```text
hosteller exists
```

---

### Challenge 10

Delete all students older than 25.

---

# Phase 5 — The Interesting Part

You now receive a requirement:

> Show all students enrolled in DBMS.

Pause.

Think.

Look at your schema.

Now ask yourself:

```text
Did I choose the correct design?
```

How many queries are needed?

Would embedding have made this easier?

Would embedding create future problems?

---

# Phase 6 — Index Investigation

Create:

```js
db.students.createIndex({ email: 1 })
```

Now run:

```js
db.students.find({ email: "alice@uni.edu" })
  .explain("executionStats")
```

Questions:

1. What stage appears?
2. Do you see `COLLSCAN`?
3. Do you see `IXSCAN`?
4. Why?

---

# Bonus Pain

New requirement:

```text
Every course contains:
Assignments
Submissions
Grades
Remarks
```

Now answer:

Would you

* embed assignments in course?
* reference assignments?
* embed submissions?
* reference submissions?

And for each:

**Why?**

---

Don't touch tutorials.

Actually do this in `mongosh`.

When you're done, send me:

1. Your collection design.
2. Queries for Challenges 1–10.
3. Your reasoning for the bonus section.

That's where the real learning starts.
