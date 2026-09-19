export const initialProjects = [
  {
    "title": "GROVIA",
    "slug": "grovia",
    "subtitle": "E-COMMERCE WEB APPLICATION",
    "category": "FULL-STACK E-COMMERCE",
    "description": "Full-stack grocery e-commerce application built with the MERN stack featuring cart management, wishlist, product search, responsive UI and dynamic order handling.",
    "overview": "Grovia is a modern, high-performance grocery commerce platform engineered to deliver friction-free shopping experiences. Built end-to-end on the MERN stack (MongoDB, Express, React, Node.js), it replaces slow, monolithic storefronts with a decoupled architecture featuring instantaneous catalog filtering, reactive cart synchronization, and authenticated checkout pipelines.",
    "problem": "Traditional grocery ordering workflows suffer from disjointed inventory syncing, fragile client-side cart states, and cumbersome multi-step checkouts that cause high cart abandonment.",
    "solution": "Grovia implements an atomic cart mutation architecture backed by MongoDB document versioning, optimized JWT session verification, and a responsive Tailwind UI with immediate optimistic updates.",
    "technologies": [
      "REACT",
      "NODE.JS",
      "EXPRESS.JS",
      "MONGODB",
      "JWT",
      "TAILWIND CSS"
    ],
    "features": [
      "Cart management with instantaneous item count and price calculations",
      "User wishlist with one-click transfer to cart",
      "Full-text dynamic product search and multi-category filtering",
      "JWT-based user authentication with encrypted password hashing",
      "Protected REST APIs with role-based authorization",
      "Comprehensive order lifecycle management and status tracking",
      "Fully responsive mobile-first editorial shopping interface",
      "Scalable MVC architectural design pattern"
    ],
    "architecture": "Frontend built on React with modular context-driven state management for cart/wishlist. Backend powered by an Express.js API gateway delegating to controller services, authenticated via JWT middleware, with MongoDB handling document storage for products, users, and orders.",
    "implementation": "Implemented custom React hooks for catalog caching and debounced search queries. Express middleware guarantees input sanitization and rate-limits order placement endpoints. Mongoose sub-document arrays allow atomic order item tracking.",
    "challenges": "Handling concurrent cart operations across multiple browser tabs and preventing inventory race conditions during high-volume checkout simulations.",
    "learnings": "Deepened proficiency in JWT token lifecycle management, database indexing for sub-10ms search queries, and structuring clean reusable React component hierarchies.",
    "githubUrl": "https://github.com/sagar0kaushik/Grovia",
    "liveUrl": "https://grovia-pxbz.vercel.app/",
    "previewType": "ecommerce",
    "featured": true,
    "order": 1
  },
  {
    "title": "STUDENT MANAGEMENT SYSTEM",
    "slug": "student-management-system",
    "subtitle": "ACADEMIC RECORD & STUDENT LIFECYCLE PLATFORM",
    "category": "FULL-STACK MANAGEMENT APPLICATION",
    "description": "Comprehensive academic administration system built with FastAPI, React and MongoDB featuring RESTful CRUD APIs, schema-level request validation, and strict exception handling.",
    "overview": "An enterprise-grade student information and lifecycle management platform designed to replace manual, error-prone record keeping in educational institutions. Built with FastAPI for high-throughput asynchronous backend performance paired with a React frontend.",
    "problem": "Academic departments frequently struggle with disparate data silos, lack of schema enforcement in student enrollment logs, and slow manual auditing.",
    "solution": "Engineered a centralized, schema-validated REST API layer in FastAPI using Pydantic models, integrated with MongoDB for flexible course-to-student relationship tracking, backed by interactive React dashboards.",
    "technologies": [
      "FASTAPI",
      "REACT",
      "MONGODB",
      "PYTHON",
      "PYDANTIC",
      "POSTMAN"
    ],
    "features": [
      "High-performance RESTful CRUD APIs with sub-millisecond response latency",
      "Strict schema-level request validation and type safety via Pydantic",
      "Granular HTTP exception handling with standardized JSON error envelopes",
      "Comprehensive Postman test collection covering 100% of route permutations",
      "Student profile lifecycle management (enrollment, courses, grading, attendance)",
      "Indexed MongoDB query pipelines for instant student searches",
      "Interactive data filtering, sorting, and batch export interfaces"
    ],
    "architecture": "FastAPI asynchronous service architecture utilizing dependency injection for database sessions. The React client communicates via an Axios API client with centralized response interceptors and toast error notifications.",
    "implementation": "Constructed Pydantic schemas with custom regex validators for student IDs, emails, and phone formats. Configured CORS, custom exception handlers, and auto-generated Swagger/OpenAPI documentation.",
    "challenges": "Designing multi-attribute search queries across thousands of student records in MongoDB while maintaining sub-50ms response budgets without complex indexing overhead.",
    "learnings": "Mastered FastAPI dependency injection patterns, Pydantic v2 data serialization, and creating rigorous API contract tests in Postman.",
    "githubUrl": "https://github.com/sagar0kaushik/Student-Management-System",
    "liveUrl": "https://github.com/sagar0kaushik/Student-Management-System",
    "previewType": "dashboard",
    "featured": true,
    "order": 2
  },
  {
    "title": "BANK MANAGEMENT SYSTEM",
    "slug": "bank-management-system",
    "subtitle": "FINANCIAL TRANSACTION & LEDGER SYSTEM",
    "category": "FULL-STACK FINANCIAL SYSTEM",
    "description": "Secure financial ledger application powered by FastAPI, React, and MongoDB with JWT token-based authorization, multi-tiered user management, and transactional integrity.",
    "overview": "A secure, resilient banking simulation application engineered with zero-trust architectural principles. Features user onboarding, multi-account ledgering, fund transfers, and immutable transaction statement logs.",
    "problem": "Financial web applications require strict guarantees against replay attacks, unauthorized route access, balance underflow conditions, and tampering with transaction records.",
    "solution": "Designed an auditable ledger system with cryptographically signed JWT tokens, server-enforced atomic balance transfers, and role-based access control protecting customer vs. teller capabilities.",
    "technologies": [
      "FASTAPI",
      "REACT",
      "MONGODB",
      "JWT",
      "PYTHON",
      "CRYPTOGRAPHY"
    ],
    "features": [
      "Secure user management with password salting and BCrypt hashing",
      "Stateless JWT authentication with automated authorization header verification",
      "Multi-tiered role-based authorization for customers and bank staff",
      "Guarded protected routes on both client and backend",
      "Atomic credit, debit, and fund transfer operations with validation guards",
      "Complete historical transaction ledger with date/amount filtering",
      "Real-time account balance updates and notification alerts"
    ],
    "architecture": "FastAPI REST API layer connected to MongoDB using Motor/Pydantic schemas. React frontend with secure state encapsulation, token storage in secure HTTP-ready containers, and automatic session logout upon token expiry.",
    "implementation": "Created balance verification middleware preventing overdrafts before ledger commit. Enforced idempotent transaction IDs to eliminate duplicate charges.",
    "challenges": "Handling concurrent balance deduction requests while guaranteeing that balance states remain consistent and race-condition free.",
    "learnings": "Deepened practical knowledge of cryptographic token signing, zero-trust backend authorization guards, and state consistency patterns in financial domains.",
    "githubUrl": "https://github.com/sagar0kaushik/Bank-Management-System",
    "liveUrl": "https://github.com/sagar0kaushik/Bank-Management-System",
    "previewType": "banking",
    "featured": true,
    "order": 3
  },
  {
    "title": "API WEATHER APP",
    "slug": "weather-app",
    "subtitle": "REAL-TIME METEOROLOGICAL PLATFORM",
    "category": "ASYNCHRONOUS WEB APPLICATION",
    "description": "Real-time weather application using the OpenWeatherMap API with asynchronous JavaScript and dynamic weather updates.",
    "overview": "A lightweight, highly responsive weather forecasting client that communicates asynchronously with the OpenWeatherMap REST API to retrieve real-time atmospheric conditions, 5-day forecasts, and geographical weather matrices.",
    "problem": "Many public weather clients are bloated with trackers and third-party ads, causing sluggish load times and erratic UI repaints.",
    "solution": "Built a pure, distraction-free weather application with clean async/await fetch streams, debounced city lookup, responsive iconography, and dynamic CSS theme adjustments reflecting live meteorological states.",
    "technologies": [
      "JAVASCRIPT",
      "OPENWEATHERMAP API",
      "ASYNC/AWAIT",
      "CSS3",
      "HTML5"
    ],
    "features": [
      "Direct OpenWeatherMap REST API integration with secure API query parsing",
      "Asynchronous fetch pipelines utilizing ES6 Promises and Async/Await",
      "Live dynamic weather metrics: humidity, wind velocity, barometric pressure, UV index",
      "Instant city search with automatic error handling for invalid geographical entries",
      "Celsius to Fahrenheit metric toggle with instantaneous client re-computation",
      "Responsive typography and fluid grid adapting gracefully across mobile and 4K displays"
    ],
    "architecture": "Vanilla JavaScript event-driven architecture using clean separation between the API Fetcher module, State Store, and DOM Renderer.",
    "implementation": "Utilized modern Fetch API with AbortController for canceling in-flight search requests when new input is entered. Handled network timeouts and edge cases such as city not found or rate limits.",
    "challenges": "Preventing UI jitter during rapid asynchronous API responses and cleanly mapping raw OpenWeatherMap condition codes to dynamic editorial SVG graphics.",
    "learnings": "Sharpened fundamental asynchronous JavaScript competencies, promise resolution patterns, and native DOM manipulation without heavy external libraries.",
    "githubUrl": "https://github.com/sagar0kaushik/weather-web-app",
    "liveUrl": "https://sagar0kaushik-weather-web-app.vercel.app/",
    "previewType": "weather",
    "featured": true,
    "order": 4
  },
  {
    "title": "RAG DOCUMENT CHATBOT",
    "slug": "rag-document-chatbot",
    "subtitle": "RETRIEVAL-AUGMENTED GENERATION SYSTEM",
    "category": "AI & VECTOR SEARCH",
    "description": "High-throughput document question-answering system using RAG, Sentence Transformers dense embeddings, Meta FAISS vector index, and Groq Cloud LLM.",
    "overview": "An AI-powered document intelligence application that enables contextual querying over private and technical PDF documents. Utilizing Retrieval-Augmented Generation (RAG), the system eliminates hallucination by grounding Groq LLM responses in semantically relevant document chunks indexed with Meta FAISS.",
    "problem": "Traditional LLMs either lack knowledge of private proprietary documents or produce confident hallucinations when queried outside their fixed pre-training corpus. Sending full multi-hundred page documents in prompt contexts exceeds token limits and causes extreme latency.",
    "solution": "Constructed an end-to-end RAG architecture that extracts text from uploaded PDFs, partitions them into semantic chunk spans with overlap, generates 384-dimensional vector embeddings via Sentence Transformers, and stores them in an in-memory FAISS L2 index. At query time, top-k relevant excerpts are retrieved in sub-15ms and injected into a Groq-accelerated LLM pipeline with verifiable source citations.",
    "technologies": [
      "PYTHON",
      "FLASK",
      "FAISS",
      "GROQ LLM",
      "SENTENCE-TRANSFORMERS",
      "RAG"
    ],
    "features": [
      "PDF document text extraction with recursive chunking and sliding-window overlap",
      "High-speed semantic vector embeddings generated with HuggingFace Sentence Transformers",
      "Sub-15ms dense vector similarity search powered by Meta FAISS (Facebook AI Similarity Search)",
      "Ultra-low latency LLM inference using Groq Cloud API (LLaMA-3 / Mixtral)",
      "Strict hallucination prevention through contextual grounding and source citations",
      "Conversational memory buffer maintaining multi-turn dialogue context",
      "RESTful Flask backend API with error handling and file validation",
      "Responsive web interface with real-time response rendering and citation inspector"
    ],
    "architecture": "Modular multi-tier AI pipeline: Presentation layer built with a responsive interface; Flask REST backend routing requests; Document ingestion engine extracting text via PyPDF; Embedding generator transforming text chunks into dense vectors; FAISS vector database running similarity search; Groq Cloud LLM engine synthesizing context-aware grounded responses with source citations.",
    "implementation": "Engineered custom chunking algorithms balancing context fidelity and token economics. Employed FAISS IndexFlatL2 for sub-linear vector retrieval. Built contextual prompt templates with strict provenance directives to enforce faithful summarization. Wrapped the pipeline in a modular Flask service with CORS and streaming capabilities.",
    "challenges": "Optimizing chunk overlap boundaries to ensure contextual coherence without diluting vector similarity scores, and mitigating API latency fluctuations through efficient prompt engineering.",
    "learnings": "Mastered production RAG architectures, dense vector embedding mathematics, FAISS indexing schemes, and LLM context window optimization strategies.",
    "githubUrl": "https://github.com/sagar0kaushik/RAG-Document-Chatbot",
    "liveUrl": "https://github.com/sagar0kaushik/RAG-Document-Chatbot",
    "previewType": "rag",
    "featured": true,
    "order": 5
  }
];

