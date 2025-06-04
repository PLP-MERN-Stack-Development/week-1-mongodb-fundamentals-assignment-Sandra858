// ### Task 1: MongoDB Setup
    // Database creation
    use plp_bookstore
    // collection creation
    db.books.insertOne({
        "title": 'To Kill a Mockingbird',
        "author": 'Harper Lee',
        "genre": 'Fiction',
        "published_year": 1960,
        "price": 12.99,
        "in_stock": true,
        "pages": 336,
        "publisher": 'J. B. Lippincott & Co.'
    })

    // - Find all books in a specific genre
        db.books.find({genre: "Fiction"})

    // - Find books published after a certain year
        db.books.find({published_year: { $gt: 1970 } })

    // - Find books by a specific author
        db.books.find({author:"Paulo Coelho" })

    // - Update the price of a specific book
        db.books.updateOne(
            { title: "The Alchemist" },
            { $set: { price: 1200 } }
        )

    // - Delete a book by its title
        db.books.deleteOne({ title: "Things Fall Apart" })


// ### Task 2: Basic CRUD Operations
// - Write a query to find books
//       that are both in stock and published after 2010
        db.books.find({
            instock: true,
            published_year: {$gt:1970}
        })


// - Use projection to return
// only the title, author, and price fields in your queries
db.books.find( {},
  { title: 1, author: 1, price: 1, _id: 0 }
);

// - Implement sorting to display books by price (both ascending and descending)
    // Ascending
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: 1 });
    // Descending
    db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).sort({ price: -1 });



// - Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
  .sort({ price: 1 })
  .skip(0)   
  .limit(5);


// ### Task 3: Advanced Queries
    //  Write a query to find books that are both in stock and published after 2010
        db.books.find({
            inStock: true,
            publishedYear: { $gt: 2010 }
         });

    // - Use projection to return only the title, author, and price fields in your queries
            db.books.find(
                {}, 
                { title: 1, author: 1, price: 1, _id: 0 } 
            );

    // - Implement sorting to display books by price (both ascending and descending)
        db.books.find(
            {}, 
            { title: 1, author: 1, price: 1, _id: 0 }
        ).sort({ price: 1 });

    // - Use the `limit` and `skip` methods to implement pagination (5 books per page)
            db.books.find(
                {}, 
                { title: 1, author: 1, price: 1, _id: 0 }
                )
                .sort({ price: 1 })               // optional: sort by price ascending
                .skip((pageNumber - 1) * 5)       // skip documents for previous pages
                .limit(5);                       // limit results to 5 per page



// ### Task 4: Aggregation Pipeline
    // - Create an aggregation pipeline to calculate the average price of books by genre
                db.books.aggregate([
                    {
                        $group: {
                        _id: "$genre",              // group by genre
                        averagePrice: { $avg: "$price" }  // calculate average price per genre
                        }
                    },
                    {
                        $project: {
                        genre: "$_id",
                        averagePrice: 1,
                        _id: 0
                        }
                    }
                ]);

    // - Create an aggregation pipeline to find the author with the most books in the collection
                db.books.aggregate([
                    {
                        $group: {
                        _id: "$author",             // group by author
                        count: { $sum: 1 }          // count books per author
                        }
                    },
                    { $sort: { count: -1 } },       // sort descending by count
                    { $limit: 1 },                  // get top author only
                    {
                        $project: {
                        author: "$_id",
                        bookCount: "$count",
                        _id: 0
                        }
                    }
                    ]);

    // - Implement a pipeline that groups books by publication decade and counts them
        db.books.aggregate([
            {
                $group: {
                _id: {
                    $concat: [
                    { $toString: { $subtract: [ { $divide: ["$publishedYear", 10] }, { $mod: [ { $divide: ["$publishedYear", 10] }, 1 ] } ] } },
                    "0s"
                    ]
                },
                count: { $sum: 1 }
                }
            },
            {
                $project: {
                decade: "$_id",
                count: 1,
                _id: 0
                }
            },
            { $sort: { decade: 1 } }
        ]);

// ### Task 5: Indexing
// - Create an index on the `title` field for faster searches
db.books.createIndex({ title: 1 });   // 1 for ascending order


// - Create a compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: -1 });  



// - Use the `explain()` method to demonstrate the performance improvement with your indexes
db.books.find({ title: "Some Book Title" }).explain("executionStats");


// 