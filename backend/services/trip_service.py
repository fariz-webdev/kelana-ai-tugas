recommended_places = ["Tokyo Tower", "Shibuya", "Mount Fuji"]

def get_trip_category(budget):
  if budget < 1000 :
    return "Backpacker"
  elif budget <= 3000 :
    return "Standart"
  else :
    return "Luxury"

def get_travel_season(month):
  if month.lower() == "december" :
    return "Peak Season"
  elif month.lower() == "june" :
    return "Holiday Season"
  else :
    return "Regular Season"

def calculate_daily_budget(budget, days):
  return budget/days

def print_recommended_places():
  print()
  print("Recommended Places")
  for place in recommended_places:
    print(f"- {place}")

def get_transportation_recommendation(category):
    match category:
        case "Backpacker":
            return "Bus"
        case "Standard":
            return "Train"
        case "Luxury":
            return "Flight"