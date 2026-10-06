LifeLog — Personal Experience Tracker
Complete Development Roadmap
Project Type: Data Structures & Algorithms Academic ProjectCurrent Stage: Foundation CompleteBackend: Java 21 + Spring Boot + MavenFrontend: React + Vite + Tailwind CSSDatabase: PostgreSQLDSA Language: JavaProject Status: 🟢 Foundation Complete

1. Project Vision
LifeLog is a personal experience management system that allows users to record, organize, search, revisit, and analyze meaningful experiences.
Examples include:
Projects
Internships
Hackathons
Competitions
Workshops
Achievements
College events
Personal milestones
Learning experiences
The project is primarily designed as a DSA academic project.
The application must therefore demonstrate that custom data structures and algorithms are being used for meaningful application operations rather than being added only for demonstration.

2. Primary Objectives
Functional Objectives
The application should allow users to:
Create experiences
View experiences
Edit experiences
Delete experiences
Search experiences
Filter experiences
Sort experiences
Categorize experiences
Rate experiences
Add tags
View experience timelines
View recently visited experiences
Manage pending experiences
View important/high-rated experiences
View analytics
Revisit old memories
DSA Objectives
The application must implement and meaningfully use:
Custom Linked List
Custom Stack
Custom Queue
Binary Search Tree
Priority Queue using Heap
All core implementations must be written manually in Java.

3. Technology Stack
Backend
Java 21
Spring Boot
Maven
Spring Web
Spring Data JPA
Bean Validation
Database
PostgreSQL
Frontend
React
Vite
Tailwind CSS
JavaScript
Communication
REST API
JSON
Version Control
Git
GitHub

4. Current Project Structure
Personal Experience/
│
├── server/
│   ├── pom.xml
│   │
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── lifelog/
│           │           ├── LifeLogApplication.java
│           │           │
│           │           ├── controller/
│           │           │   ├── HealthController.java
│           │           │   └── ExperienceController.java
│           │           │
│           │           ├── service/
│           │           │   └── ExperienceService.java
│           │           │
│           │           ├── repository/
│           │           │   └── ExperienceRepository.java
│           │           │
│           │           ├── model/
│           │           │   └── Experience.java
│           │           │
│           │           ├── dto/
│           │           │   ├── ExperienceRequestDTO.java
│           │           │   └── HealthResponseDTO.java
│           │           │
│           │           └── dsa/
│           │               ├── linkedlist/
│           │               ├── stack/
│           │               ├── queue/
│           │               ├── bst/
│           │               └── priorityqueue/
│           │
│           └── resources/
│               ├── application.properties
│               ├── application-dev.properties
│               └── schema.sql
│
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    │
    └── src/
        ├── App.jsx
        ├── index.css
        │
        ├── services/
        │   └── api.js
        │
        └── components/
            ├── Navbar.jsx
            ├── Sidebar.jsx
            ├── Dashboard.jsx
            ├── ExperienceList.jsx
            └── AddExperience.jsx

5. DEVELOPMENT PHASES
The project will be developed in the following order.
PHASE 0  → Foundation              ✅ COMPLETE
PHASE 1  → DSA Core                ⬜
PHASE 2  → DSA Integration         ⬜
PHASE 3  → Complete Experience API ⬜
PHASE 4  → Frontend Expansion      ⬜
PHASE 5  → Analytics & Intelligence⬜
PHASE 6  → UX/UI Polish             ⬜
PHASE 7  → Testing & Optimization  ⬜
PHASE 8  → Documentation           ⬜
PHASE 9  → Final Demo Preparation  ⬜

PHASE 0 — FOUNDATION
Status: ✅ COMPLETE
Completed
Spring Boot project initialized
Maven configured
Java 21 configured
PostgreSQL configured
H2 development profile configured
React + Vite initialized
Tailwind configured
Backend port configured to 8085
Vite proxy configured
PostgreSQL schema created
Experience JPA entity created
Repository created
Service layer created
Controller layer created
Health API created
Experience REST API created
Frontend shell created
Backend/frontend build verified
DSA package hierarchy created
Verification
Backend:
GET /api/health
Expected:
{
  "status": "ok",
  "application": "LifeLog"
}
Frontend:
http://localhost:5173
Backend:
http://localhost:8085

