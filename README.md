# Neuronix Agents Hub

NeuronixAI — Production Frontend Master Prompt

You are a senior product designer and senior frontend engineer building the production-grade frontend for NeuronixAI, an AI-powered multi-agent productivity and automation platform.

Do not treat this as a demo, template, or generic AI dashboard.

Build it as a real SaaS product that could be shown in a technical interview, portfolio, startup demo, or production environment.

1. PRODUCT CONTEXT

The product is called NeuronixAI.

NeuronixAI is designed around an AI multi-agent architecture where users can interact with AI agents that can understand tasks, plan work, use tools, execute actions, and return useful results.

The backend is already being developed separately using:

Java

Spring Boot

PostgreSQL

Flyway

Spring Security

REST APIs

Docker

BCrypt authentication

The frontend must therefore be designed as a serious client application for this backend.

Core product idea

A user should be able to:

Create an account.

Log in securely.

Access a personal AI workspace.

Interact with AI agents.

Create and manage tasks.

See agent activity and execution status.

Understand what the AI is doing.

Manage agents/tools/settings.

Review previous conversations and executions.

Eventually connect external tools and services.

The architecture should be prepared for the multi-agent functionality to expand over time.

2. IMPORTANT DEVELOPMENT PRINCIPLE

Do NOT invent backend functionality that does not exist.

The frontend should be architected so that API integrations are cleanly separated from UI components.

Create a dedicated API/service layer such as:

src/services/

or an equivalent clean architecture.

Keep:

API calls

authentication handling

state management

UI components

business logic

properly separated.

If an API endpoint does not yet exist, create a clearly isolated mock/service abstraction only where necessary, so it can later be replaced with the real Spring Boot endpoint without redesigning the UI.

Do not hardcode fake backend behavior throughout components.

3. TECHNOLOGY

Use a modern production-quality frontend stack.

Preferred:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui or equivalent high-quality component system

React Router

TanStack Query where appropriate

Lucide icons

Proper form validation

Responsive design

Use TypeScript strictly.

Avoid unnecessary dependencies.

The code must be:

modular

maintainable

reusable

strongly typed

scalable

production-oriented

4. VISUAL IDENTITY

NeuronixAI should look like a premium modern AI SaaS platform.

Do NOT make it look like:

a generic Bootstrap dashboard

a basic admin panel

a copied ChatGPT interface

a beginner React project

a template with excessive gradients

a cryptocurrency dashboard

an overly colorful AI website

The visual language should communicate:

Intelligence + Technology + Trust + Professionalism + Simplicity

Use a modern dark-first interface with excellent contrast and subtle visual depth.

Suggested visual direction:

deep charcoal / near-black background

slightly lighter cards and panels

subtle borders

restrained accent color

clean white/gray typography

subtle glow only where meaningful

rounded but not excessively rounded components

professional spacing

minimal visual noise

Use animations sparingly.

Animations should communicate:

state changes

agent execution

loading

transitions

success/failure

live activity

Do not use animations simply for decoration.

5. APPLICATION STRUCTURE

Create the following high-level application structure.

Public Pages

Landing Page

Create a premium SaaS landing page containing:

NeuronixAI logo/brand

concise product positioning

hero section

explanation of the multi-agent concept

key capabilities

agent workflow visualization

security/reliability messaging

CTA

login/signup navigation

footer

Hero messaging should communicate the concept of:

AI agents that plan, reason, use tools and execute work.

Avoid generic AI marketing language.

6. AUTHENTICATION

Create polished:

Login

Fields:

Email

Password

Include:

validation

loading state

API error state

invalid credentials state

show/hide password

remember session where appropriate

Registration

Fields:

Email

Password

Confirm Password

Include:

validation

password requirements

duplicate email handling

API errors

loading state

success state

Authentication should integrate with the existing Spring Boot backend.

The frontend must correctly handle:

200

201

400

401

403

409

500

Do not display raw backend errors to users.

Convert API errors into clean user-facing messages.

7. APPLICATION SHELL

After authentication, create the main application shell.

Desktop layout:

┌─────────────────────────────────────────────────────┐
│ Top Bar                                              │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│ Sidebar      │ Main Application Area               │
│              │                                      │
│              │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘


