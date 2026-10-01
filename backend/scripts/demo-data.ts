// The demo story (change request §7): users, courses, exams, questions.
// Papers and grades are added in later phases.

export const DEMO_PASSWORD = 'demo1234';

export interface DemoUser {
  key: string;
  name: string;
  email: string;
  role: 'instructor' | 'ta';
  status?: 'ACTIVE' | 'INVITED';
}

export const USERS: DemoUser[] = [
  {
    key: 'instructor',
    name: 'Instructor Demo',
    email: 'instructor@demo.com',
    role: 'instructor',
  },
  { key: 'maria', name: 'Maria Papadaki', email: 'maria@demo.com', role: 'ta' },
  {
    key: 'giannis',
    name: 'Giannis Petrou',
    email: 'giannis@demo.com',
    role: 'ta',
  },
  { key: 'eleni', name: 'Eleni Markou', email: 'eleni@demo.com', role: 'ta' },
  { key: 'nikos', name: 'Nikos Georgiou', email: 'nikos@demo.com', role: 'ta' },
  {
    key: 'katerina',
    name: 'Katerina Vlachou',
    email: 'katerina@demo.com',
    role: 'ta',
  },
  {
    key: 'alexandros',
    name: 'Alexandros Kostakis',
    email: 'alexandros@demo.com',
    role: 'ta',
    status: 'INVITED',
  },
];

export interface DemoQuestion {
  code: string;
  title: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubric: [text: string, points: number][];
}

export interface DemoExam {
  key: string;
  name: string;
  heldAt: string; // ISO date
  status: 'DRAFT' | 'QUESTIONS_READY' | 'OPEN' | 'PUBLISHED';
  questions: DemoQuestion[];
}

export interface DemoCourse {
  key: string;
  code: string;
  name: string;
  semester: string;
  tas: string[]; // user keys
  exams: DemoExam[];
}

const MIDTERM_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'TCP three-way handshake',
    prompt: 'Explain how the TCP three-way handshake works.',
    maxPoints: 4,
    modelAnswer:
      "The client sends SYN with an initial sequence number x. The server replies SYN-ACK with its own number y and acknowledges x+1. The client replies ACK y+1. Both sides now know each other's starting sequence numbers, so lost or reordered data can be detected.",
    rubric: [
      ['Names the three steps in order', 2],
      ['Explains what the sequence numbers are for', 1],
      ['Says why the handshake is needed before data', 1],
    ],
  },
  {
    code: 'Q2',
    title: 'TCP and UDP',
    prompt: 'Compare TCP and UDP and give one use case for each.',
    maxPoints: 3,
    modelAnswer:
      'TCP is connection-oriented and reliable: it retransmits lost segments and controls flow and congestion. UDP sends independent datagrams with no setup or retransmission, so it has less overhead. TCP suits file transfer or the web; UDP suits voice, video or games where late data is useless.',
    rubric: [
      ['Correct core difference: connection and reliability', 1.5],
      ['A valid use case for each', 1],
      ['Mentions overhead, flow or congestion control', 0.5],
    ],
  },
  {
    code: 'Q3',
    title: 'DNS resolution',
    prompt: 'What does a DNS resolver do when a name is not in its cache?',
    maxPoints: 3,
    modelAnswer:
      "It resolves the name iteratively: it asks a root server, follows the referral to the TLD server, then to the authoritative server for the domain, and returns the answer. It caches the result for the record's TTL.",
    rubric: [
      ['Root, TLD, authoritative, in order', 2],
      ['Caches the answer for the TTL', 1],
    ],
  },
];