export const initialBlogs = [
  {
    "title": "MERN Stack Architecture Explained: Building Scalable Full-Stack Applications",
    "slug": "mern-stack-architecture-explained",
    "category": "Full-Stack Architecture",
    "excerpt": "An architectural deep-dive into decoupling frontend concerns, designing resilient Express middleware pipelines, and optimizing Mongoose schema access patterns.",
    "summary": "An architectural deep-dive into decoupling frontend concerns, designing resilient Express middleware pipelines, and optimizing Mongoose schema access patterns.",
    "featuredImage": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
    "featuredImageAlt": "MERN Stack Architecture Diagram & Modern Web Development",
    "author": "Sagar Kaushik",
    "status": "published",
    "isFeatured": true,
    "readingTime": "7 min read",
    "readTime": "7 min read",
    "publishedAt": "2026-08-15T00:00:00.000Z",
    "views": 284,
    "seoTitle": "MERN Stack Architecture Explained | Sagar Kaushik",
    "seoDescription": "Architectural deep-dive into decoupling React from Express and MongoDB for resilient, production-ready MERN web applications.",
    "canonicalUrl": "https://sagarkaushik.com/blogs/mern-stack-architecture-explained",
    "tags": [
      "MERN",
      "Node.js",
      "Express",
      "MongoDB",
      "Architecture"
    ],
    "content": "# MERN Stack Architecture Explained: Building Scalable Full-Stack Applications\n\nWhen architecting modern web applications, the MERN stack—**MongoDB, Express.js, React.js, and Node.js**—stands out as one of the most cohesive JavaScript-centric technology suites. However, building an application that scales gracefully beyond trivial prototypes requires a strict separation of concerns, defensive backend design, and disciplined client-side state lifecycles.\n\nIn this article, I break down the architectural blueprint I use when building production applications like Grovia.\n\n---\n\n## 1. Decoupling the Client from Backend Services\n\nA common anti-pattern in MERN applications is leaking database models directly into React component props. A production architecture enforces an absolute boundary:\n\n1. **Client Layer (React)**: Operates strictly as a presentation and user-interaction engine. It has no knowledge of whether data originates from MongoDB or an in-memory cache; it talks purely to typed API client contracts.\n2. **API Gateway Layer (Express.js)**: Responsible for routing, CORS headers, rate-limiting, and request parsing.\n3. **Controller & Service Layer**: Contains business logic, authorization guards, and input sanitization.\n4. **Data Access Layer (Mongoose/MongoDB)**: Defines document schemas, validation constraints, and database hooks.\n\nBy maintaining this 4-tier separation, database refactoring never cascades breaking changes into the frontend component tree.\n\n---\n\n## 2. Express Middleware Pipeline Design\n\nIn Node.js, middleware is your primary defense against malformed inputs, malicious actors, and runtime crashes. A robust Express pipeline should be ordered intentionally:\n\n- Security headers via Helmet\n- Controlled Cross-Origin Access via CORS\n- Request parsing with payload limits (protecting against buffer attacks)\n- Rate limiting for DDoS and brute-force prevention\n- Authenticated JWT token verification\n\nRestricting JSON request bodies to tight limits protects the event loop from being blocked by massive incoming payloads.\n\n---\n\n## 3. MongoDB Indexing and Query Performance\n\nMongoDB is document-oriented and flexible, but flexibility without schema indexing leads to full collection scans that cripple server throughput.\n\nKey indexing rules:\n- Always index fields frequently used in find() queries (such as slug, email, category).\n- Compound indexes should follow the Equality, Sort, Range (ESR) rule.\n- Use projection to return only the fields required by the client view.\n- The lean() method in Mongoose is critical in read-heavy routes: it skips hydrating full Mongoose Documents and returns lightweight plain JavaScript objects, improving response times up to 5x.\n\n---\n\n## 4. Summary\n\nA reliable MERN architecture is built upon clean interfaces: clear API contracts, guarded controllers, lean database queries, and modular React hooks. When these patterns are applied consistently, the stack is fast, maintainable, and ready for production."
  },
  {
    "title": "Building an AI Document Chatbot with RAG, FAISS and Groq",
    "slug": "building-ai-document-chatbot-rag-faiss-groq",
    "category": "AI & Vector Search",
    "excerpt": "How I built an ultra-fast document question-answering system using Retrieval-Augmented Generation, Sentence Transformers, Meta FAISS vector search, and Groq Cloud LLM.",
    "summary": "How I built an ultra-fast document question-answering system using Retrieval-Augmented Generation, Sentence Transformers, Meta FAISS vector search, and Groq Cloud LLM.",
    "featuredImage": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    "featuredImageAlt": "AI Vector Search and Retrieval-Augmented Generation Architecture",
    "author": "Sagar Kaushik",
    "status": "published",
    "isFeatured": true,
    "readingTime": "8 min read",
    "readTime": "8 min read",
    "publishedAt": "2026-08-01T00:00:00.000Z",
    "views": 312,
    "seoTitle": "Building an AI Document Chatbot with RAG, FAISS and Groq | Sagar Kaushik",
    "seoDescription": "Technical guide on building a sub-15ms vector search document Q&A chatbot using RAG, Meta FAISS, Sentence Transformers, and Groq Cloud LLMs.",
    "canonicalUrl": "https://sagarkaushik.com/blogs/building-ai-document-chatbot-rag-faiss-groq",
    "tags": [
      "AI",
      "RAG",
      "FAISS",
      "Python",
      "Flask",
      "Groq"
    ],
    "content": "# Building an AI Document Chatbot with RAG, FAISS and Groq\n\nLarge Language Models are exceptional reasoning engines, but they operate under a fundamental limitation: **they do not know your private documents**, and when pressed for details beyond their training cutoff, they hallucinate.\n\nRather than fine-tuning an expensive model, the modern engineering standard is **Retrieval-Augmented Generation (RAG)**. In this case study, I outline how I designed and built [RAG-Document-Chatbot](https://github.com/sagar0kaushik/RAG-Document-Chatbot) using Python, Sentence Transformers, Meta FAISS, and Groq Cloud.\n\n---\n\n## 1. The Core Architecture\n\nA production RAG system separates knowledge ingestion from synthesis:\n\n1. **Document Ingestion**: Parsing PDF and text files, extracting raw text, and sanitizing formatting.\n2. **Chunking Engine**: Dividing text into overlapping spans (e.g. 500 characters with 100 character overlap) to preserve semantic context across chunk borders.\n3. **Dense Vector Embeddings**: Transforming each text chunk into a high-dimensional vector via `all-MiniLM-L6-v2`.\n4. **FAISS Vector Index**: Storing vectors in an in-memory Euclidean/Cosine index for sub-15ms nearest-neighbor lookups.\n5. **Synthesis with Groq**: Inverting top-k matches into structured context envelopes fed to LLaMA-3 with strict provenance constraints.\n\n---\n\n## 2. Preventing Hallucinations with Provenance Directives\n\nPrompt engineering in RAG requires defensive boundaries:\n\n```python\nsystem_prompt = (\n    \"You are an expert technical research assistant. Answer the user question \"\n    \"strictly using ONLY the context excerpts provided below. If the answer \"\n    \"is not directly mentioned in the excerpts, clearly state that the document \"\n    \"does not contain this information. Include excerpt citations.\"\n)\n```\n\nBy enforcing citation boundaries, the assistant transforms from a creative text generator into a verifiable information retrieval agent."
  },
  {
    "title": "Building a REST API with FastAPI: Principles, Validation and CRUD",
    "slug": "building-a-rest-api-with-fastapi",
    "category": "Backend Engineering",
    "excerpt": "How Pydantic schema validation, asynchronous request handling, and Python type hints create performant, self-documenting REST APIs.",
    "summary": "How Pydantic schema validation, asynchronous request handling, and Python type hints create performant, self-documenting REST APIs.",
    "featuredImage": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    "featuredImageAlt": "Python Code and FastAPI REST API Architecture",
    "author": "Sagar Kaushik",
    "status": "published",
    "isFeatured": false,
    "readingTime": "6 min read",
    "readTime": "6 min read",
    "publishedAt": "2026-07-28T00:00:00.000Z",
    "views": 196,
    "seoTitle": "Building a REST API with FastAPI | Sagar Kaushik",
    "seoDescription": "Discover how Pydantic schema validation, async handlers, and type hints create performant REST APIs with Python and FastAPI.",
    "canonicalUrl": "https://sagarkaushik.com/blogs/building-a-rest-api-with-fastapi",
    "tags": [
      "FastAPI",
      "Python",
      "REST API",
      "Pydantic"
    ],
    "content": "# Building a REST API with FastAPI: Principles, Validation and CRUD\n\nPython has long been a powerhouse for backend systems, but the arrival of **FastAPI** transformed asynchronous API development. By leveraging standard Python 3.10+ type hints and Pydantic v2 data models, FastAPI provides speed comparable to Node.js and Go, alongside automatic OpenAPI documentation.\n\nDuring the development of my **Student Management System** and **Bank Management System**, FastAPI formed the core backend engine. Here is how to structure robust CRUD services with it.\n\n---\n\n## 1. Why FastAPI for CRUD APIs?\n\n1. **Automatic Schema Validation**: Eliminates manual type checking. Incoming JSON is validated against Pydantic models before route handlers execute.\n2. **Asynchronous Execution**: Native support for async and await, allowing non-blocking I/O operations for database drivers like Motor.\n3. **Interactive Documentation**: Swagger UI (/docs) is automatically generated from route definitions and docstrings.\n\n---\n\n## 2. Defining Strict Pydantic Contracts\n\nIn a production REST service, data contracts must define exact input constraints. If a client sends an invalid email or an enrollment year outside the allowed range, FastAPI automatically returns a structured 422 Unprocessable Entity error with exact field locations.\n\n---\n\n## 3. Verification with Postman\n\nTesting every endpoint variation—success responses, 400 bad requests, 404 not found, and 422 validation errors—ensures that client applications can rely unconditionally on the API contracts."
  },
  {
    "title": "JWT Authentication & Role-Based Authorization in Full-Stack Web Apps",
    "slug": "jwt-authentication-in-full-stack-applications",
    "category": "Security & Auth",
    "excerpt": "Demystifying token lifecycles, bearer headers, protected route guards in React, and avoiding security pitfalls in production auth flows.",
    "summary": "Demystifying token lifecycles, bearer headers, protected route guards in React, and avoiding security pitfalls in production auth flows.",
    "featuredImage": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop",
    "featuredImageAlt": "Cybersecurity & JSON Web Token Authentication Architecture",
    "author": "Sagar Kaushik",
    "status": "published",
    "isFeatured": false,
    "readingTime": "8 min read",
    "readTime": "8 min read",
    "publishedAt": "2026-06-20T00:00:00.000Z",
    "views": 224,
    "seoTitle": "JWT Authentication in Full-Stack Web Apps | Sagar Kaushik",
    "seoDescription": "Complete guide on implementing stateless JWT authentication, Bearer tokens, and role-based guards in React and Express.",
    "canonicalUrl": "https://sagarkaushik.com/blogs/jwt-authentication-in-full-stack-applications",
    "tags": [
      "Security",
      "JWT",
      "Authentication",
      "React",
      "Node.js"
    ],
    "content": "# JWT Authentication & Role-Based Authorization in Full-Stack Web Apps\n\nAuthentication and authorization are the backbone of secure web systems. In modern single-page applications (SPAs), JSON Web Tokens (JWT) provide a stateless mechanism for identifying users and enforcing permission boundaries.\n\nIn this guide, I examine how to implement JWT authentication cleanly across an Express backend and a React client.\n\n---\n\n## 1. The Anatomy of a Secure JWT Flow\n\nA standard stateless token authentication flow consists of:\n1. **User Credentials**: Client submits username and password over HTTPS.\n2. **Password Verification**: Server compares the submitted password against the salted BCrypt hash.\n3. **Token Issuance**: Upon match, the server signs a payload containing non-sensitive identifiers (id, role) with a strong secret key.\n4. **Bearer Header**: The client includes the token in the Authorization: Bearer <token> header on subsequent requests.\n5. **Route Guarding**: Express middleware verifies token integrity and extracts the decoded payload before passing execution to the controller.\n\n---\n\n## 2. Key Security Rules\n\n- **Never store sensitive data in the JWT payload**: Tokens are Base64Url-encoded, not encrypted. Anyone can read the payload.\n- **Enforce short expiration times**: Access tokens should expire in hours or minutes, not months.\n- **Use HTTPS in production**: Without TLS, tokens can be intercepted over unencrypted networks."
  },
  {
    "title": "Building Grovia: An Editorial MERN E-Commerce Architecture",
    "slug": "building-grovia-mern-ecommerce-architecture",
    "category": "System Design",
    "excerpt": "Engineering decisions behind Grovia: managing dynamic cart states, syncing server-side session payloads, and structuring MongoDB collections for grocery cataloging.",
    "summary": "Engineering decisions behind Grovia: managing dynamic cart states, syncing server-side session payloads, and structuring MongoDB collections for grocery cataloging.",
    "featuredImage": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
    "featuredImageAlt": "Grovia E-Commerce Web Application Interface Design",
    "author": "Sagar Kaushik",
    "status": "published",
    "isFeatured": false,
    "readingTime": "9 min read",
    "readTime": "9 min read",
    "publishedAt": "2026-05-12T00:00:00.000Z",
    "views": 251,
    "seoTitle": "Building Grovia: Editorial MERN E-Commerce Architecture | Sagar Kaushik",
    "seoDescription": "Full-stack case study on building Grovia with MongoDB, Express, React, and Node.js featuring atomic cart mutations and sub-15ms queries.",
    "canonicalUrl": "https://sagarkaushik.com/blogs/building-grovia-mern-ecommerce-architecture",
    "tags": [
      "Grovia",
      "React",
      "Node.js",
      "MongoDB",
      "Case Study"
    ],
    "content": "# Building Grovia: An Editorial MERN E-Commerce Architecture\n\nE-commerce platforms are challenging to build properly because they intersect responsive UI rendering with high-concurrency state mutations. When creating **Grovia** (available at [grovia-pxbz.vercel.app](https://grovia-pxbz.vercel.app/)), the goal was clear: build a full-stack grocery e-commerce platform that feels effortless to browse while remaining robust under data mutations.\n\nHere is an architectural walkthrough of the major systems powering Grovia.\n\n---\n\n## 1. Product Catalog and Dynamic Filtering\n\nA grocery catalog has specific usability requirements: customers want to filter by category (Fresh Produce, Dairy, Bakery), toggle dietary tags, and search products with zero perceptible latency.\n\nRather than firing an API request on every keystroke, the frontend uses a custom debounce hook. On the backend, MongoDB uses a text index on name and description fields to execute full-text matches in under 15ms.\n\n---\n\n## 2. Cart State Synchronization\n\nGrovia adopts an Optimistic UI with Background Sync model:\n1. When a user clicks \"+ Add to Cart\", the React state updates instantly, displaying the updated item count and price.\n2. In parallel, a throttled API call sends the cart delta to the server.\n3. If the backend fails (e.g. out of stock or network interruption), the client rolls back the state and displays a non-blocking toast warning.\n\n---\n\n## 3. Order Processing Pipeline\n\nWhen checking out, order consistency is paramount. The order schema captures an immutable snapshot of products, prices at time of purchase, shipping address, and calculated taxes. Capturing the title and price inside the items array prevents historical orders from altering if the catalog price is subsequently updated.\n\n---\n\n## 4. Conclusion\n\nGrovia serves as a complete showcase of full-stack engineering discipline: responsive layout architecture, decoupled REST services, resilient state syncing, and production deployment on Vercel and cloud MongoDB."
  }
];

