const { Client } = require('pg');

var connectionString = null;
if(process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL
} else {
  try {
    configVars = require('./config')
    connectionString = configVars['database'];
  }
  catch (e) {
    console.log("WARNING: No config file or database found. All database calls will return empty");
  }
}

var client = null
if (connectionString) {
  client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

if (client) {
    client.connect();
}

function saveResponse(formData, callback) {
    if(client == null) {
      callback(0);
      return;
    }
    client.query(
      'INSERT INTO response(    \
        ageGroupID,             \
        expGroupID,             \
        geographyGroupID,       \
        fieldGroupID,           \
        studentGroupID,         \
        programGroupID,         \
        ethicsCourseGroupID,    \
        questionHCvTttCID,      \
        questionHCvQAID,        \
        questionQAvIPID,      \
        questionQAvTttCID,      \
        questionHCvPrID,        \
        questionQAvPrID,        \
        questionTttCvPrID,      \
        questionIPvPrID,        \
        questionHCvIPID,        \
        questionTttCvIPID)      \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) \
      RETURNING responseID;',
        [
          formData.age,
          formData.exp,
          formData.geography,
          formData.field,
          formData.student,
          formData.program,
          formData.ethicsCourse,
          formData.HCvTttC,
          formData.HCvQA,
          formData.QAvIP,
          formData.QAvTttC,
          formData.HCvPr,
          formData.QAvPr,
          formData.HCvIP,
          formData.TttCvPr,
          formData.IPvPr,
          formData.TttCvIP
        ],
        (err, res) =>
      {
        if (err) throw err;
        console.log("responseID: ", res.rows[0]['responseid'])
        var responseID = res.rows[0]['responseid'];
        callback(responseID);
      }
    );
}

module.exports = {
  saveResponse
}
