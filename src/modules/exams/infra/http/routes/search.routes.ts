import { Router } from 'express';

// import SearchLabsService from '../services/SearchLabsService';
import ExamSearchController from '@modules/exams/infra/http/controllers/ExamSearchController';

const searchRouter = Router();

const examSearchController = new ExamSearchController();

searchRouter.get('/exam', examSearchController.index);

export default searchRouter;
