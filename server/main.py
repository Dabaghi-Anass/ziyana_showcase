from fastapi import FastAPI, Request, Form, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import google.generativeai as genai
from google.generativeai import types
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import requests
import json
import os
import uuid
from PIL import Image
import io
import math
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
app = FastAPI(title="Caftan API", description="API for managing caftans and reviews", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
sys_instructions = ''
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')
def generate(prompt: str):
    prompt = sys_instructions+prompt
    response = model.generate_content(prompt)
    return response.text.strip()

# MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "ziyana_show_room")

client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]
caftans_collection = db["caftans"]
reviews_collection = db["reviews"]

# Create upload directory if it doesn't exist
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# === Pydantic Models ===
class CaftanCreate(BaseModel):
    caftanName: str
    caftanCategory: str
    caftanDescription: str
    caftanPublisherName: str
    keyWords: List[str]
    image_url: Optional[str] = None

class CaftanResponse(BaseModel):
    id: str
    image_url: Optional[str]
    caftanName: str
    caftanCategory: str
    caftanDescription: str
    caftanPublisherName: str
    publishedAt: datetime
    keyWords: List[str]

class ReviewCreate(BaseModel):
    caftan_id: str
    client_name: str
    rating: int  # 1-5 scale
    comment: str

class ReviewResponse(BaseModel):
    id: str
    caftan_id: str
    client_name: str
    rating: int
    comment: str
    created_at: datetime

class ChatMessage(BaseModel):
    message: str

# === Helper Functions ===
def compress_image(image_data: bytes, max_size: tuple = (800, 800), quality: int = 85) -> bytes:
    """Compress image while maintaining aspect ratio"""
    with Image.open(io.BytesIO(image_data)) as img:
        # Convert to RGB if necessary
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Resize image while maintaining aspect ratio
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save compressed image
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=quality, optimize=True)
        return output.getvalue()

def generate_filename(original_filename: str) -> str:
    """Generate unique filename"""
    extension = os.path.splitext(original_filename)[1].lower()
    if extension not in ['.jpg', '.jpeg', '.png', '.gif']:
        extension = '.jpg'
    return f"{uuid.uuid4()}{extension}"

# === Routes ===

# === Root endpoint ===
@app.get("/")
async def root():
    """Root endpoint - returns API information"""
    return {
        "message": "Welcome to Caftan API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "caftans": "/api/caftans",
            "reviews": "/api/reviews",
            "upload": "/api/upload-image",
            "chatbot": "/api/chatbot",
            "health": "/health"
        }
    }

# === Caftan CRUD Operations ===

@app.post("/api/caftans")
async def create_caftan(caftan: CaftanCreate):
    """Create a new caftan"""
    try:
        caftan_doc = {
            "image_url": caftan.image_url,
            "caftanName": caftan.caftanName,
            "caftanCategory": caftan.caftanCategory,
            "caftanDescription": caftan.caftanDescription,
            "caftanPublisherName": caftan.caftanPublisherName,
            "publishedAt": datetime.utcnow(),
            "keyWords": caftan.keyWords
        }
        
        result = caftans_collection.insert_one(caftan_doc)
        return {
            "success": True,
            "id": str(result.inserted_id), 
            "message": "Caftan created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating caftan: {str(e)}")