export const initialExperience = [
  {
    "company": "Uddharana Tech Private Limited",
    "location": "Faridabad, India",
    "roles": [
      {
        "title": "Web Developer",
        "period": "4 months",
        "type": "Full-Time",
        "highlights": [
          "Developed and optimized RESTful CRUD APIs using Node.js, Express.js and FastAPI with strict request validation.",
          "Implemented secure JWT-based authentication and role-based authorization layers across client and server boundaries.",
          "Engineered standardized API response formats and comprehensive exception handling handlers.",
          "Conducted rigorous Postman API testing, maintained Swagger documentation, and participated in active code reviews."
        ]
      },
      {
        "title": "Web Developer Intern",
        "period": "6 months",
        "type": "Internship",
        "highlights": [
          "Built responsive frontend interfaces in React.js and translated design specifications into accessible web layouts.",
          "Assisted in structuring MongoDB collections and executing schema migrations.",
          "Collaborated with senior engineers on bug triage, performance tuning, and cross-browser compatibility audits."
        ]
      }
    ]
  }
];

export const initialEducation = {
  "institution": "Rajasthan Technical University",
  "degree": "B.Tech in Computer Science and Engineering",
  "period": "2022 ? 2026",
  "location": "Bharatpur, India",
  "coursework": [
    "Database Management Systems",
    "Computer Networks",
    "Operating Systems",
    "Object-Oriented Design",
    "Prompt Engineering",
    "Assisted Research"
  ]
};

