import { Injectable, Logger } from '@nestjs/common';
import { complete } from '../grading/llm.client.js';
import { parseGradeReply } from './grade-reply.js';
import {
  buildUserPrompt,
  type GradeQuestionInput,
  PROMPT_VERSION,
  SYSTEM_PROMPT,
} from './prompts/grade-question.v1.js';

export type { GradeQuestionInput };

export interface QuestionGrade {
  points: number;
  reasoning: string;
}

// Grades one question of one paper. Swappable (tests inject a fake).
export interface QuestionGrader {
  grade(q: GradeQuestionInput): Promise<QuestionGrade>;
}

export const QUESTION_GRADER = Symbol('QUESTION_GRADER');

const TRIES_PER_QUESTION = 2; // a bad reply gets one more go before the paper attempt fails

// The real grader: Bedrock through grading/llm.client.ts.
// Logs every call (prompt version, model, latency, outcome), never student data.
@Injectable()
export class LlmQuestionGrader implements QuestionGrader {
  private readonly logger = new Logger('AI');

  async grade(q: GradeQuestionInput): Promise<QuestionGrade> {
    let lastError = '';
    for (let attempt = 1; attempt <= TRIES_PER_QUESTION; attempt++) {
      const started = Date.now();
      try {
        const raw = await complete(SYSTEM_PROMPT, buildUserPrompt(q));
        const reply = parseGradeReply(raw, q.maxPoints);
        this.log(
          q.code,
          started,
          reply.ok ? 'ok' : `invalid: ${reply.error}`,
          raw.length,
        );
        if (reply.ok)
          return { points: reply.points, reasoning: reply.reasoning };
        lastError = `${q.code}: ${reply.error}`;
      } catch (e) {
        lastError = `${q.code}: ${(e as Error).message}`;
        this.log(q.code, started, `error: ${(e as Error).message}`, 0);
      }
    }
    throw new Error(lastError);
  }

  private log(
    code: string,
    started: number,
    outcome: string,
    replyChars: number,
  ) {
    this.logger.log(
      `prompt=${PROMPT_VERSION} model=${process.env.LLM_MODEL ?? '?'} question=${code} ` +
        `latencyMs=${Date.now() - started} replyChars=${replyChars} ${outcome}`,
    );
  }
}