@app.get("/api/caftans")
async def get_caftans(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    name: Optional[str] = None,
    search: Optional[str] = None
):
    """Get caftans with pagination and filtering"""
    try:
        # Build query
        query = {}
        if category:
            query["caftanCategory"] = {"$regex": category, "$options": "i"}
        if name:
            query["caftanName"] = {"$regex": name, "$options": "i"}
        if search:
            query["$or"] = [
                {"caftanName": {"$regex": search, "$options": "i"}},
                {"caftanDescription": {"$regex": search, "$options": "i"}},
                {"keyWords": {"$in": [search]}}
            ]
        
        # Calculate pagination
        skip = (page - 1) * limit
        total_count = caftans_collection.count_documents(query)
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1
        
        # Get data
        caftans = list(caftans_collection.find(query).skip(skip).limit(limit))
        
        # Convert ObjectId to string
        for caftan in caftans:
            caftan["_id"] = str(caftan["_id"])
        
        return {
            "success": True,
            "data": caftans,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_count": total_count,
                "has_next": page < total_pages,
                "has_prev": page > 1,
                "limit": limit
            },
            "filters": {
                "category": category,
                "name": name,
                "search": search
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching caftans: {str(e)}")

@app.get("/api/caftans/{caftan_id}")
async def get_caftan_by_id(caftan_id: str):
    """Get specific caftan by ID"""
    from bson import ObjectId
    
    try:
        caftan = caftans_collection.find_one({"_id": ObjectId(caftan_id)})
        if not caftan:
            raise HTTPException(status_code=404, detail="Caftan not found")
        
        caftan["_id"] = str(caftan["_id"])
        return {
            "success": True,
            "data": caftan
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid caftan ID")

@app.put("/api/caftans/{caftan_id}")
async def update_caftan(caftan_id: str, caftan: CaftanCreate):
    """Update a caftan"""
    from bson import ObjectId
    
    try:
        update_doc = {
            "image_url": caftan.image_url,
            "caftanName": caftan.caftanName,
            "caftanCategory": caftan.caftanCategory,
            "caftanDescription": caftan.caftanDescription,
            "caftanPublisherName": caftan.caftanPublisherName,
            "keyWords": caftan.keyWords,
            "updatedAt": datetime.utcnow()
        }
        
        result = caftans_collection.update_one(
            {"_id": ObjectId(caftan_id)}, 
            {"$set": update_doc}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Caftan not found")
        
        return {
            "success": True,
            "message": "Caftan updated successfully",
            "modified_count": result.modified_count
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid caftan ID")

@app.delete("/api/caftans/{caftan_id}")
async def delete_caftan(caftan_id: str):
    """Delete a caftan"""
    from bson import ObjectId
    
    try:
        result = caftans_collection.delete_one({"_id": ObjectId(caftan_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Caftan not found")
        
        # Also delete related reviews
        reviews_collection.delete_many({"caftan_id": caftan_id})
        
        return {
            "success": True,
            "message": "Caftan and related reviews deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid caftan ID")


@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload and compress caftan image"""
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Check file size (max 5MB)
    max_size = int(os.getenv("MAX_FILE_SIZE", 5242880))  # 5MB default
    
    try:
        # Read file data
        file_data = await file.read()
        
        if len(file_data) > max_size:
            raise HTTPException(status_code=400, detail=f"File too large. Max size: {max_size/1024/1024:.1f}MB")
        
        # Compress image
        compressed_data = compress_image(file_data)
        
        # Generate filename
        filename = generate_filename(file.filename)
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save compressed image
        with open(file_path, "wb") as f:
            f.write(compressed_data)
        
        # Return file URL
        file_url = f"/uploads/{filename}"
        return {
            "success": True,
            "message": "Image uploaded successfully",
            "data": {
                "file_path": file_path,
                "file_url": file_url,
                "filename": filename,
                "original_size": len(file_data),
                "compressed_size": len(compressed_data),
                "compression_ratio": f"{(1 - len(compressed_data)/len(file_data))*100:.1f}%"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

# === Reviews CRUD Operations ===

@app.post("/api/reviews")
async def create_review(review: ReviewCreate):
    """Create a new review"""
    
    # Validate rating
    if review.rating < 1 or review.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if caftan exists
    from bson import ObjectId
    try:
        caftan = caftans_collection.find_one({"_id": ObjectId(review.caftan_id)})
        if not caftan:
            raise HTTPException(status_code=404, detail="Caftan not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid caftan ID")
    
    try:
        review_doc = {
            "caftan_id": review.caftan_id,
            "client_name": review.client_name,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": datetime.utcnow()
        }
        
        result = reviews_collection.insert_one(review_doc)
        return {
            "success": True,
            "id": str(result.inserted_id), 
            "message": "Review created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating review: {str(e)}")

@app.get("/api/reviews")
async def get_reviews(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    caftan_id: Optional[str] = None,
    min_rating: Optional[int] = Query(None, ge=1, le=5),
    max_rating: Optional[int] = Query(None, ge=1, le=5)
):
    """Get reviews with pagination and filtering"""
    try:
        # Build query
        query = {}
        if caftan_id:
            query["caftan_id"] = caftan_id
        if min_rating is not None:
            query["rating"] = {"$gte": min_rating}
        if max_rating is not None:
            if "rating" in query:
                query["rating"]["$lte"] = max_rating
            else:

                query["rating"] = {"$lte": max_rating}
        
        # Calculate pagination
        skip = (page - 1) * limit
        total_count = reviews_collection.count_documents(query)
        total_pages = math.ceil(total_count / limit) if total_count > 0 else 1
        
        # Get data
        reviews = list(reviews_collection.find(query).skip(skip).limit(limit).sort("created_at", -1))
        
        # Convert ObjectId to string
        for review in reviews:
            review["_id"] = str(review["_id"])
        
        # Calculate average rating if filtering by caftan_id
        avg_rating = None
        if caftan_id:
            pipeline = [
                {"$match": {"caftan_id": caftan_id}},
                {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
            ]
            result = list(reviews_collection.aggregate(pipeline))
            if result:
                avg_rating = round(result[0]["avg_rating"], 2)
        
        return {
            "success": True,
            "data": reviews,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_count": total_count,
                "has_next": page < total_pages,
                "has_prev": page > 1,
                "limit": limit
            },
            "filters": {
                "caftan_id": caftan_id,
                "min_rating": min_rating,
                "max_rating": max_rating
            },
            "statistics": {
                "average_rating": avg_rating
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reviews: {str(e)}")

@app.get("/api/caftans/{caftan_id}/reviews")
async def get_caftan_reviews(
    caftan_id: str, 
    page: int = Query(1, ge=1), 
    limit: int = Query(10, ge=1, le=100)
):
    """Get reviews for a specific caftan"""
    return await get_reviews(page=page, limit=limit, caftan_id=caftan_id)

@app.delete("/api/reviews/{review_id}")
async def delete_review(review_id: str):
    """Delete a review"""
    from bson import ObjectId
    
    try:
        result = reviews_collection.delete_one({"_id": ObjectId(review_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return {
            "success": True,
            "message": "Review deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid review ID")
    
@app.post("/api/chatbot")
async def chatbot(chat: ChatMessage):
    try:
        print(f"Received message: {chat.message}")
        res = generate(chat.message)
        return {
            "success": True,
            "data": {
                "user_message": chat.message,
                "bot_response": res,
                "timestamp": datetime.utcnow()
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": f"Gemini Error: {str(e)}",
            "data": {
                "user_message": chat.message,
                "bot_response": None,
                "timestamp": datetime.utcnow()
            }
        }

@app.get("/api/statistics")
async def get_statistics():
    """Get API statistics"""
    try:
        total_caftans = caftans_collection.count_documents({})
        total_reviews = reviews_collection.count_documents({})
        
        # Category distribution
        category_pipeline = [
            {"$group": {"_id": "$caftanCategory", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        categories = list(caftans_collection.aggregate(category_pipeline))
        
        # Average rating
        rating_pipeline = [
            {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
        ]
        rating_result = list(reviews_collection.aggregate(rating_pipeline))
        avg_rating = round(rating_result[0]["avg_rating"], 2) if rating_result else 0
        
        # Recent activity
        recent_caftans = caftans_collection.count_documents({
            "publishedAt": {"$gte": datetime.utcnow().replace(day=1)}
        })
        recent_reviews = reviews_collection.count_documents({
            "created_at": {"$gte": datetime.utcnow().replace(day=1)}
        })
        
        return {
            "success": True,
            "data": {
                "totals": {
                    "caftans": total_caftans,
                    "reviews": total_reviews
                },
                "categories": categories,
                "ratings": {
                    "average": avg_rating
                },
                "recent_activity": {
                    "caftans_this_month": recent_caftans,
                    "reviews_this_month": recent_reviews
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

# === Health Check ===
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db.command("ping")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "database": db_status,
        "upload_dir": os.path.exists(UPLOAD_DIR)
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "False").lower() == "true"
    
    uvicorn.run(app, host=host, port=port, reload=debug)