export const initialRepos = [
  {
    "name": "Grovia",
    "description": "Full-stack MERN grocery e-commerce platform with reactive cart and JWT auth.",
    "language": "JavaScript",
    "url": "https://github.com/sagar0kaushik/Grovia",
    "liveUrl": "https://grovia-pxbz.vercel.app/"
  },
  {
    "name": "Student-Management-System",
    "description": "FastAPI, React & MongoDB academic record system with Pydantic validation.",
    "language": "Python",
    "url": "https://github.com/sagar0kaushik/Student-Management-System"
  },
  {
    "name": "Bank-Management-System",
    "description": "Secure financial ledger application with JWT token guards and audit history.",
    "language": "Python",
    "url": "https://github.com/sagar0kaushik/Bank-Management-System"
  },
  {
    "name": "weather-web-app",
    "description": "Real-time weather application using OpenWeatherMap API and asynchronous JS.",
    "language": "JavaScript",
    "url": "https://github.com/sagar0kaushik/weather-web-app",
    "liveUrl": "https://sagar0kaushik-weather-web-app.vercel.app/"
  },
  {
    "name": "chatApp",
    "description": "Real-time socket messaging web application with room-based chatting.",
    "language": "JavaScript",
    "url": "https://github.com/sagar0kaushik"
  },
  {
    "name": "portfolio-website",
    "description": "Production MERN portfolio built with Swiss typography and editorial art direction.",
    "language": "JavaScript",
    "url": "https://github.com/sagar0kaushik"
  }
];