PHASE 1 — JAVA DSA CORE
Goal
Implement every required data structure manually in Java before deeply integrating them with the application.
This phase is the academic heart of the project.

1. Experience Model for DSA
Create a lightweight DSA-friendly representation of an experience.
Possible fields:
id
title
category
date
rating
importance
Do not tightly couple the DSA classes to JPA entities if unnecessary.
Prefer a clean separation:
JPA Entity
     ↓
DTO / DSA Model
     ↓
Custom Data Structures

2. Custom Linked List
Location:
com.lifelog.dsa.linkedlist
Create:
ExperienceNode
CustomLinkedList
Required operations:
insertAtBeginning()
insertAtEnd()
insertAtPosition()
deleteById()
searchById()
traverse()
size()
isEmpty()
clear()
Primary application purpose
Experience timeline.
Example:
HEAD
 ↓
[Hackathon]
 ↓
[Internship]
 ↓
[Workshop]
 ↓
[Competition]
 ↓
NULL
Complexity
Operation
Complexity
Insert at beginning
O(1)
Insert at end
O(n) or O(1) with tail
Search
O(n)
Delete
O(n)
Traversal
O(n)

3. Custom Stack
Location:
com.lifelog.dsa.stack
Create:
StackNode
ExperienceStack
Required operations:
push()
pop()
peek()
isEmpty()
size()
clear()
Primary application purpose
Recently viewed experiences.
Example:
TOP
 ↓
Workshop
Internship
Hackathon
 ↓
BOTTOM
Complexity
Operation
Complexity
Push
O(1)
Pop
O(1)
Peek
O(1)
Search
O(n)

4. Custom Queue
Location:
com.lifelog.dsa.queue
Create:
QueueNode
ExperienceQueue
Required operations:
enqueue()
dequeue()
peek()
isEmpty()
size()
clear()
Primary application purpose
Pending experiences that need to be fully documented.
Example:
FRONT
 ↓
Experience A
Experience B
Experience C
 ↓
REAR
Complexity
Operation
Complexity
Enqueue
O(1)
Dequeue
O(1)
Peek
O(1)
Search
O(n)

5. Binary Search Tree
Location:
com.lifelog.dsa.bst
Create:
BSTNode
ExperienceBST
Use experience ID as the primary search key.
Required operations:
insert()
search()
delete()
inorderTraversal()
preorderTraversal()
postorderTraversal()
findMin()
findMax()
height()
isEmpty()
Example:
              50
            /    \
          25      75
         /  \    /  \
       10   40  60   90
Primary application purpose
Fast experience lookup by numeric key.
Complexity
Average:
Search  → O(log n)
Insert  → O(log n)
Delete  → O(log n)
Worst case:
O(n)
The project documentation must explicitly explain this distinction.

6. Priority Queue / Max Heap
Location:
com.lifelog.dsa.priorityqueue
Create:
ExperienceMaxHeap
Implement manually using an array.
Required operations:
insert()
extractMax()
peek()
isEmpty()
size()
heapify()
Priority should be determined using experience importance/rating.
Example:
5 ⭐ Hackathon
5 ⭐ Internship
4 ⭐ Workshop
3 ⭐ College Event
Primary application purpose
Show the user's most important experiences.
Complexity
Operation
Complexity
Insert
O(log n)
Extract Max
O(log n)
Peek
O(1)
Build Heap
O(n)

PHASE 1 TESTING REQUIREMENT
Every DSA structure must have dedicated tests.
Test:
Empty structure
Single element
Multiple elements
Duplicate values
Invalid search
Delete first element
Delete last element
Delete middle element
Overflow/underflow where relevant
Large input
Use JUnit.
Do not proceed to integration until the DSA tests pass.

PHASE 2 — DSA INTEGRATION
Goal
Connect the custom Java structures to actual LifeLog functionality.
The DSA structures must not remain isolated demonstration classes.

Linked List Integration
Create:
TimelineService
Responsibilities:
Load experiences
Build chronological linked list
Traverse timeline
Search timeline
Delete timeline entry
API example:
GET /api/experiences/timeline

Stack Integration
Create:
RecentlyViewedService
Whenever a user opens an experience:
experience → push()
When requesting recent history:
stack → pop/peek/traverse
API:
GET /api/experiences/recent

