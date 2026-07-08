# Architecture

RecipeChef AI uses a modern, client-side React frontend communicating with Back4App (for database/authentication) and Trussed.ai (for AI completions).

## System Flow Diagram

```mermaid
graph TD
    User([User]) <--> |Interacts with UI| FE[React Frontend]
    
    subgraph Frontend [Vite React Client]
        FE <--> AC[Auth Context]
        FE <--> DG[Dashboard Grid View]
        DG <--> AI[AI Utilities]
    end
    
    subgraph Back4App [Backend-as-a-Service]
        AC <--> |Session & Credential Check| USR[(User Class)]
        DG <--> |Owner-Filtered Recipe CRUD| REC[(Recipe Class)]
    end

    subgraph AI Service [FAU Trussed.ai]
        AI <--> |Recipe Prompting & Lists| GPT[gpt-5.4 completions]
    end

    style FE fill:#1e293b,stroke:#ff7a30,stroke-width:2px,color:#fff
    style Back4App fill:#0f172a,stroke:#3b82f6,stroke-width:1px,color:#fff
    style AI Service fill:#0f172a,stroke:#10b981,stroke-width:1px,color:#fff
```


## Frontend

The frontend is built with React and Vite.

Responsibilities:

- Show pages and forms
- Manage login state
- Call Back4App REST API
- Call Trussed.ai AI API
- Display loading and error messages

## Back4App

Back4App is used for:

- User registration
- Login
- Session token storage
- Recipe database

## Trussed.ai

Trussed.ai is used for:

- Recipe generation
- Shopping list generation

## Security Notes

Environment variables are stored in `frontend/.env`.

The `.env` file is ignored by Git and should not be committed.