Sidebar

Include:

Dashboard

AI Workspace

Agents

Tasks

Activity

Conversations

Tools

Settings

At the bottom:

user profile

account email

logout

Sidebar should be collapsible.

On mobile, convert it into a drawer.

8. DASHBOARD

The dashboard is the user's main command center.

It should immediately answer:

"What is happening with my AI workspace?"

Include:

Welcome section

Example:

Good evening, Akash.

Then a concise statement about the workspace.

KPI cards

Examples:

Active Agents

Tasks Running

Tasks Completed

Recent Executions

These should be designed so real backend data can later replace mock data.

Active Agent section

Show currently active agents with:

agent name

status

current task

progress

last activity

Recent Activity

Timeline-style activity:

Agent started task
Agent used tool
Task completed
Agent requested input
Task failed


Quick Actions

Examples:

Start new task

Create agent

Open AI workspace

View activity

9. AI WORKSPACE

This is the most important screen.

Design it as the central interaction area of NeuronixAI.

The user should be able to submit a task to the AI system.

Example:

Research the latest competitors in the AI automation market and prepare a comparison.

The UI should feel like an AI command center, not merely a chatbot.

Recommended layout:

┌─────────────────────────────────────────────────────┐
│ Workspace Header                                    │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│ Agent / Execution    │ Main Conversation           │
│ Context              │                              │
│                      │                              │
│                      │                              │
├──────────────────────┴──────────────────────────────┤
│ Prompt / Task Input                                 │
└─────────────────────────────────────────────────────┘


10. AI TASK INPUT

Create a powerful task composer.

Features:

multiline input

send button

keyboard shortcut

attachment-ready architecture

agent selector

optional model selector architecture

tool selection architecture

execution mode

The UI should make the user feel like they are giving a task to an intelligent system rather than simply sending a chat message.

Example placeholder:

What would you like NeuronixAI to accomplish?

11. MULTI-AGENT EXECUTION VISUALIZATION

This is a major differentiating feature.

When a task executes, show the agent workflow visually.

Example:

User Task
   ↓
Planner Agent
   ↓
Research Agent
   ↓
Analysis Agent
   ↓
Writer Agent
   ↓
Final Result


Each agent should have:

name

role

status

current action

duration

result indicator

Statuses:

Pending

Thinking

Running

Waiting

Completed

Failed

Use subtle animated indicators during execution.

The user should be able to expand an agent and inspect its activity.

12. EXECUTION DETAILS

Create an execution/activity panel.

Example:

Execution #1024

Planner Agent
✓ Task understood

Research Agent
✓ Searching sources

Analysis Agent
● Processing information

Writer Agent
○ Waiting


Display:

execution ID

start time

duration

current status

participating agents

tools used

errors if any

Keep technical details available without overwhelming normal users.

Use expandable sections.

13. AGENTS PAGE

Create an agent management interface.

Each agent should be represented as a professional card.

Example:

Research Agent
────────────────
Research and gather information.

Status: Active

Capabilities:
Web Search
Summarization
Source Analysis

[Open Agent]


Include:

Create Agent

Edit Agent

Activate/Deactivate

View agent details

Agent detail page should contain:

Agent identity

Description

Role

Capabilities

Tools

Configuration

Recent executions

Performance/activity

Design the architecture so future backend agent configuration can easily plug into it.

14. TASKS PAGE

Create a task management screen.

Users should be able to view:

pending tasks

running tasks

completed tasks

failed tasks

Use tabs or filters.

Each task should display:

task title

status

assigned agent/agents

created time

updated time

execution duration

priority where applicable

Provide:

search

filtering

sorting

pagination-ready architecture

15. CONVERSATIONS

Create a conversation history screen.

Users should be able to:

search conversations

open previous conversations

see timestamps

see associated agents

continue a conversation

delete/archive where supported

Conversation UI should remain visually distinct from execution logs.

16. ACTIVITY

Create a centralized activity page.

Show an event timeline.

Examples:

10:42 PM
Research Agent completed execution

10:41 PM
Research Agent used Web Search

10:40 PM
Planner Agent created execution plan

10:39 PM
New task started


Support filtering by:

agent

task

event type

status

date

17. TOOLS

Create a tools/integrations section.