const EXAM1_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'OSI layers',
    prompt:
      'Name the layers of the TCP/IP model and give one protocol for each.',
    maxPoints: 3,
    modelAnswer:
      'Link (Ethernet, Wi-Fi), Network (IP), Transport (TCP, UDP), Application (HTTP, DNS).',
    rubric: [
      ['All four layers in order', 2],
      ['A correct protocol for each layer', 1],
    ],
  },
  {
    code: 'Q2',
    title: 'Subnetting a /26',
    prompt:
      'Split 192.168.10.0/24 into /26 subnets. Give each network address, broadcast address and usable host range.',
    maxPoints: 4,
    modelAnswer:
      'Four /26 subnets of 64 addresses: .0 (hosts .1–.62, broadcast .63), .64 (.65–.126, .127), .128 (.129–.190, .191), .192 (.193–.254, .255). Each has 62 usable hosts.',
    rubric: [
      ['Four subnets of 64 addresses', 1],
      ['Correct network and broadcast addresses', 2],
      ['Correct usable host ranges (62 hosts)', 1],
    ],
  },
  {
    code: 'Q3',
    title: 'Switch vs router',
    prompt: 'What is the difference between a switch and a router?',
    maxPoints: 3,
    modelAnswer:
      'A switch forwards frames inside one LAN using MAC addresses (layer 2). A router forwards packets between networks using IP addresses and a routing table (layer 3).',
    rubric: [
      ['Switch: layer 2, MAC, within a LAN', 1.5],
      ['Router: layer 3, IP, between networks', 1.5],
    ],
  },
];

const EXAM2_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'HTTP persistent connections',
    prompt: 'What are HTTP persistent connections and why do they help?',
    maxPoints: 3,
    modelAnswer:
      'With persistent connections several requests and responses reuse one TCP connection instead of opening a new one per object. This saves the handshake and slow-start cost for every object, so pages load faster.',
    rubric: [
      ['Several requests over one TCP connection', 1.5],
      ['Saves handshake / slow start per object', 1.5],
    ],
  },
  {
    code: 'Q2',
    title: 'Web caching',
    prompt: 'How does a web proxy cache reduce response time?',
    maxPoints: 3,
    modelAnswer:
      'The proxy keeps copies of recently requested objects close to the clients. A hit is served from the LAN without contacting the origin server; a conditional GET checks freshness cheaply.',
    rubric: [
      ['Serves hits locally without the origin', 2],
      ['Mentions conditional GET / freshness', 1],
    ],
  },
  {
    code: 'Q3',
    title: 'Email protocols',
    prompt: 'Which protocols send and retrieve email, and what does each do?',
    maxPoints: 4,
    modelAnswer:
      'SMTP pushes mail from the client to its server and between mail servers. IMAP (or POP3) lets the recipient retrieve mail from their server; IMAP keeps it on the server and syncs folders.',
    rubric: [
      ['SMTP for sending and server-to-server', 2],
      ['IMAP or POP3 for retrieval', 1],
      ['Difference between IMAP and POP3', 1],
    ],
  },
];

const FINAL_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'Congestion control',
    prompt: 'Describe TCP slow start and congestion avoidance.',
    maxPoints: 5,
    modelAnswer:
      'Slow start doubles the congestion window every RTT until it reaches ssthresh; then congestion avoidance grows it by one MSS per RTT. On loss, ssthresh is halved and the window is reduced.',
    rubric: [
      ['Slow start: exponential growth to ssthresh', 2],
      ['Congestion avoidance: linear growth', 2],
      ['Reaction to loss', 1],
    ],
  },
  {
    code: 'Q2',
    title: 'Routing',
    prompt: 'Compare link-state and distance-vector routing.',
    maxPoints: 5,
    modelAnswer:
      'Link-state routers flood the full topology and each runs Dijkstra; distance-vector routers exchange distance tables with neighbours and run Bellman-Ford, which converges slower and can count to infinity.',
    rubric: [
      ['Link-state: global topology + Dijkstra', 2],
      ['Distance-vector: neighbour tables + Bellman-Ford', 2],
      ['Convergence / count-to-infinity', 1],
    ],
  },
];

