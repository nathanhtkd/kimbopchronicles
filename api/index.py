import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import List
from urllib.parse import quote

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from pydantic import BaseModel
from tqdm import tqdm

from groq import Groq
from fastapi import FastAPI, Request
import requests
import asyncio

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
news_api_key = os.getenv("NEWS_API_KEY")
summary_api_key = os.getenv("SUMMARY_API_KEY")
suno_api_link = os.getenv("SUNO_API_LINK")

top_k_articles = 1

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SongRequest(BaseModel):
    sentiment_preference: str  # "positive", "negative", "neutral"
    genre: str  # e.g., "rap", "pop"
    topics: List[str]  # list of topics
    
# POST endpoint to receive topics from client
@app.post("/api/py/generate_audio")
async def generate_audio_post(request: Request):
    data = await request.json()
    topics = data.get("topics")
    genre = str(data.get("genre"))
    sentiment_preference = "neutral"

    if not isinstance(topics, list):
        topics = [topics]

    song_request = SongRequest(sentiment_preference=sentiment_preference, genre=genre, topics=topics)
    results = generate_songs(topics, genre, sentiment_preference)
    
    return {"status": "success", "data": results}

def generate_songs(topics, genre, sentiment_preference):
    results = []

    for topic in tqdm(topics, desc="Processing topics", unit="topic"):
        logger.info(f"Starting process for topic: {topic}")
        try:
            articles = fetch_news_articles(topic)
            
            if not articles:
                logger.warning(f"No articles found for topic: {topic}")
                continue
            
            logger.info(f"Found {len(articles)} articles for topic: {topic}")
            
            try:
                processed_articles = process_articles(articles, topic)
            except Exception as e:
                logger.error(f"Error processing articles for topic {topic}: {str(e)}")
                continue
            
            try:
                lyrics = generate_lyrics_from_summaries(processed_articles, genre, sentiment_preference)
            except Exception as e:
                logger.error(f"Error generating lyrics for topic {topic}: {str(e)}")
                continue
            
            try:
                song_title = generate_title_from_lyrics(lyrics, topic, genre)
            except Exception as e:
                logger.error(f"Error generating title for topic {topic}: {str(e)}")
                song_title = f"Song about {topic}"  # Fallback title
            
            try:
                avatar_image_url = generate_avatar_from_lyrics(lyrics, topic, genre)
            except Exception as e:
                logger.error(f"Error generating avatar for topic {topic}: {str(e)}")
                avatar_image_url = None  # Fallback to None if avatar generation fails
            
            try:
                song_result = generate_song_with_suno(lyrics, genre, song_title)
            except Exception as e:
                logger.error(f"Error generating song with Suno for topic {topic}: {str(e)}")
                continue
            
            result = {
                "topic": topic,
                "lyrics": lyrics,
                "audio_url": song_result[0].get("audio_url"),
                "image_url": song_result[0].get("image_url"),
                "avatar_image_url": avatar_image_url,
                "news_sources": [{"title": article.get("title", "N/A"), "url": article.get("url", "N/A")} for article in articles]
            }
            
            results.append(result)
            logger.info(f"Successfully generated song for topic: {topic}")
            
        except Exception as e:
            logger.error(f"Unexpected error processing topic {topic}: {str(e)}")

    logger.info(f"Completed processing all topics. Generated {len(results)} songs.")
    return results

# Simulate the news article fetching for testing purposes
def fetch_news_articles(topic):
    try:
        # URL encode the topic
        encoded_topic = quote(topic)
        today = datetime.now().strftime('%Y-%m-%d')
        yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        api_url = f"http://api.mediastack.com/v1/news?access_key={news_api_key}&keywords={encoded_topic}&language=en,-de&date={yesterday},{today}&sort=popularity&limit={top_k_articles}&country=us"
        
        # Add category parameter based on topic
        categories = {
            "finance": "&categories=business,general",
            "technology": "&categories=technology",
            "health": "&categories=health",
            "entertainment": "&categories=entertainment"
        }
        api_url += categories.get(topic.lower(), "")  # Default to no category if not in the dict
        
        logger.info(f"Fetching news articles for topic: {topic}")
        response = requests.get(api_url, timeout=10)  # Add a timeout
        response.raise_for_status()  # Raise an exception for bad status codes
        
        data = response.json()
        articles = data.get("data", [])
        
        if not articles:
            logger.error(f"No articles found for topic: {topic}")
            raise ValueError(f"No articles found for topic: {topic}")
        else:
            logger.info(f"Found {len(articles)} articles for topic: {topic}")
        
        return articles
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching news articles for topic {topic}: {str(e)}")
        raise
    except ValueError as e:
        logger.error(f"Error parsing JSON response for topic {topic}: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error fetching news articles for topic {topic}: {str(e)}")
        raise

