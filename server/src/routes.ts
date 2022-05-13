import { Router } from 'express';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';

const routes = Router();



routes.get('/start', (req, res) => {
  return res.send('Start app!');
});

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;
  const prismaFeedbacksRepository = new PrismaFeedbacksRepository();
  const nodemailerMailAdapter = new NodemailerMailAdapter();
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository,
    nodemailerMailAdapter
  );

  await submitFeedbackUseCase.execute({
    type,
    comment,
    screenshot,
  })

  
  return res.status(201).send();
});

export default routes;