const DB_FINAL_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'Normalization',
    prompt: 'What is 3NF and why does it matter?',
    maxPoints: 5,
    modelAnswer:
      'A relation is in 3NF when every non-key attribute depends only on the key, with no transitive dependencies. It removes redundancy that causes update, insert and delete anomalies.',
    rubric: [
      ['Correct 3NF definition', 3],
      ['Explains the anomalies it prevents', 2],
    ],
  },
  {
    code: 'Q2',
    title: 'Transactions',
    prompt: 'Explain the ACID properties.',
    maxPoints: 5,
    modelAnswer:
      "Atomicity: all or nothing. Consistency: constraints hold before and after. Isolation: concurrent transactions do not see each other's partial work. Durability: committed changes survive crashes.",
    rubric: [
      ['All four properties named', 2],
      ['Each one explained correctly', 3],
    ],
  },
];

const WEB_QUESTIONS: DemoQuestion[] = [
  {
    code: 'Q1',
    title: 'HTTP methods',
    prompt: 'When do you use GET, POST, PUT and DELETE?',
    maxPoints: 5,
    modelAnswer:
      'GET reads a resource without side effects, POST creates or submits, PUT replaces a resource idempotently, DELETE removes it.',
    rubric: [
      ['Correct use of each method', 4],
      ['Mentions idempotency / safety', 1],
    ],
  },
  {
    code: 'Q2',
    title: 'Cookies and sessions',
    prompt: 'How does a server keep a user logged in across requests?',
    maxPoints: 5,
    modelAnswer:
      'HTTP is stateless, so the server sets a cookie with a session id (or a signed token); the browser sends it on every request and the server looks up the session.',
    rubric: [
      ['HTTP is stateless', 1],
      ['Cookie / token carries the session', 3],
      ['Server-side lookup or signature check', 1],
    ],
  },
];

export const COURSES: DemoCourse[] = [
  {
    key: 'hy335',
    code: 'HY335',
    name: 'Computer Networks',
    semester: 'Winter 2026–27',
    tas: ['maria', 'giannis', 'eleni', 'nikos', 'katerina'],
    exams: [
      {
        key: 'exam1',
        name: 'Exam 1',
        heldAt: '2026-09-16',
        status: 'PUBLISHED',
        questions: EXAM1_QUESTIONS,
      },
      {
        key: 'exam2',
        name: 'Exam 2',
        heldAt: '2026-09-23',
        status: 'PUBLISHED',
        questions: EXAM2_QUESTIONS,
      },
      {
        key: 'midterm',
        name: 'Midterm',
        heldAt: '2026-09-30',
        status: 'OPEN',
        questions: MIDTERM_QUESTIONS,
      },
      {
        key: 'final',
        name: 'Final',
        heldAt: '2027-01-20',
        status: 'QUESTIONS_READY',
        questions: FINAL_QUESTIONS,
      },
      {
        key: 'resit',
        name: 'Resit',
        heldAt: '2027-09-10',
        status: 'DRAFT',
        questions: [],
      },
    ],
  },
  {
    key: 'hy360',
    code: 'HY360',
    name: 'Database Systems',
    semester: 'Winter 2026–27',
    tas: [],
    exams: [
      {
        key: 'final',
        name: 'Final',
        heldAt: '2027-01-25',
        status: 'QUESTIONS_READY',
        questions: DB_FINAL_QUESTIONS,
      },
    ],
  },
  {
    key: 'hy359',
    code: 'HY359',
    name: 'Web Programming',
    semester: 'Spring 2026',
    tas: ['nikos', 'eleni'],
    exams: [
      {
        key: 'midterm',
        name: 'Midterm',
        heldAt: '2026-04-15',
        status: 'PUBLISHED',
        questions: WEB_QUESTIONS,
      },
      {
        key: 'final',
        name: 'Final',
        heldAt: '2026-06-20',
        status: 'PUBLISHED',
        questions: WEB_QUESTIONS,
      },
    ],
  },
];