Queue Integration
Create:
PendingExperienceService
Operations:
enqueue pending experience
dequeue completed experience
peek next pending experience
API:
GET /api/experiences/pending
POST /api/experiences/pending
DELETE /api/experiences/pending/{id}

BST Integration
Create:
ExperienceSearchService
Use BST to provide numeric ID-based lookup.
API:
GET /api/experiences/search/id/{id}
The service must actually use the custom BST.

Priority Queue Integration
Create:
ExperienceRankingService
Use Max Heap/Priority Queue to retrieve top experiences.
API:
GET /api/experiences/top
Return:
Top 5 experiences
ordered by importance/rating.

PHASE 3 — COMPLETE EXPERIENCE API
Goal
Make the backend production-like and robust.
Required endpoints
GET     /api/experiences
POST    /api/experiences
GET     /api/experiences/{id}
PUT     /api/experiences/{id}
DELETE  /api/experiences/{id}
Search
GET /api/experiences/search?query=
Filter
GET /api/experiences/category/{category}
GET /api/experiences/rating/{rating}
Sorting
Support:
date ascending
date descending
rating ascending
rating descending
Validation
Validate:
title       → required
category    → required
description → reasonable length
date        → valid date
rating      → 1–5
Return meaningful HTTP errors.

PHASE 4 — FRONTEND EXPANSION
Goal
Turn the current frontend shell into the complete LifeLog application.

Dashboard
Display:
Total Experiences
Projects
Competitions
Workshops
Achievements
Average Rating
Also show:
Recent experiences
Top experiences
Timeline preview
Pending experiences

Experiences Page
Features:
Search
Category filter
Rating filter
Date sorting
Cards
Pagination if required
Each experience card should provide:
View
Edit
Delete

Add Experience
Fields:
Title
Category
Description
Location
Date
Rating
Tags
Validation must happen on both frontend and backend.

Experience Details
Display:
Title
Category
Date
Location
Rating
Description
Tags
When this page is opened:
Push experience into Recently Viewed Stack

Edit Experience
Allow users to modify:
Title
Category
Description
Location
Date
Rating
Tags

Delete Experience
Before deleting:
Confirm deletion
After deletion:
Update database
Update relevant DSA structures
Refresh UI

PHASE 5 — ANALYTICS & SIGNATURE FEATURES
This phase makes the project feel like a real application.

Analytics Dashboard
Show:
Total Experiences
Average Rating
Most Common Category
Most Active Month
Highest Rated Experience
Category distribution:
Projects
Hackathons
Internships
Workshops
Achievements
Events
Other

Top Experiences
Use the custom Max Heap.
Display:
🏆 Top Experiences

1. Hackathon       ⭐⭐⭐⭐⭐
2. Internship      ⭐⭐⭐⭐⭐
3. Project         ⭐⭐⭐⭐⭐
4. Workshop        ⭐⭐⭐⭐
5. Competition     ⭐⭐⭐⭐
Clearly mention in the UI/documentation:
Powered by Custom Max Heap

Memory Lane
Signature LifeLog feature.
Find experiences from:
same day
previous month/year
Example:
ON THIS DAY

1 YEAR AGO

🏆 Smart India Hackathon

"You participated in your first major hackathon."

[View Memory]

Experience Timeline
Use the custom Linked List.
Visualize:
2026

● September
│
├── Hackathon
│
● August
│
├── Internship
│
● July
│
└── Workshop

Recently Viewed
Use custom Stack.
Example:
Recently Viewed

1. Hackathon
2. Internship
3. Workshop
4. Project
5. Competition

Pending Experiences
Use custom Queue.
Example:
Pending Documentation

1. College Event
2. Workshop
3. Competition

Next:
College Event

PHASE 6 — UX/UI POLISH
Only begin this phase after functionality is stable.
Design goals
Modern
Minimal
Professional
Responsive
Academic but polished
Add
Dark mode
Toast notifications
Loading states
Empty states
Error states
Confirmation dialogs
Smooth transitions
Responsive mobile layout
Avoid excessive animations.

PHASE 7 — SECURITY & QUALITY
Before final submission:
Backend
Check:
Input validation
SQL injection protection through JPA
Exception handling
CORS configuration
Environment variables
No hardcoded secrets
Proper HTTP status codes
Frontend
Check:
Form validation
API error handling
Loading states
Network failure handling
No exposed secrets

