import google.generativeai as genai
import sys
import json

class Chatbot:
    def __init__(self):
        # Configure the Google Generative AI API
        genai.configure(api_key="AIzaSyBHZS0r09B2MvbSRpMWqEnxQlg40gimxZo")

    def start_chat(self, prompt):
        # Use the Google Generative model (Gemini-1.5-flash)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return response.text

    def continue_chat(self, prompt):
        # Continue the conversation by generating new content based on the previous prompt
        return self.start_chat(prompt)

# Listen for input and send output
if __name__ == "__main__":
    prompt = sys.argv[1]
    chatbot = Chatbot()
    response = chatbot.start_chat(prompt)  # Start the conversation with the prompt
    print(json.dumps({'reply': response}))  # Return the generated response
