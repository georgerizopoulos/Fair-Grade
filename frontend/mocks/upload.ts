// Owner: Σταύρος ? mock responses for the upload flow
// Used during offline development before the backend is running.

export const mockRubrics = {
  rubrics: [
    {
      id: "rubric-mock-1",
      courseName: "HY335 - Computer Networks",
      questionText: "Explain how the TCP three-way handshake works.",
      criteriaCount: 4,
      totalPoints: 10,
      answersCount: 18,
      aiGraded: false,
      createdAt: "2026-10-01T09:05:00Z",
    },
  ],
};

export const mockRubricDetail = {
  id: "rubric-mock-1",
  courseName: "HY335 - Computer Networks",
  questionText: "Explain how the TCP three-way handshake works.",
  criteriaCount: 4,
  totalPoints: 10,
  answersCount: 18,
  aiGraded: false,
  createdAt: "2026-10-01T09:05:00Z",
  criteria: [
    { id: "crit-1", position: 1, description: "Correctly names all 3 steps in order (SYN, SYN-ACK, ACK)", maxPoints: 3 },
    { id: "crit-2", position: 2, description: "Explains what sequence numbers are used for in the handshake", maxPoints: 3 },
    { id: "crit-3", position: 3, description: "States why a handshake is needed before data transfer (reliability/sync)", maxPoints: 2 },
    { id: "crit-4", position: 4, description: "Answer is clearly organized and easy to follow", maxPoints: 2 },
  ],
};

export const mockTas = {
  users: [
    { id: "ta-maria", name: "Maria Papadaki", email: "maria@demo.com", role: "ta" as const },
    { id: "ta-nikos", name: "Nikos Georgiou", email: "nikos@demo.com", role: "ta" as const },
    { id: "ta-eleni", name: "Eleni Markou", email: "eleni@demo.com", role: "ta" as const },
  ],
};

export const mockAnswers = {
  rubricId: "rubric-mock-1",
  answers: [
    { id: "ans-1", studentIdAnon: "student_001", answerText: "The client sends a SYN with its initial sequence number...", createdAt: "2026-10-01T09:10:00Z" },
    { id: "ans-2", studentIdAnon: "student_002", answerText: "TCP handshake is when two computers agree to talk...", createdAt: "2026-10-01T09:10:00Z" },
    { id: "ans-3", studentIdAnon: "student_003", answerText: "First SYN, then SYN-ACK, then ACK. Numbers track bytes...", createdAt: "2026-10-01T09:10:00Z" },
  ],
};

export const mockBulkAnswersResponse = {
  rubricId: "rubric-mock-1",
  created: [
    { id: "ans-new-1", studentIdAnon: "student_019" },
    { id: "ans-new-2", studentIdAnon: "student_020" },
  ],
};

export const mockBulkGradesResponse = {
  taId: "ta-maria",
  taName: "Maria Papadaki",
  saved: 8,
};

export const mockGradeRunResponse = {
  rubricId: "rubric-mock-1",
  answersTotal: 18,
  answersGraded: 18,
  aiGradesSaved: 72,
  failedAnswers: [],
  durationMs: 14200,
};
