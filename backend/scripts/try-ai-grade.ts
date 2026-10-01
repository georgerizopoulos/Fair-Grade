// One real grading call through Bedrock, for checking the prompt and model.
//   npx tsx scripts/try-ai-grade.ts
import 'dotenv/config';
import { LlmQuestionGrader } from '../src/ai/question-grader.js';

const grader = new LlmQuestionGrader();
const result = await grader.grade({
  code: 'Q2',
  prompt: 'Compare TCP and UDP and give one use case for each.',
  maxPoints: 3,
  modelAnswer:
    'TCP is connection-oriented and reliable: it retransmits lost segments and controls flow and congestion. UDP sends independent datagrams with no setup or retransmission, so it has less overhead. TCP suits file transfer or the web; UDP suits voice, video or games where late data is useless.',
  rubric: [
    {
      text: 'Correct core difference: connection and reliability',
      points: 1.5,
    },
    { text: 'A valid use case for each', points: 1 },
    { text: 'Mentions overhead, flow or congestion control', points: 0.5 },
  ],
  answer:
    'TCP is reliable, UDP is not. TCP is used for web pages, UDP for streaming.',
});
console.log(result);
