import db from "../database/db.js";

// Get students
const getStudents =  async (req, res) => {
    const year = req.headers['year'];
    const className = req.headers['classname'];
    const section = req.headers['section'];

    if (!year || !className || !section) {
        return res.status(400).json({
            message: "Missing required headers. Please provide 'year', 'class', and 'section'."
        });
    }

    if (isNaN(year) || isNaN(className) || !section.trim()) {
        return res.status(400).json({
            message: "Invalid header values. 'year' and 'class' should be numbers, and 'section' cannot be empty."
        });
    }

    try {
        const query = `
            SELECT s.name 
            FROM students s 
            JOIN students_records sc ON s.id = sc.student_id 
            WHERE sc.year = ? AND sc.class = ? AND sc.section = ?
        `;

        const [results] = await db.execute(query, [year, className, section]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No students found for the given year, class, and section.' });
        }

        return res.status(200).json({ Students: results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

export default getStudents;