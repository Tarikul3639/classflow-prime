# ClassFlow Prime

**ClassFlow Prime** is a scalable education management platform designed to centralize all class operations into a clean, structured, and digital workspace. It streamlines communication, updates, exams, viva schedules, member management, and group coordination — making academic management efficient and collaborative.

[![Live Site](https://img.shields.io/badge/Live%20Demo-Visit-blue?style=flat-square)](https://classflow-prime.vercel.app/)

## Features
- Class Updates: announcements, materials, comments
- Exam & Assessment Management
- Member & Role Management
- Group Coordination
- Notifications & Reminders

## Tech Stack
- Frontend: React, TypeScript, Next.js, Tailwind CSS, Motion.dev
- Backend: Node.js, NestJS, RESTful APIs
- Database: MongoDB
- Media: Cloudinary
- State Management: Redux
- Deployment: Vercel (frontend, backend), MongoDB Atlas (database)

## Getting Started
1. Clone repo: `git clone https://github.com/Tarikul3639/classflow-prime.git`
2. Install dependencies: `npm install`
3. Set environment variables: copy `.env.example` to `.env` and fill in the values
4. Run dev server: `npm run dev`

## Commit Convention
This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.

| Type | Description | Release | Version Change |
|------|-------------|---------|----------------|
| `feat(web): ...` | New feature in frontend | `web-v` minor bump | `1.0.0 → 1.1.0` |
| `feat(server): ...` | New feature in backend | `server-v` minor bump | `1.0.0 → 1.1.0` |
| `fix(web): ...` | Bug fix in frontend | `web-v` patch bump | `1.0.0 → 1.0.1` |
| `fix(server): ...` | Bug fix in backend | `server-v` patch bump | `1.0.0 → 1.0.1` |
| `feat(web)!: ...` | Breaking change in frontend | `web-v` major bump | `1.0.0 → 2.0.0` |
| `feat(server)!: ...` | Breaking change in backend | `server-v` major bump | `1.0.0 → 2.0.0` |
| `chore: ...` | Maintenance, no release | — | no change |
| `docs: ...` | Documentation only | — | no change |

### Examples
```bash
git commit -m "feat(server): add email verification endpoint"
git commit -m "fix(web): fix notification bell not updating"
git commit -m "feat(web)!: redesign dashboard layout"
git commit -m "chore: update dependencies"
```

## License
MIT License