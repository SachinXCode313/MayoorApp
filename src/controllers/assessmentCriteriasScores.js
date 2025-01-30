import db from "../database/db.js";

// Get Assessment Criterias Scores
const getAssessmentCriteriaScores =  async (req, res) => {
    const { student_id } = req.headers; // Extract student ID from headers

    console.log(`Fetching all AC scores for Student ID: ${student_id}`);

    // Validate input
    if (!student_id) {
        return res.status(400).json({
            message: 'Invalid input. Student ID (student_id) is required.',
        });
    }

    try {
        // Query to fetch all AC scores for the student
        const query = `
            SELECT student_id, ac_id, value
            FROM ac_scores
            WHERE student_id = ?
        `;
        const [results] = await db.execute(query, [student_id]);

        if (results.length === 0) {
            // No record found
            return res.status(404).json({
                message: 'No scores found for the given Student ID.',
            });
        }

        // Return all AC scores
        return res.status(200).json({
            message: 'Scores fetched successfully.',
            scores: results, // Return all matching records
        });
    } catch (err) {
        console.error('Error fetching scores:', err);

        return res.status(500).json({
            message: 'Server error while fetching scores.',
            error: err.message,
        });
    }
}

// Set Assessment Criteria Scores
const setAssessmentCriteriaScore = async (req, res) => {
    try {
        const { year, quarter, subject } = req.headers;
        const { obtained_marks, student_id, ac_id } = req.body;

        if (!obtained_marks) {
            return res.status(400).json({ error: "obtained_marks, student_id and ac_id are required in the body" });
        }
        if (!student_id || !ac_id) {
            return res.status(400).json({ error: "year, quarter, subject are required in the headers" });
        }

        // Fetching the assessment criteria using ac_id
        const [criteriaRows] = await db.query(
            "SELECT max_marks FROM assessment_criterias WHERE id = ? AND subject = ? AND quarter = ? AND year = ?",
            [ac_id, subject, quarter, year]
        );
        if (criteriaRows.length === 0) {
            return res.status(404).json({ error: "Assessment criteria not found for the given parameters" });
        }
        const max_marks = criteriaRows[0].max_marks;

        if (obtained_marks > max_marks) {
            return res.status(400).json({ error: "Obtained Marks cannot be greater than Maximum marks of the Assessment" });
        }
        
        const normalized_marks = obtained_marks / max_marks;

        // inserting normalized score into ac_scores table
        const [result] = await db.query(
            "INSERT INTO ac_scores (student_id, ac_id, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?",
            [student_id, ac_id, normalized_marks, normalized_marks]
        );

        res.status(201).json({
            message: "Normalized score saved successfully"
        });
    } catch (error) {
        console.error("Error adding normalized score:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



export {getAssessmentCriteriaScores,setAssessmentCriteriaScore};