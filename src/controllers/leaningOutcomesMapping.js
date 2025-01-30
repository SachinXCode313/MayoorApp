import db from "../database/db.js";

const priorityValues = {
    h: 0.5,
    m: 0.3,
    l: 0.2,
};

// Set Learning Outcomes Mapping
const setLearningOutcomesMapping = async (req, res) => {
    try {
        const subject = req.headers["subject"];
        const quarter = req.headers["quarter"];
        const year = req.headers["year"];
        const className = req.headers["class"];
        const section = req.headers["section"];
        const { lo_id, data } = req.body;

        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: "Invalid data format. Expected an array of objects with ac_id and priority." });
        }
        const validPriorities = ["h", "m", "l"];
        for (const item of data) {
            if (!validPriorities.includes(item.priority)) {
                return res.status(400).json({ error: `Invalid priority '${item.priority}'. Must be 'h', 'm', or 'l'.` });
            }
        }

        const [loRows] = await db.query(`SELECT id FROM learning_outcomes WHERE id = ?`, [lo_id]);
        if (loRows.length === 0) {
            return res.status(404).json({ error: "Invalid lo_id provided." });
        }
        
        const [studentRows] = await db.query(
            `SELECT student_id FROM students_records WHERE year = ? AND class = ? AND section = ?`,
            [year, className, section]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ error: "No students found in students_records for the given filters." });
        }

        const studentIds = studentRows.map(row => row.student_id);
        const inputAcIds = data.map(item => item.ac_id);
        const [validAcRows] = await db.query(
            `SELECT id AS ac_id FROM assessment_criterias WHERE id IN (?) AND subject = ? AND quarter = ?`,
            [inputAcIds, subject, quarter]
        );
        const validAcIds = validAcRows.map(row => row.ac_id);
        if (validAcIds.length !== inputAcIds.length) {
            return res.status(404).json({ error: "Some provided ac_ids are invalid or do not match filters." });
        }
        
        let totalDenominator = 0;
        data.forEach(item => {
            totalDenominator += priorityValues[item.priority];
        });
        if (totalDenominator === 0) {
            return res.status(400).json({ error: "Invalid weight calculation, check input values." });
        }

        const loAcMappingPromises = data.map(async (item) => {
            const { ac_id, priority } = item;
            let weight = priorityValues[priority] / totalDenominator;
            await db.query(
                "INSERT INTO lo_ac_mapping (lo_id, ac_id, weight) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE weight = ?",
                [lo_id, ac_id, weight, weight]
            );
            return { ac_id, weight };
        });
        
        const mappings = await Promise.all(loAcMappingPromises);

        for (const student_id of studentIds) {
            let loScore = 0;
            for (const mapping of mappings) {
                const { ac_id, weight } = mapping;
                const [acScoreRows] = await db.query(
                    "SELECT value FROM ac_scores WHERE ac_id = ? AND student_id = ?",
                    [ac_id, student_id]
                );
                if (acScoreRows.length === 0) {
                    console.warn(`Missing ac_scores for ac_id: ${ac_id}, student_id: ${student_id}`);
                    continue;
                }
                const { value } = acScoreRows[0];
                loScore += weight * value;
            }
            await db.query(
                "INSERT INTO lo_scores (lo_id, student_id, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?",
                [lo_id, student_id, loScore, loScore]
            );
        }
        res.status(201).json({
            message: "LO and AC mapping with weights saved successfully",
            students_processed: studentIds.length,
        });
    } catch (error) {
        console.error("Error mapping LO and AC:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}



export default setLearningOutcomesMapping;