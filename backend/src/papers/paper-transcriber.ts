import { Injectable } from '@nestjs/common';

// Faking the scan step for the demo. A real transcriber would read the uploaded
// PDF with a vision model; here we keep 5 ready-made "scanned papers" and return
// a random one, so the TA sees a filled-in transcription as if the handwriting
// had just been read. The words in `uncertainWords` show up highlighted for the
// TA to check, exactly like a real low-confidence read would.

export interface TranscribedAnswer {
  transcription: string;
  uncertainWords: string[];
}

// One fake paper: the transcription per question code (Q1, Q2, ...).
export type TranscriptTemplate = Record<string, TranscribedAnswer>;

export interface PaperTranscriber {
  // One transcription per question code. Codes with no template entry come back
  // empty, so the TA just types them in.
  transcribe(questionCodes: string[]): Record<string, TranscribedAnswer>;
}

export const PAPER_TRANSCRIBER = Symbol('PAPER_TRANSCRIBER');

// Five fake papers of varying quality, matched to the demo midterm questions
// (Q1 TCP handshake, Q2 TCP vs UDP, Q3 DNS resolution).
const TEMPLATES: TranscriptTemplate[] = [
  {
    Q1: {
      transcription:
        'The client sends a SYN with its initial sequence number x. The server replies with SYN-ACK: it acknowledges x+1 and sends its own number y. The client sends ACK y+1. After that both sides know each other\u2019s starting sequence numbers, so lost or reordered segments can be detected and the connection is open.',
      uncertainWords: ['SYN-ACK'],
    },
    Q2: {
      transcription:
        'TCP is connection-oriented and reliable: it retransmits lost segments and does flow and congestion control. UDP just sends datagrams with no setup, so it has less overhead. TCP is used for file transfer and the web, UDP for live video and online games.',
      uncertainWords: [],
    },
    Q3: {
      transcription:
        'The resolver asks a root server, which refers it to the TLD server, which refers it to the authoritative server for the domain. It returns the answer and caches it for the TTL.',
      uncertainWords: ['TTL'],
    },
  },
  {
    Q1: {
      transcription:
        'First the client sends SYN. Then the server sends back SYN-ACK. Then the client sends ACK. The sequence numbers are so the packets are numbered. After the ACK the connection is established and they can send data.',
      uncertainWords: ['SYN'],
    },
    Q2: {
      transcription:
        'TCP makes a connection and is reliable, UDP does not. TCP is slower because of the handshake. You use TCP for downloading files and UDP for streaming.',
      uncertainWords: [],
    },
    Q3: {
      transcription:
        'It goes and asks other DNS servers until it finds the one that knows the address, then it sends it back and remembers it for next time.',
      uncertainWords: [],
    },
  },
  {
    Q1: {
      transcription:
        'The TCP handshake is how the connection gets encrypted. The client sends HELLO, the server sends a certificate, the client sends a key, and then the data is secure. That is why HTTPS is safe.',
      uncertainWords: ['HELLO', 'certificate'],
    },
    Q2: {
      transcription:
        'TCP and UDP are both transport protocols. TCP is for the internet and UDP is for local networks. TCP is safer.',
      uncertainWords: [],
    },
    Q3: {
      transcription:
        'The DNS resolver looks in a big table on the internet and finds the IP address that matches the name, then gives it to the browser.',
      uncertainWords: [],
    },
  },
  {
    Q1: {
      transcription:
        '1. Client \u2192 Server: SYN (client ISN = x). 2. Server \u2192 Client: SYN-ACK (server ISN = y, ack = x+1). 3. Client \u2192 Server: ACK (ack = y+1). The ISNs let each side acknowledge and order the bytes it receives. The handshake is needed so both ends agree on the starting numbers before any data is sent.',
      uncertainWords: ['ISN'],
    },
    Q2: {
      transcription:
        'TCP is connection-oriented, reliable, ordered, with flow and congestion control, at the cost of overhead and latency from the handshake and ACKs. UDP is connectionless, best-effort, low overhead. Use TCP for HTTP and email, UDP for VoIP, DNS queries and gaming.',
      uncertainWords: ['VoIP'],
    },
    Q3: {
      transcription:
        'On a cache miss the resolver does an iterative lookup: it queries a root server, follows the referral to the TLD name server, then to the authoritative server for the domain, and returns the record. It caches the result for the duration of the TTL.',
      uncertainWords: [],
    },
  },
  {
    Q1: {
      transcription:
        'The handshake has three steps. First the client sends a SYN packet. Then the server sends an ACK to confirm it, and finally the server sends SYN-ACK so the connection opens. Each side picks a starting sequence number so the other can number and acknowledge the bytes. It is needed so both sides are synchronized before data is sent.',
      uncertainWords: [],
    },
    Q2: {
      transcription:
        'TCP sets up a connection and guarantees delivery with retransmissions, UDP does not and can lose packets. TCP has more overhead. TCP: web pages. UDP: video calls.',
      uncertainWords: [],
    },
    Q3: {
      transcription:
        'It forwards the query to a root server, then to the TLD server, then to the authoritative server, gets the IP and returns it. It stores it in its cache so the next lookup is fast.',
      uncertainWords: ['authoritative'],
    },
  },
];

@Injectable()
export class FakePaperTranscriber implements PaperTranscriber {
  transcribe(questionCodes: string[]): Record<string, TranscribedAnswer> {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const result: Record<string, TranscribedAnswer> = {};
    for (const code of questionCodes) {
      result[code] = template[code] ?? { transcription: '', uncertainWords: [] };
    }
    return result;
  }
}
