import gradio as gr
import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_quiz(topic, count):
    prompt = f"""
    Generate {int(count)} MCQ questions on {topic}.
    Return ONLY valid JSON, no markdown, no explanation.
    [
      {{
        "question": "...",
        "options": {{"A":"...", "B":"...", "C":"...", "D":"..."}},
        "answer": "A"
      }}
    ]
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content

demo = gr.Interface(
    fn=generate_quiz,
    inputs=["text", "number"],
    outputs="text"
)

demo.launch()
