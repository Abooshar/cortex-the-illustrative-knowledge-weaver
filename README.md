# Cortex: The Illustrative Knowledge Weaver

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Abooshar/cortex-the-illustrative-knowledge-weaver)

Cortex is a visually-driven knowledge management system designed to help users organize, visualize, and query their information through an intuitive, illustrative interface. It transforms traditional notes, files, and links into an interactive neural network, allowing users to discover hidden connections and insights. The core of the application is a dynamic graph visualization where each piece of information is a node. Users can interact with an AI assistant via a chat interface to search their knowledge base using natural language. A comprehensive content management hub, named 'The Cortex', provides multiple views like tables, grids, and Kanban boards for meticulous organization. The entire experience is wrapped in a whimsical, illustrative design that makes managing knowledge not just productive, but delightful.

## Key Features

-   **🧠 Neural Network Visualization**: An interactive, force-directed graph that displays your knowledge base like a brain map. Pan, zoom, and click nodes to explore connections.
-   **🤖 AI-Powered Search**: A chat interface to query your knowledge base using natural language, powered by Cloudflare Agents.
-   **🗂️ Content Cortex**: A central hub for managing all your content with multiple views: Table, Grid, List, and a Kanban board.
-   **🎨 Illustrative & Whimsical UI**: A beautiful, clean, and delightful user interface with a unique illustrative style, custom fonts, and smooth animations.
-   **💡 Light & Dark Modes**: Seamlessly switch between themes to suit your preference.
-   **👤 User Profile & Settings**: Manage your profile and customize application settings.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Routing**: React Router
-   **Backend**: Cloudflare Workers, Hono
-   **Stateful Agents**: Cloudflare Agents (Durable Objects)
-   **AI Integration**: Cloudflare AI Gateway, OpenAI SDK

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd cortex-knowledge-weaver
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Environment Setup

The project requires Cloudflare AI Gateway credentials to function.

1.  Create a `.dev.vars` file in the root of the project:
    ```bash
    touch .dev.vars
    ```

2.  Add your Cloudflare credentials to the `.dev.vars` file. This file is used by Wrangler for local development.
    ```ini
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```
    **Note**: Never commit the `.dev.vars` file to version control.

## Development

To start the local development server, which includes the Vite frontend and the Wrangler worker, run:

```bash
bun dev
```

This will start the application on `http://localhost:3000` (or the next available port). The frontend will automatically hot-reload on changes.

## Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Build the application:**
    ```bash
    bun build
    ```

2.  **Deploy to Cloudflare:**
    ```bash
    bun deploy
    ```
    This command will build your application and deploy it using the Wrangler CLI.

3.  **Configure Secrets:** After the initial deployment, you must add your `CF_AI_BASE_URL` and `CF_AI_API_KEY` as secrets in your Cloudflare Worker's dashboard under **Settings > Variables**.

Alternatively, you can deploy directly from your GitHub repository.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Abooshar/cortex-the-illustrative-knowledge-weaver)

## Important Note on AI Usage

Please be aware that this project utilizes AI capabilities that make requests to external AI servers. There is a limit on the number of requests that can be made across all user applications in a given time period. Please use the AI features responsibly.

## License

This project is licensed under the MIT License.