# from services.trip_service import get_trip_category, get_travel_season, calculate_daily_budget, print_recommended_places

# #input interaktif
# destination = input("Destination : ")
# # country = input("Country : ")
# days = int(input("Days : "))
# budget = float(input("Budget : "))
# currency = input("Currency : ")
# travel_month = input("Travel Month : ")

# #function
# def print_trip_summary(destination, days, budget, currency, travel_month) :
#     category = get_trip_category(budget)
#     season = get_travel_season(travel_month)
#     daily = calculate_daily_budget(budget, days)

#     print()
#     print("=========================")
#     print("KelanaAI")
#     print("=========================")
#     print(f"Destination : {destination}")
#     # print(f"Country     : {country}")
#     print(f"Days        : {days}")
#     print(f"Budget      : {budget} {currency}")
#     # print(f"Currency    : {currency}")
#     print(f"Category    : {category}")
#     print(f"Daily Budget: {daily} {currency}/Day")
#     print(f"Travel Month: {travel_month}")
#     print(f"Season      : {season}")
#     print_recommended_places()
#     print()

# print_trip_summary(destination, days, budget, currency, travel_month)

# session 3

from fastapi import FastAPI
from pydantic import BaseModel
from services.trip_service import (calculate_daily_budget, get_trip_category, get_transportation_recommendation)

class TripRequest(BaseModel):
    destination:    str
    days:           int
    budget:         float
    travel_style:   str

app = FastAPI()

# a Get Endpoint
@app.get("/")
def home():
    return {"message" : "Welcome to KelanaAI"}

# a Get Health Endpoint
@app.get("/health")
def check_healt():
    return {"status" : "OK"}

# a Get Categories Endpoint
@app.get("/api/v1/trip-categories")
def categories():
    return ["Backpacker", "Standard", "Luxury"]

# a GET recommendations Endpoint
@app.get("/api/v1/recommendations")
def recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

# a GET transportations Endpoint
@app.get("/api/v1/transportations")
def transportations():
    return ["Bus", "Train", "Flight"]

# a POST endpoint - recieves JSON, returns JSON
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    recommended_transport = get_transportation_recommendation(category)
    return {
        "destination" : request.destination,
        "budget" : request.budget,
        "daily_budget" : daily_budget,
        "category" : category,
        "travel_style" : request.travel_style,
        "recommended_transport" : recommended_transport
    }