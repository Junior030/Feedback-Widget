import express from 'express';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f15a275b92364d",
    pass: "f60738dbe9e5a0"
  }
});

app.get('/start', (req, res) => {
  return res.send('Start app!');
});

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    }
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Junior Henrique de Faria <juniorhenrique030@gmail.com>",
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif; font-size: 16px; color: #111">`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}`,
      `</div>`
    ].join('\n')
  })
  return res.status(201).json({data: feedback});
});

app.listen(3333, () => {
  console.log('HTTP server running!');
});