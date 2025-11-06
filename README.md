# RaceTime 🏇

RaceTime is a sleek and modern web application that provides a real-time guide to the next upcoming horse, harness, and greyhound races. Built with a cutting-edge tech stack, it offers a fast, responsive, and user-friendly experience for race enthusiasts.

## 🏁 Getting Started

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

Make sure you have Node.js installed on your machine.

- [Node.js](https://nodejs.org/) (v18 or later is recommended)

### Installation & Setup

1.  **Clone the repository** (or use your existing project files).

2.  **Install dependencies**:
    Open your terminal in the project directory and run:

    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 📜 Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Starts the application in development mode with hot-reloading.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code for errors and style issues.
- `nom run typecheck`: Check for typescript errors 
- `npm run test`: Runs the test suite using Jest.
- `npm run test:watch`: Runs the tests in watch mode
- `npm run test:coverage`: Create test coverage

## 📜 Use of AI
- Initial scaffolding done with [genkit](https://firebase.google.com/docs/genkit/overview)
- Tests have been initially done with AI and updated to a corporate standard

## 📜 NOT Use of AI
- refactor everything
- clean up dependencies
- clean up all radix imports

## 📜 Todo
- investigate why races jump positions when they have same (advertised_start)
- Test and add stories to UI components


## 📜 Assumptions
- Neds have a different approach to pooling data from their next race api (https://api.neds.com.au/v2/racing/next-races-category-group?count=10). Seems the pooling is done when it matters, delayed/cancelled races and the fact that “next to go” can shuffle. For the sake of simplicity, with the given requirement, a new call is only triggered once a race is not shown to the user reducing the amount of calls. This feature can be implements at a later stage when a timeframe requirement is needed

## 📜 Thanks
- Any thanks for the opportunity to showcase my skills. 

 
