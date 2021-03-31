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
        questionHCvIPID,        \
        questionTttCvPrID,      \
        questionIPvPrID,        \
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

function getResponse(responseID, callback) {
  if(client == null) {
    callback("{}");
    return;
  }
  client.query(
      `
      SELECT r.responseID, a.description as age
           , e.description as experience, g.description as geography
           , s.description as student, p.description as program, f.description as field
           , HCvIP.resultText as textHCvIP
           , HCvIP.winner as winnerHCvIP
           , HCvPr.resultText as textHCvPr
           , HCvPr.winner as winnerHCvPr
           , HCvQA.resultText as textHCvQA
           , HCvQA.winner as winnerHCvQA
           , HCvTttC.resultText as textHCvTttC
           , HCvTttC.winner as winnerHCvTttC
           , IPvPr.resultText as textIPvPr
           , IPvPr.winner as winnerIPvPr
           , QAvIP.resultText as textQAvIP
           , QAvIP.winner as winnerQAvIP
           , QAvPr.resultText as textQAvPr
           , QAvPr.winner as winnerQAvPr
           , QAvTttC.resultText as textQAvTttC
           , QAvTttC.winner as winnerQAvTttC
           , TttCvIP.resultText as textTttCvIP
           , TttCvIP.winner as winnerTttCvIP
           , TttCvPr.resultText as textTttCvPr
           , TttCvPr.winner as winnerTttCvPr
      FROM response r
      LEFT JOIN ageGroups a
        ON a.ageGroupID = r.ageGroupID
      LEFT JOIN expGroups e
        ON e.expGroupID = r.expGroupID
      LEFT JOIN geographyGroups g
        ON g.geographyGroupID = r.geographyGroupID
      LEFT JOIN studentGroups s
        ON s.studentGroupID = r.studentGroupID
      LEFT JOIN programGroups p
        ON p.programGroupID = r.programGroupID
      LEFT JOIN fieldGroups f
        ON f.fieldGroupID = r.fieldGroupID
      JOIN questionHCvIP HCvIP
        ON HCvIP.questionHCvIPID = r.questionHCvIPID
      JOIN questionHCvPr HCvPr
        ON HCvPr.questionHCvPrID = r.questionHCvPrID
      JOIN questionHCvQA HCvQA
        ON HCvQA.questionHCvQAID = r.questionHCvQAID
      JOIN questionHCvTttC HCvTttC
        ON HCvTttC.questionHCvTttCID = r.questionHCvTttCID
      JOIN questionIPvPR IPvPR
        ON IPvPR.questionIPvPRID = r.questionIPvPRID
      JOIN questionQAvIP QAvIP
        ON QAvIP.questionQAvIPID = r.questionQAvIPID
      JOIN questionQAvPR QAvPR
        ON QAvPR.questionQAvPRID = r.questionQAvPRID
      JOIN questionQAvTttC QAvTttC
        ON QAvTttC.questionQAvTttCID = r.questionQAvTttCID
      JOIN questionTttCvIP TttCvIP
        ON TttCvIP.questionTttCvIPID = r.questionTttCvIPID
      JOIN questionTttCvPr TttCvPr
        ON TttCvPr.questionTttCvPrID = r.questionTttCvPrID
      WHERE responseID=$1;
      `, [responseID], (err, res) => {
    if (err) throw err;
    callback(res.rows[0])
  });
}

module.exports = {
  saveResponse,
  getResponse
}
