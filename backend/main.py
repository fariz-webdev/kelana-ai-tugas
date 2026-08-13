from services.trip_service import get_trip_category, get_travel_season, calculate_daily_budget, print_recommended_places

#input interaktif
destination = input("Destination : ")
# country = input("Country : ")
days = int(input("Days : "))
budget = float(input("Budget : "))
currency = input("Currency : ")
travel_month = input("Travel Month : ")

#function
def print_trip_summary(destination, days, budget, currency, travel_month) :
    category = get_trip_category(budget)
    season = get_travel_season(travel_month)
    daily = calculate_daily_budget(budget, days)

    print()
    print("=========================")
    print("KelanaAI")
    print("=========================")
    print(f"Destination : {destination}")
    # print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    # print(f"Currency    : {currency}")
    print(f"Category    : {category}")
    print(f"Daily Budget: {daily} {currency}/Day")
    print(f"Travel Month: {travel_month}")
    print(f"Season      : {season}")
    print_recommended_places()
    print()

print_trip_summary(destination, days, budget, currency, travel_month)