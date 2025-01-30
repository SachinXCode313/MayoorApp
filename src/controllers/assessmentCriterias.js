import db from "../database/db.js";

// Get Assessment Criterias
const getAssessmentCriterias = async (req, res) => {
    const { subject, year, quarter,classname } = req.headers; // Extract headers

    console.log(`Subject: ${subject}, Year: ${year}, Quarter: ${quarter} , class: ${classname}`);

    // Validate input
    if (!subject || !year || !quarter || !classname) {
        return res.status(400).json({
            message: 'Invalid input. Subject,Class, Year, and Quarter are required in the headers.',
        });
    }

    try {
        // SQL query to fetch assessment_criterias based on filters
        const query = `
            SELECT id, name, max_marks
            FROM assessment_criterias
            WHERE subject = ? AND year = ? AND quarter = ? AND class = ?
        `;

        // Execute the query
        const [results] = await db.execute(query, [subject, year, quarter,classname]);

        // Check if results are found
        if (results.length === 0) {
            return res.status(404).json({
                message: 'No assessment criterias found for the given filters.',
            });
        }

        // Return the filtered data
        return res.status(200).json({
            message: 'Assessment criterias retrieved successfully',
            assessments: results,
        });
    } catch (err) {
        console.error('Error retrieving assessment criterias:', err);

        return res.status(500).json({
            message: 'Server error while fetching assessment criterias',
            error: err.message,
        });
    }
}

// Create Assessment Criteria
const createAssessmentCriteria = async (req, res) => {
    const { year, quarter, subject,classname } = req.headers; 
    const { max_marks, name } = req.body; 

    // Validate required fields
    if (!year || !quarter || !subject || !max_marks || !classname || !name) {
        return res.status(400).json({
            message: 'Missing required fields. Ensure year, quarter,class, subject (headers), and max_marks, name (body) are provided.',
        });
    }

    try {
        // SQL query to insert data into the table
        const insertQuery = `
            INSERT INTO assessment_criterias (name, max_marks, year, quarter, subject,class)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.execute(insertQuery, [
            name,
            max_marks,
            year,
            quarter,
            subject,
            classname
        ]);

        // Return success response
        return res.status(201).json({
            message: 'Assessment criterion added successfully',
            insertedId: result.insertId, // Return the ID of the inserted record
        });
    } catch (err) {
        console.error('Error inserting assessment criteria:', err);

        // Handle database-specific errors
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'Duplicate entry. This assessment criterion already exists.',
            });
        }

        return res.status(500).json({
            message: 'Server error while inserting assessment criteria',
            error: err.message,
        });
    }
}



export {getAssessmentCriterias,createAssessmentCriteria};