PHASE 8 — TESTING
Testing must cover both application functionality and DSA.

DSA Testing
Linked List
insert
delete
search
traverse
empty list
single node
multiple nodes
Stack
push
pop
peek
empty stack
multiple elements
Queue
enqueue
dequeue
peek
empty queue
FIFO verification
BST
insert
search
delete leaf
delete one-child node
delete two-child node
traversals
Priority Queue
insert
peek
extractMax
heapify
priority ordering

Integration Testing
Verify:
Create Experience
       ↓
Database
       ↓
DSA structures updated
       ↓
API
       ↓
Frontend
Test:
Add
View
Edit
Delete
Search
Filter
Recently viewed
Timeline
Top experiences
Pending experiences

PHASE 9 — PERFORMANCE & COMPLEXITY
Document the complexity of every major operation.
Required table
Structure
Operation
Complexity
Linked List
Insert Beginning
O(1)
Linked List
Search
O(n)
Stack
Push
O(1)
Stack
Pop
O(1)
Queue
Enqueue
O(1)
Queue
Dequeue
O(1)
BST
Search Average
O(log n)
BST
Search Worst
O(n)
BST
Insert Average
O(log n)
Max Heap
Insert
O(log n)
Max Heap
Extract Max
O(log n)
Max Heap
Peek
O(1)

PHASE 10 — DOCUMENTATION
Create:
README.md
PROJECT_REPORT.md
DSA_DOCUMENTATION.md
API_DOCUMENTATION.md

README.md
Include:
Project title
Description
Features
Tech stack
DSA used
Architecture
Installation
Database setup
Running instructions
Screenshots
API endpoints
Future improvements

DSA_DOCUMENTATION.md
For each data structure include:
1. Definition
2. Why selected
3. Application use
4. Data structure design
5. Algorithm
6. Java implementation
7. Time complexity
8. Space complexity
9. Example
10. Test cases

API_DOCUMENTATION.md
Document:
Endpoint
Method
Purpose
Request
Response
Status codes
Example

PHASE 11 — FINAL ACADEMIC DELIVERABLES
Prepare:
Project Report
Sections:
Abstract
Introduction
Problem Statement
Objectives
Existing System
Proposed System
Technology Stack
System Architecture
Database Design
DSA Selection
DSA Algorithms
Implementation
Screenshots
Testing
Complexity Analysis
Results
Limitations
Future Scope
Conclusion
References

PHASE 12 — VIVA PREPARATION
Prepare answers for:
General
Why did you select this project?
What problem does LifeLog solve?
Why is this a DSA project?
Why Java?
Why Spring Boot?
Why PostgreSQL?
Linked List
Why linked list?
Array vs linked list?
Why insertion at head is O(1)?
How is deletion performed?
Stack
What is LIFO?
Why use stack for recent history?
Stack overflow/underflow?
Queue
What is FIFO?
Why queue for pending experiences?
Circular queue vs normal queue?
BST
Why BST?
What happens if BST becomes skewed?
Average vs worst-case complexity?
BST vs binary tree?
Heap
Why priority queue?
Why max heap?
How does heapify work?
Why insertion is O(log n)?
Backend
What is REST?
What is dependency injection?
What is JPA?
What is ORM?
What is an HTTP status code?
Database
Primary key?
Foreign key?
Index?
Normalization?
Why PostgreSQL?

DEVELOPMENT RULES
These rules apply throughout the project.
Rule 1 — DSA First
Do not add a data structure unless it has a meaningful application purpose.
Rule 2 — Custom Implementation
Do not replace required DSA implementations with:
java.util.Stack
java.util.Queue
java.util.PriorityQueue
TreeMap
TreeSet
when demonstrating the corresponding structure.
Rule 3 — Understand Every DSA
The developer must be able to explain every implemented DSA during viva.
Rule 4 — Avoid Overengineering
Do not add:
AI chatbot
Social networking
Messaging
Payment
Complex recommendation engine
Unnecessary microservices
Kubernetes
Redis
Docker unless later required
Rule 5 — Test Before Expanding
A phase must work before moving to the next phase.
Rule 6 — Preserve Working Features
Do not rewrite working modules unnecessarily.
Rule 7 — Small Commits
Use meaningful Git commits.
Examples:
feat: add custom linked list
feat: add experience timeline service
feat: implement experience search BST
feat: add analytics dashboard
fix: resolve experience deletion bug
test: add BST unit tests
docs: add DSA complexity analysis

