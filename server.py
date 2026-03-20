import os
from flask import Flask, request
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    topic = data.get("topic")
    count = data.get("count")

    prompt = f"""
    Generate {count} MCQ questions on {topic}.
    Return JSON format:
    [
      {{
        "question": "...",
        "options": {{"A":"...", "B":"...", "C":"...", "D":"..."}},
        "answer": "A"
      }}
    ]
    Return only the JSON array, no extra text.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    app.run(debug=True, port=5000)
