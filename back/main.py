from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import groq
import json
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize the Groq client
groq_client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route('/api/generate-prototype', methods=['POST'])
def generate_prototype():
    logger.info("Received request to /api/generate-prototype")
    
    prompt = request.json.get('prompt')
    logger.info(f"Extracted prompt: {prompt}")
    
    if not prompt:
        logger.warning("No prompt provided in the request")
        return jsonify({"error": "No prompt provided"}), 400

    try:
        system_message = """You are an AI assistant that generates a comprehensive detailed and styled HTML and CSS full website based on an idea.
        The styles should include a color theme, custom font (if no custom font, use Arial by default), make the webpage structured and clear to understand. Have a navigation bar, footer, some content and some placeholders to give a sample of what the website should look like.
        The user is looking for an example of what they're idea would look like, so make things up and use example content.
        Make sure to remember the features of the website, display example content and let the user examplify the core functionality of their idea.
        Your response should be a JSON object with the following structure:
        {
            "code": "HTML and CSS Code for the idea",
            "prelude": "Description of style choices made for the website, color themes and functionality.",
        }
        Do not use backticks or newlines (\n) within the JSON structure."""

        logger.info("Making request to Groq API")
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            model="mixtral-8x7b-32768",
            temperature=1,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"},
            stop=None
        )

        response_content = json.loads(chat_completion.choices[0].message.content)
        logger.info("Successfully parsed API response")
        logger.debug(f"Parsed response content: {response_content}")

        # Reshape the response to match expected structure
        reshaped_response = {
            "code": response_content.get("code") or response_content.get("prototypeCode", ""),
            "prelude": response_content.get("prelude", ""),
            "languages": response_content.get("languages", ["HTML", "CSS"])
        }

        return jsonify(reshaped_response)

    except json.JSONDecodeError as json_error:
        logger.error(f"JSON decode error: {json_error}")
        return jsonify({"error": "Failed to parse API response", "details": str(json_error)}), 500
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)