import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq Client
# Ensure you have 'GROQ_API_KEY' in your Replit Secrets or .env file
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are Sarkar Saathi, a helpful AI assistant for rural Indians.
You help people find and apply for Indian government welfare schemes.

You know about these schemes:
- PM-KISAN: ₹6000/year for farmers
- Ayushman Bharat: ₹5 lakh health cover for poor families
- PM Awas Yojana: Housing subsidy for poor
- MGNREGA: 100 days employment for rural workers
- PM Mudra Yojana: Business loans up to ₹10 lakh
- Beti Bachao Beti Padhao: Support for girl child
- National Food Security: Subsidized food grains

Rules:
1. Always reply in the SAME language the user writes in.
2. If user writes in Hindi, reply in Hindi.
3. If user writes in Tamil, reply in Tamil.
4. Keep replies SHORT and SIMPLE (WhatsApp friendly).
5. Always ask one question at a time.
6. Be warm and friendly like a helpful neighbor.
7. When you know enough about the user, recommend specific schemes.
8. Always end with the apply link when recommending a scheme."""

def ask_claude(conversation_history, user_message):
    """
    Keeping the function name 'ask_claude' so you don't have to 
    change your main.py file, but it now uses Groq internally.
    """
    # 1. Add user message to history
    conversation_history.append({
        "role": "user",
        "content": user_message
    })

    try:
        # 2. Call Groq API (Llama 3 70B is excellent for Indian languages)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *conversation_history
            ],
            temperature=0.7,
            max_tokens=500,
        )

        reply = completion.choices[0].message.content

        # 3. Add AI reply to history
        conversation_history.append({
            "role": "assistant",
            "content": reply
        })

        return reply, conversation_history

    except Exception as e:
        print(f"Groq API Error: {e}")
        # Return a fallback message if the API fails
        return "Shama karein, abhi main jawab nahi de pa raha hoon. Kripya thodi der baad koshish karein.", conversation_history
