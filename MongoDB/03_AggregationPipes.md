# Aggregation Pipelines

- It is a framework modeled on concept of assembly lines
- here documents enter a multi-staged pipline where at each stage a document is
  - transformed 
  - filtered
  - grouped
  - or its data is computed
- passing the refined output

- syntax =>
  db.collection_name.aggregate([{
    // stage 1
  },{
    // stage 2
  },{
    // stage 3
  }])
  - where each {}, is a stage and the next {}, takes the input of the upper output

- for the practise we have 3 collections (one example of each)
  - authors (3 docs)

```js
{
  "_id": 100,
  "name": "F. Scott Fitzgerald",
  "birth_year": 1896
}
```

  - books (3 docs)

```js
{
  "_id": 1,
  "title": "The Great Gatsby",
  "author_id": 100,
  "genre": "Classic"
}
```

  - users (1000 docs) (~350kb)
  
```js
{
  "index": NumberInt(0),
  "name": "Aurelia Gonzales",
  "isActive": false,
  "registered": ISODate("2015-02-11T04:22:39+0000"),
  "age": NumberInt(20),
  "gender": "female",
  "eyeColor": "green",
  "favoriteFruit": "banana",
  "company": {
    "title": "YURTURE",
    "email": "aureliagonzales@yurture.com",
    "phone": "+1 (940) 501-3963",
    "location": {
      "country": "USA",
      "address": "694 Hewes Street"
    }
  },
  "tags": [
    "enim",
    "id",
    "velit",
    "ad",
    "consequat"
  ]
}
```

## Some questions to practice Aggregation Pipelines

1. how many users are active? ($match and $count)

```js
[
  {
    $match: {
    	isActive: true
    }
  },
  {
    $count: 'Active Users'
  }
]
```

- $group -> combines multiple documents with the same field or expression into a single document
- syntax

{
 $group:
   {
     _id: <expression>, // Group key
     <field1>: { <accumulator1> : <expression1> },
     ...
   }
}

-- some commonly used accumulators

| Accumulator |        Purpose        |
| ----------- | --------------------- |
| `$sum`      | Count / total         |
| `$avg`      | Average               |
| `$min`      | Smallest in group     | -> maxN can be used to return max N elements
| `$max`      | Largest               | -> similarly minN can also be used
| `$push`     | Collect values        |
| `$addToSet` | Collect unique values | -> used with _id: null

- some examples
```js
{
  $group: {
    _id: "$department",
    highestSalary: { $max: "$salary" }
  }
}

{
  $group: {
    _id: "$favoriteFruit",
    countries: {
      $addToSet: "$country"
    }
  }
}

{
  $group: {
    _id: "$department",
    lastEmployee: {
      $last: "$name"
    }
  }
}
```

-- first and last are also quite usefull, but after sorting

2. What is the average age of all the users? ($group, $avg)
  - with null, it becomes a single large group

```js
[
  {
    $group: {
      _id: null, // u can group them based on any field within "..."
      averageAge:{
        $avg: "$age"
      }
    }
  }
]
```

3. List the top 5 most common fruits among all users ($group, $sort, $limit)
- we only had 3 fruits in the docs.. so findinf top 2

```js
[
  {
    $group: {
      _id: "$favoriteFruit", //group the documents based on fruits
      count: {
        $sum: 1 // for every document found, increment the sum by 1
      }         // and show it as count field
    }
  },
  {
    $sort: {
      count: -1 // now sort the document in descending order (on the count field created above) 
    }
  },
  {
    $limit: 2 // then limit the number of items shown to 2
  }
]
```

4. find the total number of males and females
```js
[
  {
    $group: {
      _id: "$gender",
      count:{
        $sum : 1
      }
    }
  }
]
```

5. Which country has the highest number of registerd users
```js
[
  {
    $group: {
      _id: "$company.location.country", // object chaining
      countryCount:{
        $sum: 1
      },
    },
  },
  {
    $sort: {
      countryCount: -1
    }
  },
  {
    $limit: 1
  }
]
```

6. List all the unique eye colors in the the collection
```js
[
  {
    $group: {
      _id: "$eyeColor",
      uniqueEyeColor:{
        $addToSet: "$eycColor"
      }
    }
  }
]
```

7. What is the average number of tags per user
- approach 1
- use $unwind -> what this does is that it makes more documents, with everything similar
- but just with different array elements
```js
[
  {
    $unwind: {
      path: "$tags",
    }
  },
  {
    $group: {
      _id: "$index",
      tagCount:{ $sum: 1 },
    }
  },
  {
    $group: {
      _id: null,
      avgTagCount:{
        $avg: "$tagCount"
      }
    }
  }
]

---- method 2 ----
[
   {
     $addFields: {
       numberOfTags: {
         $size: {$ifNull:["$tags",[]]}
       }
     }
   },
   {
    $group: {
      _id: null,
      avgNumberOfTage:{
        $avg:"$numberOfTags"
      }
    }
  }
]
```

8. How many users have 'enim' as one of their tags
```js
[
  {
    $match: {
      tags: "enim"
    }
  },
  {
    $count: "enimContainers"
  }
]
```

9. What are the names and age of users, who are inactive and have 'velit' as a tag
```js
[
  {
    $match: {
      tags: "velit",
      isActive: false
    }
  },
  {
		$project: {
		  _id:0,
      name: 1,
      age:1
		}
  }
]
```

10. How many docs have phone number starting with '+1 (940)'
```js
[
  {
    $match: {
      "company.phone": /^\+1 \(940\)/
    }
  },
  {
    $count: 'string'
  }
]
```

11. Who has registered most recently
```js
[
  {
    $sort: {
      registered: -1
    }
  },
  {
    $limit: 1
  },
  {
    $project: {
      _id:0,
      name:1,
      registered:1,
      favoriteFruit:1
    }
  }
]
```

12. Categorize user by their favorite fruit
```js
[
  {
    $group: {
      _id: "$favoriteFruit",
      users: {
        $push:"$name"
      }
    }
  }
]
```

13. How many users have 'ad', as their second tag in their tag list
