import db from "../database/db.js";

// Get Learning Outcomes
const getLearningOutcomes = async (req, res) => {
    const { year, subject, classname, quarter } = req.headers;
    console.log(classname)
    if (!year || !subject || !quarter || !classname) {
        return res.status(400).json({ message: "Missing required headers: year, subject,class or quarter" });
    }

    try {
        const query = `
    SELECT id, name 
    FROM learning_outcomes 
    WHERE year = ? AND subject = ? AND quarter = ? AND class = ?
    `;
        const [results] = await db.execute(query, [year, subject, quarter, classname]);

        if (results.length === 0) {
            return res.status(404).json({ message: "No learning outcomes found for the provided filters" });
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching learning outcomes:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Create Learning Outcomes
const createLearningOutcome = async (req, res) => {
    const { year, quarter,classname, subject } = req.headers;
    const { name } = req.body;

    if (!year || !quarter || !classname || !subject || !name) {
        return res.status(400).json({
            message: "Missing required fields: year, quarter,class, subject (headers) or name (body).",
        });
    }
    try {
        const [maxIdRow] = await db.execute('SELECT MAX(id) AS maxId FROM learning_outcomes');
        const newId = (maxIdRow[0].maxId || 0) + 1; 

        const query = `
        INSERT INTO learning_outcomes (id, name, year, quarter,class, subject) 
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [newId, name, year, quarter,classname, subject]);

        res.status(201).json({
            message: "Learning outcome added successfully",
            insertedId: newId, // Respond with the manually generated ID
        });
    } catch (err) {
        console.error("Error inserting learning outcome:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}



export { getLearningOutcomes, createLearningOutcome };