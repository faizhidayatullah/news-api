# News API for Our Capstone Project

A simple News API to fetch news from Cointelegraph RSS feed, filter by a keyword (coins), and clean the HTML content.

## Features

- Fetch news from Cointelegraph RSS feed.
- Clean content using **html-to-text**.
- Search news by keyword in the title or description.
- Return structured JSON containing title, description, link, publication date, and image URL.

## Service URL

The API is deployed on Google Cloud Run and can be accessed at:

```
https://news-api-747657276300.asia-southeast2.run.app/news/btc
```

## API Path

The path to access the news endpoint:

```
/news/<coin name>
```

Replace `<coin name>` with the desired cryptocurrency name or symbol (e.g., `btc`, `eth`, `sol`).

## Response

The API responds with a JSON array containing filtered news articles. Each article includes the following fields:

  {
    "title": "...",
    "description": "...",
    "link": "...",
    "published": "...",
    "imageUrl": "..."
  }

  ### Response Field Descriptions

- **`title`**: The headline of the news article.
- **`description`**: A cleaned and summarized version of the article content or snippet.
- **`link`**: The URL linking to the full article on Cointelegraph's website.
- **`published`**: The publication date and time of the article in ISO 8601 format (e.g., `2023-10-12T08:00:00Z`).
- **`imageUrl`**: The URL of an associated image for the article.

