# Automated News Digest Generator

An automated command-line application built in Node.js and TypeScript that fetches top news headlines across multiple categories, deduplicates articles using URL normalization, and generates a structured HTML news digest.

This project demonstrates core software engineering design patterns including the **Singleton Pattern** for configuration management and the **Builder Pattern** for HTML output generation.

---

## Setup

To set up the project and install all required dependencies, run:

```bash
npm install
```

---

## Configuration

The application is configured via a `config.json` file in the project root directory. An example template `config.json.example` is provided.

1. Copy `config.json.example` to create `config.json`:

```bash
cp config.json.example config.json
```

2. Open `config.json` and set your API key (e.g., GNews / NewsAPI):

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "categories": [
    "technology",
    "business",
    "science",
    "health",
    "sports"
  ],
  "outputFile": "output/digest.html"
}
```

*Note: If no live API key is provided, the application will automatically fall back to structured sample news data.*

---

## Running the Application

To execute the news digest generation pipeline and create the HTML output:

```bash
npm start
```

Upon completion, the generated HTML digest will be written to the path specified in `config.json` (e.g., `output/digest.html`).

---

## Running Tests

To run the complete unit test suite using Jest:

```bash
npm test
```

The test suite includes tests for:
- **Singleton Pattern**: Verifying `ConfigService.getInstance()` returns a single instance.
- **Builder Pattern**: Verifying incremental construction of HTML document tags (`<h1>`, `<h2>`, `<ul>`, `<li>`, `<a>`).
- **Deduplication Logic**: Testing URL normalization and duplicate article filtering.
- **Main Pipeline Integration**: Testing full execution with API Client mocking via `jest.mock`.
