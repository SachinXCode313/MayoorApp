import express from "express";
import getStudents from "../controllers/students.js";
import { createAssessmentCriteria, getAssessmentCriterias } from "../controllers/assessmentCriterias.js";
import { createLearningOutcome, getLearningOutcomes } from "../controllers/learningOutcomes.js";
import getReportOutcomes from "../controllers/reportOutcomes.js";
import { getAssessmentCriteriaScores, setAssessmentCriteriaScore } from "../controllers/assessmentCriteriasScores.js";
import getLearningOutcomesScore from "../controllers/learningOutcomesScore.js";
import getReportOutcomesScore from "../controllers/reportOutcomesScore.js";
import setLearningOutcomesMapping from "../controllers/leaningOutcomesMapping.js";
import setReportOutcomesMapping from "../controllers/reportOutcomesMapping.js";


const routers = express.Router();

routers.get('/students',getStudents)
routers.get('/assessment-criteria',getAssessmentCriterias)
routers.get('/learning-outcome',getLearningOutcomes)
routers.get('/report-outcome',getReportOutcomes)
routers.get('/assessment-criteria-score',getAssessmentCriteriaScores)
routers.get('/learning-outcome-score',getLearningOutcomesScore)
routers.get('/report-outcome-score',getReportOutcomesScore)

routers.post('/assessment-criteria',createAssessmentCriteria)
routers.post('/learning-outcome',createLearningOutcome)
routers.post('/assessment-criteria-score',setAssessmentCriteriaScore)
routers.post('/learning-outcome-mapping',setLearningOutcomesMapping)
routers.post('/report-outcomes-mapping',setReportOutcomesMapping)



export default routers;