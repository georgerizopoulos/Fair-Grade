import { Injectable, ServiceUnavailableException } from '@nestjs/common';

export interface SolutionsPdfUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface DraftQuestion {
  code: string;
  title: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubric: { text: string; points: number }[];
}

export interface QuestionsImporter {
  importSolutionsPdf(pdf: Buffer): Promise<DraftQuestion[]>;
}

export const QUESTIONS_IMPORTER = Symbol('QUESTIONS_IMPORTER');

@Injectable()
export class UnavailableQuestionsImporter implements QuestionsImporter {
  async importSolutionsPdf(_pdf: Buffer): Promise<DraftQuestion[]> {
    throw new ServiceUnavailableException(
      'Importing questions from a PDF is not available yet. Add the questions by hand.',
    );
  }
}
