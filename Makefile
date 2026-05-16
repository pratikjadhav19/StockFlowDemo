.PHONY: install migrate seed dev-backend dev-frontend dev build up down

install:
	cd backend && npm install
	cd frontend && npm install

migrate:
	cd backend && npx prisma migrate dev

seed:
	cd backend && node prisma/seed.js

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm run build

up:
	cd deployment && docker-compose up -d

down:
	cd deployment && docker-compose down
