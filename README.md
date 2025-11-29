# Local development

- About use of mono repo

    `Used mono repo , just for keeping frontend and backend at one place , I was just thinking about completing the core working instead of getting into turbo complexities , i'll fix the orchestration later`

## Steps to run locally:

- after cloning the repo , run pnpm install 
- then navigate to core , run docker-compose up -d
- then run pnpm prisma migrate deploy and pnpm prisma generate
- then copy .env.example to .env and update .env file with your OPENAI_API_KEY and run pnpm start (this should start the server , and should log `Server running on port 8080`)
- then do go to mono/apps folder and run pnpm install (again , just to be sure) and run pnpm dev
- go to localhost:3000 