def process_articles(articles, topic):
    processed_articles = {
        "topic": topic,
        "articles": []
    }
    
    for article in tqdm(articles, desc=f"Processing articles for {topic}", unit="article"):
        url = article.get('url')
        if not url:
            logger.warning(f"Skipping article without URL for topic {topic}")
            continue
        
        try:
            logger.info(f"Processing article: {url}")
            response = requests.post(
                'https://api.magicapi.dev/api/v1/pipfeed/parse/extract',
                headers={
                    'accept': 'application/json',
                    'x-magicapi-key': summary_api_key,
                    'Content-Type': 'application/json'
                },
                json={'url': url},
                timeout=30  # Add a timeout to prevent hanging
            )
            
            response.raise_for_status()  # Raise an exception for bad status codes
            
            parsed_content = response.json()
            html_content = parsed_content.get("html", "")
            
            if not html_content.strip():  # Check if HTML is empty or just whitespace
                logger.warning(f"Skipping article with empty HTML content: {url}")
                continue
            
            processed_output = {
                "title": parsed_content.get("title", article.get("title", "N/A")),
                "summary": parsed_content.get("summary", []),
                "html": html_content,
                "url": url,
                "sentiment": parsed_content.get("sentiment", {}).get("score", 0)
            }
            
            try:
                summary = summarize_article(processed_output["html"])
                processed_output["summary"] = summary
            except Exception as e:
                logger.error(f"Error summarizing article {url}: {str(e)}")
                processed_output["summary"] = "Error generating summary"
            
            processed_articles["articles"].append(processed_output)
            logger.info(f"Successfully processed article: {url}")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error processing article {url}: {str(e)}")
        except ValueError as e:
            logger.error(f"JSON parsing error for article {url}: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error processing article {url}: {str(e)}")
    
    num_processed = len(processed_articles['articles'])
    logger.info(f"Processed {num_processed} articles with non-empty HTML for topic {topic}")
    
    if num_processed == 0:
        logger.error(f"No articles with non-empty HTML found for topic {topic}")
        raise ValueError(f"No valid articles found for topic {topic}")
    
    return processed_articles

def summarize_article(content):
    prompt = f"Summarize the following article, focusing on the most important themes and key points. Provide enough detail for 8-15 second segment, allowing for creative interpretation. Return only the summary without any introductions or additional explanations. The summary should be in english. The article is in HTML format and includes ads, banners, comment section, etc. Ignore the ads, banners, comment section, etc. :\n\n{content}. Summary:"
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
    )
    return chat_completion.choices[0].message.content