This should be architected for future integrations.

Examples:

Web Search

Browser

Email

Calendar

Database

GitHub

Slack

Do not claim that these integrations already exist.

Display unavailable integrations as:

Coming Soon

rather than pretending they work.

18. SETTINGS

Create professional settings pages.

Sections:

Account

email

profile information

Security

password

sessions

authentication settings

AI Preferences

default agent

execution preferences

response preferences

Notifications

task completion

task failure

agent activity

Appearance

theme

interface preferences

19. ERROR HANDLING

This is important.

Create reusable UI for:

API error

Never show:

AxiosError: Request failed with status code 401


Instead show:

Your session has expired. Please log in again.

For 409:

An account with this email already exists.

For 403:

You don't have permission to perform this action.

For 500:

Something went wrong on our side. Please try again.

Create reusable error handling utilities.

20. LOADING STATES

Do not leave blank screens while data loads.

Use:

skeleton loaders

button loading states

execution indicators

optimistic UI where appropriate

empty states

Every major page should have:

Loading state

Success state

Empty state

Error state

21. EMPTY STATES

Empty states should be useful.

Example:

Instead of:

No tasks.

Use:

No tasks yet. Give NeuronixAI something to accomplish.

With:

Create your first task →

22. RESPONSIVE DESIGN

The application must work properly on:

desktop

laptop

tablet

mobile

Do not simply shrink the desktop UI.

For mobile:

collapsible navigation

stacked cards

mobile-friendly task composer

horizontally scrollable data where necessary

readable execution timeline

accessible buttons

23. ACCESSIBILITY

Follow accessibility best practices.

Include:

semantic HTML

keyboard navigation

visible focus states

proper labels

sufficient contrast

ARIA where necessary

accessible dialogs

accessible dropdowns

accessible loading/status announcements where appropriate

24. COMPONENT ARCHITECTURE

Use reusable components.

Example:

src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── dashboard/
│   ├── agents/
│   ├── tasks/
│   ├── workspace/
│   ├── activity/
│   └── execution/
│
├── pages/
│   ├── Landing
│   ├── Login
│   ├── Register
│   ├── Dashboard
│   ├── Workspace
│   ├── Agents
│   ├── Tasks
│   ├── Conversations
│   ├── Activity
│   ├── Tools
│   └── Settings
│
├── services/
│   ├── api
│   ├── auth
│   ├── agents
│   ├── tasks
│   └── executions
│
├── hooks/
├── types/
├── utils/
├── stores/
└── routes/


Adapt this structure if a better architecture is appropriate.

25. API ARCHITECTURE

Create a centralized API client.

Example conceptual structure:

apiClient
   ↓
authService
agentService
taskService
executionService
conversationService


The backend base URL must come from environment configuration.

Example:

VITE_API_BASE_URL


Never hardcode production URLs.

Authentication must be handled centrally.

The frontend should be ready for the existing NeuronixAI Spring Boot APIs.

26. SECURITY

Follow frontend security best practices.

Do not:

expose secrets

hardcode API keys

store sensitive credentials in source code

trust frontend authorization

expose internal backend exceptions

Frontend authentication should complement backend security, not replace it.

27. STATE MANAGEMENT

Use local component state when appropriate.

Use server-state management for API data.

Avoid creating one giant global store.

Separate:

authentication state

UI state

server state

execution state

28. REAL-TIME READY ARCHITECTURE

The multi-agent execution experience will eventually need real-time updates.

Design the frontend so it can later support:

WebSockets

Server-Sent Events

streaming execution events

For now, polling/mock events may be used if the backend does not yet expose real-time APIs.

Do not tightly couple the UI to polling.

Create an abstraction such as:

ExecutionEventSource


so the implementation can later change from polling to WebSocket/SSE without redesigning the components.

29. DESIGN DETAILS

Use consistent:

spacing

typography

border radius

shadows

iconography

button hierarchy

form controls

status indicators

Create a small design system.

Do not randomly style each page.

The application should feel like one coherent product.

30. UX PRINCIPLE

The interface should always make the user understand:

What can I do?

What is the AI doing?

Why is it doing it?

What happened?

What should I do next?

This is especially important for multi-agent execution.

Never make users stare at an unexplained spinner.

