from fastapi import FastAPI, Request
import json
import requests
import asyncio

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

from fastapi import FastAPI, Request
import requests
import asyncio

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.get("/api/py/generate_audio")
async def generate_audio_get(request: Request):
    return {"message": "Testing FastAPI endpoint"}
    
    # SAMPLE
# POST endpoint to receive topics from client
@app.post("/api/py/generate_audio")
async def generate_audio_post(request: Request):
    data = await request.json()
    topics = data.get("selectedTopics")
    genre = data.get("selectedGenre")
    
    if not topics:
        return {"status": "error", "message": "No topics provided"}
    if not genre:
        return {"status": "error", "message": "No genre provided"}
    
    return {"status": "success", "data": {"topics": topics, "genre": genre}}

    # # SAMPLE
    # lyrics = "Sample lyrics"  # You can map this from the topic or data provided
    # genre = "pop"  # You can customize this based on the topic
    # title = "Generated Song"

    # song_data = await generate_song(lyrics=lyrics, genre=genre, title=title, wait_audio=True)

    # return {"topics": topics, "song_data": song_data}

# Function to call Vercel API to generate music
async def generate_song(lyrics: str, genre: str, title: str, wait_audio: bool = False):
    vercel_api_url = "https://suno-api-rust-phi.vercel.app/api/custom_generate"
    
    # Prepare payload for the API request
    payload = {
        "prompt": lyrics,
        "tags": genre,
        "title": title,
        "make_instrumental": False,
        "model": "chirp-v3-5",  
        "wait_audio": wait_audio
    }

    print("Waiting for response from Vercel...")
    
    
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(None, lambda: requests.post(vercel_api_url, json=payload))
    
    if response.status_code == 200:
        result = response.json()
        print("Response received successfully")
        return {"status": "success", "data": result}
    else:
        print(f"Error from Vercel: {response.text}")
        return {"status": "error", "message": "Failed to generate song", "details": response.text}

# Example lyrics creation function
def create_lyrics():
    return """
    [Verse 1]
    Machines learning, guiding our hands
    Data flowing through healthcare lands
    (Artificial thoughts, healing souls)

    [Chorus]
    Revolution in AI's grasp (oh yeah)
    Tech that saves, a future vast (echoes)

    [Verse 2]
    Doctors' minds and code combined
    Cures of tomorrow, they're aligned
    (Science and heart, we won't look back)

    [Chorus]
    Revolution in AI's grasp (oh yeah)
    Tech that saves, a future vast (echoes)
    """