def generate_lyrics_from_summaries(processed_articles, genre, sentiment_preference):
    articles = processed_articles["articles"]
    
    if sentiment_preference == "positive":
        filtered_articles = [article for article in articles if article["sentiment"] >= 0]
    elif sentiment_preference == "negative":
        filtered_articles = [article for article in articles if article["sentiment"] <= 0]
    else:
        filtered_articles = articles
    
    if not filtered_articles:
        logger.error(f"No articles found after filtering for {sentiment_preference} sentiment")
        raise ValueError(f"No articles available for lyrics generation with {sentiment_preference} sentiment")
    
    # make a string of the summaries with the title in a dictionary looking thing
    summaries_string = "{"
    for article in filtered_articles:
        summaries_string += ("{" + f"Title: {article['title']}\nSummary: {article['summary']}\n\n" + "}")
    summaries_string += "}"
    
    # Construct a detailed prompt for a linear structure with hard transitions between events and genre flexibility
    prompt = f"""
    Suno’s music will be influenced by the poetic-structure, including the number of syllables on each line, the pauses, and which words rhyme. 

    The following song should be around 2 minutes long and should summarize the key points from each of the articles below in a linear way, with hard transitions between each event or concept. There should be no repeating choruses or linking of content between sections. Each section should focus solely on its own topic, and there should be a noticeable shift in content when moving to the next article or event. The structure should vary depending on the selected genre: give creative freedom to the structure (verses, bridges, etc.) based on the genre, without enforcing a rigid format.
    
    The genre of the song is {genre}.
    Here are the article titles and summaries:

    {summaries_string}
    
    if the summary is something like "I cannot provide a summary of an article that is not provided." then ignore that article.

    Please follow these guidelines while generating the lyrics:
    
    1. **No Repetition**: There should be no repeating choruses or linking between the content of different events. Each section should stand alone with no carryover from previous sections.

    2. **Hard Transitions**: There should be a clear and sharp conceptual shift between each event or article. The listener should immediately know that the song has moved on to a new topic.

    3. **Genre-Based Structure**: Allow the song’s structure to vary based on the genre selected (e.g., a rap might have a free-flowing structure, while a pop song might have more defined sections like verses and bridges). The structure should feel appropriate to the selected genre but give flexibility to include various sections such as [Verse], [Bridge], or others depending on the genre.

    4. **Brevity and Clarity**: Each section should be brief but impactful, summarizing the key points of the event without diving too deeply into details. The goal is to keep the song easy to follow, with a new event or concept in each section.

    5. **Outro**: The song should end with an [Outro] that provides a very concise summary or reflection on all the events. This outro should tie together the key events without introducing new information.

    6. **Genre Influence**: The style and flow of the lyrics should align with the genre chosen. For example:
       - If the genre is rap, the lyrics should have a faster, more rhythmic flow.
       - If the genre is folk, the lyrics should have a more storytelling feel, with pauses and reflection.

    7. **Transitions**: Each section should have a hard conceptual shift between events, ensuring that the listener clearly understands when a new topic is being discussed.

    8. **Conclusion**: The song should conclude with a concise reflection or summary of the key points in the outro, without repeating any earlier content.
    
    Return only the lyrics without any introductions or additional explanations. The lyrics should be in English.     
    
    You will follow the tree-of-thought process to delve deep into the concept, theme, genre, words and tone for this 2-minute song.
    Fit the requirements of the user after doing tree-of-thought. 
    
    Generate the lyrics in a free-form structure depending on the genre, allowing for creative transitions but maintaining hard shifts in topics.
    """

    # Call the Groq API to generate the lyrics
    lyrics_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-70b-versatile",
    )
    
    return lyrics_completion.choices[0].message.content


def generate_song_with_suno(lyrics, genre, title):
    payload = {
        "prompt": lyrics,
        "tags": genre,
        "title": title,
        "make_instrumental": False,
        "wait_audio": True
    }
    response = requests.post(suno_api_link, json=payload)
    return response.json()


def generate_title_from_lyrics(lyrics, topic, genre):
    prompt = f"Return only the title without any introductions or additional explanations. The title should be in English. Generate a title for the following lyrics in the {genre} genre and this topic: {topic}: {lyrics}"
    title_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-70b-versatile",
    )
    return title_completion.choices[0].message.content

def generate_avatar_from_lyrics(lyrics, topic, genre):
    prompt = f"""
    I have an image-generating API, and I want to create an avatar based on the following details:
    - **Lyrics**: {lyrics}
    - **Topic**: {topic}
    - **Genre**: {genre}
    
    The avatar should visually represent the essence and mood of the song and its topic. Make sure the visual style fits the {genre} genre. Please return only the prompt to be used for the image-generating API, ensuring it's concise but descriptive enough to capture the spirit of the song. The avatar should be a human or at least humanoid. Prioritize the topic first, then the genre is minor. Max 10 words.
    """
    avatar_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-70b-versatile",
    )

    formatted_prompt = quote(avatar_completion.choices[0].message.content)
    
    # Construct the URL
    url = f"https://image.pollinations.ai/prompt/{formatted_prompt}"
    return url

# Run a test endpoint
@app.get("/test_generate/")
async def test_generate():
    sample_request = SongRequest(sentiment_preference="positive", genre="rap", topics=["technology", "health"])
    return await generate_songs(sample_request.topics, sample_request.genre, sample_request.sentiment_preference)