31. DEMO DATA

Where backend APIs are not yet available, use realistic mock data behind a service abstraction.

Do NOT fill the application with obviously fake examples such as:

John Doe
Test Agent
Lorem Ipsum
Task 123


Use realistic NeuronixAI examples.

However, clearly structure the code so mock data can be replaced with real API responses.

32. DO NOT OVERBUILD

Do not implement fake functionality merely to make the application look complete.

For example:

Do not pretend that:

GitHub integration works

Email integration works

Web browsing works

AI model execution works

multi-agent orchestration works

unless the backend actually supports it.

Build the frontend architecture and UI for these capabilities while clearly marking future capabilities as unavailable/coming soon.

33. PROFESSIONAL PRODUCT DETAILS

Include polished details such as:

toast notifications

confirmation dialogs

command/quick-action interface where useful

keyboard shortcuts

hover states

disabled states

error boundaries

page transitions

breadcrumbs where useful

responsive dialogs

consistent status badges

Do not add features just for the sake of adding features.

Every element should have a UX purpose.

34. BRANDING

Use the name:

NeuronixAI

The visual identity should subtly communicate:

Neurons → Intelligence → Agents → Execution

Create a simple professional logo/mark using the existing brand name.

Avoid excessive brain/neuron illustrations.

The brand should feel suitable for a serious AI engineering company.

35. PERFORMANCE

Optimize for:

fast initial load

lazy-loaded routes where appropriate

minimal unnecessary renders

efficient API requests

caching server data

optimized assets

Do not sacrifice maintainability for premature optimization.

36. CODE QUALITY

Write production-quality code.

Avoid:

duplicated components

massive components

deeply nested conditionals

magic strings

hardcoded API URLs

unnecessary abstractions

any unless absolutely necessary

inline business logic everywhere

Use:

TypeScript interfaces/types

reusable hooks

reusable components

service classes/functions

clear naming

small focused components

37. FINAL UX GOAL

When someone opens NeuronixAI, they should immediately understand:

"This is a serious AI agent platform."

The product should feel closer to a combination of:

modern AI workspace

developer platform

intelligent task manager

multi-agent orchestration console

rather than a normal CRUD application.

The dashboard should communicate AI activity and execution, not merely database records.

38. IMPLEMENTATION ORDER

Build in this order:

Phase 1

project setup

design system

routing

application shell

responsive navigation

Phase 2

landing page

login

registration

authentication integration

Phase 3

dashboard

reusable cards

activity components

task components

Phase 4

AI Workspace

task composer

conversation UI

execution visualization

Phase 5

Agents

Tasks

Conversations

Activity

Phase 6

Tools

Settings

profile

security UI

Phase 7

loading/error/empty states

accessibility

responsive refinement

performance

final visual polish

39. IMPORTANT INSTRUCTION TO THE AI CODING AGENT

Before writing large amounts of code:

Inspect the existing project structure.

Identify the current frontend framework and dependencies.

Do not unnecessarily replace an existing working setup.

Inspect the backend/API contract if available.

Reuse existing components where appropriate.

Create a clean architecture before implementing individual screens.

Keep API integration isolated.

Do not invent backend endpoints.

Use mock services only where backend functionality is genuinely unavailable.

Make the application runnable after every major phase.

Do not ask me to describe every screen individually.

Use the product requirements above to make sensible senior-level UX and engineering decisions.

If a minor implementation detail is unspecified, choose the option that is most consistent with a production-grade SaaS application.

40. DEFINITION OF DONE

The frontend is considered complete only when:

the application runs successfully

authentication screens work

protected routes work

dashboard is polished

AI workspace is polished

multi-agent execution UI exists

agent management exists

task management exists

conversation history exists

activity timeline exists

tools/integrations area exists

settings exists

API architecture is clean

responsive design works

loading states exist

error states exist

empty states exist

accessibility basics are covered

no obvious placeholder/template UI remains

no fake functionality is presented as real

code is modular and maintainable

environment configuration is used for API URLs

The final result should look like a real, premium AI SaaS product, not a generated frontend template.

Start by inspecting the existing repository and then implement the frontend systematically.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6c986e1-63a6-4de7-90ed-0dfaf24d1543).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
