from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pymongo import MongoClient
import requests
import json

app = FastAPI()

# === Configurations ===
# OpenRouter API
API_KEY = "anass"
MODEL = "openai/o4-mini-high"

# MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["Caftan"]
collection = db["Caftan"]

# Templates and static files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# === Redirection racine vers /Get/Caftan ===
@app.get("/", response_class=HTMLResponse)
async def redirect_root():
    return RedirectResponse(url="/Get/Caftan")


# === Affichage des produits ===
@app.get("/Get/Caftan", response_class=HTMLResponse)
async def get_all_products(request: Request, page: int = 1):
    if page < 1:
        page = 1

    # Pagination : 10 produits par page
    start = (page - 1) * 10 + 1
    end = start + 9
    product_ids = [f"product_{i}" for i in range(start, end + 1)]

    produits = list(collection.find({"product_id": {"$in": product_ids}}))

    return templates.TemplateResponse("index.html", {
        "request": request,
        "produits": produits,
        "page": page,
        "response": None,
        "user_input": ""
    })


# === Chatbot interaction ===
@app.post("/Post/chatbot", response_class=HTMLResponse)
async def post_chat(request: Request, message: str = Form(...), page: int = 1):
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": message}
        ],
        "max_tokens": 300
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com",
        "X-Title": "FastAPI-Chatbot"
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, data=json.dumps(payload))
        result = response.json()
        bot_reply = result["choices"][0]["message"]["content"] if "choices" in result else "Erreur : " + str(result)
    except Exception as e:
        bot_reply = f"Erreur lors de la requête : {str(e)}"

    # Recharger les produits de la page
    start = (page - 1) * 10 + 1
    end = start + 9
    product_ids = [f"product_{i}" for i in range(start, end + 1)]
    produits = list(collection.find({"product_id": {"$in": product_ids}}))

    return templates.TemplateResponse("index.html", {
        "request": request,
        "produits": produits,
        "page": page,
        "response": bot_reply,
        "user_input": message
    })
