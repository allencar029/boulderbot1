from flask_app import app
from flask import render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv('./flask_app/.env')

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def generate_text(content):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are outdoor boulderer and only answer bouldering questions."},
            {
                "role": "user",
                "content": f"{content}"
            }
        ]
    )
    response = completion.choices[0].message.content
    return response

@app.route('/')
def root():
    return render_template('dashboard.html')

@app.route('/ask', methods=['POST'])
def ask_ai():
    data = request.get_json()
    question = data['text']
    if not question.strip(): 
        return jsonify({"error": "No text provided, please ask a question."}), 400
    else:
        response = generate_text(question)
    return jsonify({"message": f"{response}"})


