# Intended Scores

The "correct" score for each answer on each criterion, decided by the dataset author. The fair TAs' grades are based on these, and they are what the AI's scores should be checked against after the first grading run.

Criteria (max points):
- **C1** - Correctly names all 3 steps in order (SYN, SYN-ACK, ACK) (3)
- **C2** - Explains what sequence numbers are used for in the handshake (3)
- **C3** - States why a handshake is needed before data transfer (reliability/sync) (2)
- **C4** - Answer is clearly organized and easy to follow (2)

## Per answer

| Student | Type | C1 | C2 | C3 | C4 | Total | Graded by | TA scores | Note |
|---|---|---|---|---|---|---|---|---|---|
| student_001 | excellent | 3 | 3 | 2 | 2 | 10 | Maria | 3, 3, 2, **0.5** | C4 -1.5 (bias) |
| student_002 | weak | 0.5 | 0 | 0.5 | 1 | 2 | Nikos | 0.5, 0, 0.5, 1 | exact |
| student_003 | right content, disorganized | 3 | 2.5 | 2 | 0.5 | 8 | Eleni | 3, 2.5, 2, 0.5 | exact; steps named but out of order in the text |
| student_004 | ambiguous: steps in wrong order | 1 | 1.5 | 1.5 | 1.5 | 5.5 | Maria | 1, 1.5, 1.5, **0.5** | C4 -1 (bias) |
| student_005 | steps only, no "why" | 3 | 1.5 | 0 | 2 | 6.5 | Nikos | 3, **2**, 0, 2 | C2 +0.5 (occasional) |
| student_006 | confidently wrong (TLS) | 0 | 0 | 0 | 1.5 | 1.5 | Eleni | 0, 0, 0, 1.5 | exact |
| student_007 | ambiguous: right idea, wrong terms | 1.5 | 2.5 | 2 | 1.5 | 7.5 | Maria | 1.5, 2.5, 2, **0** | C4 -1.5 (bias) |
| student_008 | excellent | 3 | 3 | 2 | 2 | 10 | Nikos | 3, 3, 2, 2 | exact |
| student_009 | steps right, shallow | 3 | 1 | 0 | 2 | 6 | Eleni | 3, 1, 0, 2 | exact |
| student_010 | ambiguous: confuses with ports | 1.5 | 0 | 1 | 1.5 | 4 | Maria | 1.5, 0, 1, **0** | C4 -1.5 (bias) |
| student_011 | weak: two steps only | 1 | 0.5 | 0.5 | 1.5 | 3.5 | Nikos | 1, 0.5, **1**, 1.5 | C3 +0.5 (occasional) |
| student_012 | ambiguous: mixes in connection close | 3 | 1.5 | 0.5 | 1 | 6 | Eleni | 3, 1.5, 0.5, 1 | exact |
| student_013 | steps right, seq. numbers only mentioned | 3 | 1 | 2 | 2 | 8 | Maria | 3, 1, 2, **0.5** | C4 -1.5 (bias) |
| student_014 | strong content, run-on sentence | 3 | 3 | 1.5 | 0.5 | 8 | Nikos | 3, **2.5**, 1.5, 0.5 | C2 -0.5 (occasional) |
| student_015 | ambiguous: only the "why" | 0 | 0 | 2 | 1.5 | 3.5 | Eleni | 0, 0, 2, 1.5 | exact |
| student_016 | excellent | 3 | 3 | 2 | 2 | 10 | Maria | 3, 3, 2, **1** | C4 -1 (bias) |
| student_017 | ambiguous: says UDP also handshakes | 3 | 2 | 0 | 1.5 | 6.5 | Nikos | 3, 2, 0, 1.5 | exact |
| student_018 | excellent, slightly weaker "why" | 3 | 3 | 1.5 | 2 | 9.5 | Eleni | 3, 3, 1.5, 2 | exact |

## Split

- **Maria Papadaki**: 001, 004, 007, 010, 013, 016
- **Nikos Georgiou**: 002, 005, 008, 011, 014, 017
- **Eleni Markou**: 003, 006, 009, 012, 015, 018

## Planted bias

**Maria is systematically stricter on C4 ("Answer is clearly organized and easy to follow").** On every answer she grades she gives 1-1.5 points less than intended. Her average C4 gap is **-1.33** against a flag threshold of 0.3 (15% of 2 points), across 6 answers. She grades C1-C3 exactly at the intended scores.

Nikos and Eleni are fair. Nikos is off by 0.5 on three single cells (avg gaps: C2 0.00, C3 +0.08); Eleni matches exactly. Every gap other than Maria's C4 stays far below the threshold (0.45 for 3-point criteria, 0.3 for 2-point criteria).

**Caveat:** flags compare TA grades with the AI's grades, not with this table. After the first AI grading run, compare the AI's scores against this table; if the AI differs a lot on a criterion, a fair TA may get flagged.
