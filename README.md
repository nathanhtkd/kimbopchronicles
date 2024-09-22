This code implements a hybrid Next.js 14 + Python application for generating songs based on news articles.  

## Inputs:

- **Topics**: A list of topics of interest to the user.  
- **Genre**: The desired musical genre for the song.  
- **Sentiment Preference**: A preference for the overall sentiment of the song: "positive", "negative", or "neutral".  

## Outputs:

- **Audio URL**: The link to the generated song audio file.  
- **Image URL**: The link to an image representing the song's theme.  
- **Avatar Image URL**: The link to an avatar image representing the song's theme.  
- **Lyrics**: The lyrics of the generated song.  
- **News Sources**: A list of news articles used as sources for the song, including title and URL.  

## Usage:

The application is structured with three main components:

1. **Next.js frontend**: Handles user interactions, topic selection, genre selection, and displays the generated song output.  
2. **FastAPI backend**:  Fetches news articles, extracts summaries, processes sentiment, and generates lyrics based on user input using the Groq AI model.  
3. **Suno API**:  Generates music based on the lyrics and genre, providing the audio URL.  

Users can interact with the Next.js frontend to select topics, genre, and sentiment preference, triggering the FastAPI backend to fetch and process news articles and generate lyrics. The lyrics are then sent to the Suno API to generate the final song.  

This application leverages the power of AI for music and news summarization, providing a unique and interactive user experience.