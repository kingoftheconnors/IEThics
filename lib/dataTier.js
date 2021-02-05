
// const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// async function getClassNames(callback) {
//   let result = await client.query("SELECT title FROM class GROUP BY title ORDER BY title;");
//   if(result.rows.length > 0) {
//     callback(result.rows.map(function(dict) {return dict['title'];} ));
//   }
//   else {
//     callback([]);
//   }
// }

// module.exports = {
//   getClassNames
// }