GIT MILESTONES
Recommended commit milestones:
1. chore: initialize LifeLog foundation
2. feat: implement custom linked list
3. feat: implement custom stack
4. feat: implement custom queue
5. feat: implement binary search tree
6. feat: implement max heap priority queue
7. test: add DSA unit tests
8. feat: integrate linked list timeline
9. feat: integrate recent experience stack
10. feat: integrate pending queue
11. feat: integrate BST search
12. feat: integrate priority ranking
13. feat: complete experience CRUD
14. feat: add analytics dashboard
15. feat: add memory lane
16. feat: polish LifeLog UI
17. test: complete integration testing
18. docs: complete project documentation
19. docs: prepare final academic submission

FINAL APPLICATION FLOW
The intended final system should work approximately like this:
                    USER
                      │
                      ▼
                 React UI
                      │
                  REST API
                      │
                      ▼
              Spring Boot
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
      PostgreSQL   DSA Engine   Analytics
                      │
        ┌─────────────┼──────────────┐
        │             │              │
        ▼             ▼              ▼
   Linked List      Stack          Queue
   Timeline         Recent         Pending
        │
        ├───────────────┐
        ▼               ▼
       BST          Max Heap
    ID Search       Top Experiences

FINAL SUCCESS CRITERIA
LifeLog is considered complete only when:
Spring Boot backend works
React frontend works
PostgreSQL works
CRUD works
Custom Linked List implemented
Custom Stack implemented
Custom Queue implemented
Custom BST implemented
Custom Max Heap implemented
All DSA structures have unit tests
DSA structures are integrated into real application features
Search works
Filtering works
Timeline works
Recently viewed works
Pending queue works
Top experiences works
Analytics works
Memory Lane works
Validation works
Error handling works
Responsive UI works
Complexity analysis documented
API documented
README completed
Project report completed
Viva questions prepared
Final demo tested

CURRENT STATUS
PHASE 0  Foundation             ████████████████████ 100% ✅

PHASE 1  DSA Core               ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 2  DSA Integration        ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 3  Complete API           ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 4  Frontend               ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 5  Analytics              ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 6  UI Polish              ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 7  Security & Quality     ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 8  Testing                ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 9  Optimization           ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 10 Documentation          ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 11 Final Submission       ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 12 Viva Preparation       ░░░░░░░░░░░░░░░░░░░░   0%
NEXT ACTION
Proceed to PHASE 1 — JAVA DSA CORE.
Do not begin UI expansion or advanced application features until the five custom Java data structures have been implemented and unit tested.
The next implementation sequence is:
1. Experience DSA Model
2. Linked List
3. Stack
4. Queue
5. Binary Search Tree
6. Max Heap / Priority Queue
7. JUnit Tests
8. Review and integration
The goal is not simply to finish the application. The goal is to build an application where the DSA implementation is visible, meaningful, explainable, and academically defensible.
🤖 ANTIGRAVITY EXECUTION PROTOCOL
This roadmap is the single source of truth for the LifeLog project.
When the developer gives a command such as:
Start Phase 1
or:
Start Phase 2
Antigravity must execute the corresponding phase defined in this roadmap.

COMMAND FORMAT
The developer may use:
Start Phase 1
Start Phase 2
Start Phase 3
...
or:
Continue to Phase 1
Continue to Phase 2
The developer may also specify a subtask:
Start Phase 1 — Linked List
or:
Continue Phase 1 from Stack

EXECUTION RULES
When a phase is requested, follow this process.
STEP 1 — READ THE ROADMAP
Before making any changes:
Read ROADMAP.md.
Identify the requested phase.
Identify all tasks belonging to that phase.
Check the current project state.
Determine which tasks are already completed.
Do not recreate or overwrite working implementations unnecessarily.

STEP 2 — INSPECT EXISTING CODE
Before writing code:
Inspect the relevant existing files.
Understand the current architecture.
Check dependencies.
Check existing tests.
Check related services/controllers.
Check whether the requested functionality already exists.
Never assume the project is empty.

STEP 3 — CREATE AN IMPLEMENTATION PLAN
Before modifying the project, internally determine:
Files to create
Files to modify
Files to remove
Dependencies required
Tests required
Integration points
Do not introduce unnecessary architecture.

