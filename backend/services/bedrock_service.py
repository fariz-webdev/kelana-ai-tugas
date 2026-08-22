from dotenv import load_dotenv
import boto3
import os
import json

# Load .env from the backend directory (one level up from services/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

AWS_BEARER_TOKEN = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
AWS_REGION       = os.getenv("AWS_REGION", "us-east-1")
MODEL_ID         = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def get_bedrock_client():
    """
    Configure and return a boto3 bedrock-runtime client using
    credentials loaded from the .env file.
    """
    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
        aws_session_token=AWS_BEARER_TOKEN,
    )
    return client


def get_ai_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
    daily_budget: float,
    recommended_transport: str,
    max_tokens: int = 1024,
    temperature: float = 0.7,
) -> str:
    """
    Generate an AI travel itinerary using Amazon Bedrock.

    Args:
        destination:   Travel destination (e.g. "Bali").
        days:          Number of trip days.
        budget:        Total budget in USD.
        travel_style:  Travel style (e.g. "Backpacker", "Luxury").
        max_tokens:    Maximum tokens in the response.
        temperature:   Sampling temperature (0.0 – 1.0).

    Returns:
        The AI-generated itinerary as a plain string.
    """
    prompt = (
        f"You are an experienced travel planner.\n"
        f"Plan a {days}-day itinerary for {destination}.\n"
        f"Budget: USD {budget}\n"
        f"Travel Style: {travel_style}.\n"
        f"Estimated daily budget: {daily_budget}.\n"
        f"Transportation suggestions: {recommended_transport}.\n"
        "For each day, please follow this exact structure:\n"
        "- Morning Activities: Provide 2-3 engaging morning activities or location to start day.\n"
        "- Afternoon Activities: Include recommendations for cultural sites and authenti local experiences.\n"
        "- Evening Activities: Suggest top-rated dinner spots anda vibrant nightlife or evening entertainment options.\n"
        "please include local food recommendations, best transportation options between each location and total estimated daily spend in USD and local currency for each day.\n"
        "Give the answer with markdown format."
    )

    client = get_bedrock_client()

    body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
        "inferenceConfig": {
            "maxTokens": max_tokens,
            "temperature": temperature,
        },
    }

    response = client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )

    result = json.loads(response["body"].read())

    # Extract text from Amazon Nova response shape
    return result["output"]["message"]["content"][0]["text"]
