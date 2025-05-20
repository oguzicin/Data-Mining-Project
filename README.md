#  Author Classification & Text Tagging Web App



Built with:
-  **Frontend**: React + TypeScript
-  **Backend**: Flask + Scikit-learn/BERT
-  Deployed via: [Heroku / Your platform here]

---
##  Over view
This application is designed to analyze written text by predicting its likely author and tagging it with relevant keywords that summarize its topic. It’s built for students, researchers, and content analysts interested in authorship attribution and topic modeling. The ML backend combines traditional models like TF-IDF and N-grams with deep learning via BERT for flexible and accurate predictions.

##  Features

###  Text Input & Author Prediction
Users can paste any piece of text into the input box and click submit. The backend processes the text and returns a predicted author, along with a confidence score. The model is trained on a curated dataset and supports multiple classification approaches, from statistical models to transformer-based embeddings.

For testing: Paste in different paragraphs from known authors to explore the prediction output.

###  Keyword Tagging
In addition to authorship prediction, the backend extracts key topics and themes from the input text. These are returned as tags and displayed below the prediction result, providing quick insight into the content's subject matter.

For testing: Try providing text from different genres or topics and observe how the tags change.

###  Visual Analysis (Future Scope)
-Upcoming versions will include visual tools for:

-Confidence heatmaps for author predictions

-Keyword frequency graphs across inputs

-Tag clustering and co-occurrence maps

## Deployment

### Backend(Flask)
1.Navigate to the backend directory:
### `cd backend`  
2.Start the Flask server:
### `python app.py`

### Frontend(React)
1.Navigate to the frontend directory:
### `cd data-mining-v2` 
2.Start the development server:
### `npm run start`
Visit http://localhost:3000 to use the application.

---