STEP 4 — IMPLEMENT ONLY THE REQUESTED PHASE
If the developer says:
Start Phase 1
implement Phase 1 only.
Do NOT automatically begin:
Phase 2
Phase 3
UI expansion
Analytics
Authentication
Extra features
unless they are explicitly required by the current phase.

STEP 5 — FOLLOW THE DSA REQUIREMENTS
The DSA implementations must be:
Written in Java
Manually implemented
Readable
Testable
Properly encapsulated
Meaningfully used by the application
Do NOT replace custom implementations with Java built-in equivalents.
For example, do NOT replace:
CustomStack
with:
java.util.Stack
or:
CustomQueue
with:
java.util.Queue
or:
ExperienceMaxHeap
with:
java.util.PriorityQueue
The custom implementation is part of the academic requirement.

STEP 6 — TEST EVERYTHING
After implementation:
Compile the backend.
Run unit tests.
Run integration tests where applicable.
Verify the frontend if the phase affects it.
Verify APIs if the phase affects them.
Check for regressions.
Never mark a task complete simply because the code was written.
It must be tested.

STEP 7 — FIX ERRORS
If compilation or tests fail:
Identify the root cause.
Fix the issue.
Re-run the relevant tests.
Continue until the implementation is stable.
Do not hide or ignore errors.

STEP 8 — UPDATE THE ROADMAP
After completing a phase:
Update the corresponding checklist.
For example:
PHASE 1 — JAVA DSA CORE

- [x] Experience DSA Model
- [x] Custom Linked List
- [x] Custom Stack
- [x] Custom Queue
- [x] Binary Search Tree
- [x] Max Heap
- [x] JUnit Tests
Also update the progress percentage.

STEP 9 — CREATE A GIT COMMIT
If Git is configured, create a meaningful commit after a stable phase.
Example:
feat: implement custom Java DSA core
Do not create commits for broken intermediate states.

STEP 10 — FINAL REPORT
After finishing the requested phase, provide a concise report containing:
Completed
List everything implemented.
Files Created
List newly created files.
Files Modified
List modified files.
Tests
Show:
Tests run:
Passed:
Failed:
Verification
State whether:
Backend compilation: PASS/FAIL
Tests: PASS/FAIL
Frontend: PASS/FAIL
API: PASS/FAIL
Issues
List unresolved issues, if any.
Next Phase
State the next phase but DO NOT start it automatically.

IMPORTANT BEHAVIOR
If the requested phase depends on an earlier incomplete phase:
Do NOT blindly proceed.
Instead:
Identify the missing dependency.
Complete the minimum required prerequisite if it is clearly safe and necessary.
Explain that prerequisite work was required.
Continue with the requested phase.
If completing the prerequisite would substantially expand the scope, stop and ask the developer.

DO NOT
Never:
Rewrite the entire project unnecessarily.
Delete working code without justification.
Change the technology stack without approval.
Introduce unnecessary libraries.
Implement future phases early.
Replace custom DSA implementations with Java collections.
Create fake DSA classes that are never used.
Ignore failing tests.
Hardcode passwords/API keys/secrets.
Modify unrelated modules without a reason.
Claim a phase is complete without verification.

PHASE COMPLETION STANDARD
A phase is considered COMPLETE only when:
Implementation     ✅
Compilation        ✅
Tests              ✅
Integration        ✅ where applicable
Documentation      ✅ where applicable
Roadmap updated    ✅
If any required item fails, mark the phase:
⚠️ PARTIALLY COMPLETE
rather than falsely marking it complete.

RESUME PROTOCOL
If the developer says:
Continue
Antigravity must:
Read ROADMAP.md.
Find the current incomplete phase.
Determine the last completed task.
Inspect the existing code.
Continue from that point.
Do not restart completed work.

PHASE COMMAND EXAMPLES
Start DSA
Start Phase 1
Start integration
Start Phase 2
Resume interrupted work
Continue Phase 1
Specific DSA task
Start Phase 1 — Binary Search Tree
Check project status
Check LifeLog roadmap status
Run verification
Run LifeLog tests and verify the current phase

GOLDEN RULE
Read → Inspect → Implement → Test → Verify → Update Roadmap → Report → STOP.
Never skip verification.
Never automatically move to the next phase.
The developer decides when the next phase begins.
