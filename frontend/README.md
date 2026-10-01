# Fair-Grade Frontend

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev                  # http://localhost:3000
```

## Structure & ownership

```
app/
├── layout.tsx                 Γιώργος   shared shell, role-based top bar
├── page.tsx                   Γιώργος   instructor → /upload | ta → /ta | logged out → /login
├── login/page.tsx             Γιώργος   POST /auth/login (#3)
├── upload/page.tsx            Σταύρος   #4 #5 #6 #7 #8 #9 #10 #11 #12 #13
├── dashboard/page.tsx         Δημήτρης  #4 #7 #15
├── dashboard/[taId]/page.tsx  Δημήτρης  #4 #7 #14 #15
└── ta/page.tsx                Δημήτρης  #4 #7 #8 #10 #11 #12
lib/
├── api.ts                     Γιώργος   apiFetch — base URL, bearer token, JSON, errors, 401 → /login
└── auth.ts                    Γιώργος   login / logout / getCurrentUser / useRequireRole
mocks/
├── dashboard.ts               Δημήτρης  #14 / #15 sample responses
└── upload.ts                  Σταύρος   upload-flow sample responses
```

Pages call `apiFetch` from `lib/api.ts` and guard with `useRequireRole` from `lib/auth.ts` — do not reimplement fetch/auth per page. Endpoint numbers refer to `DOCS/API_SPEC.md`.
