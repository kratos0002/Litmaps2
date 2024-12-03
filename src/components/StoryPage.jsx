import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import axios from 'axios';
import '../styles/StoryPage.css'; // Add custom CSS

const StoryPage = () => {
  const { id } = useParams(); // Extract story ID from the URL
  const [story, setStory] = useState(null);
  const [originalText, setOriginalText] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
  ];

  useEffect(() => {
    const fetchStory = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('storyid', id)
        .single();

      if (error) {
        console.error('Error fetching story:', error);
        return;
      }

      setStory(data);

      // Fetch the original text
      if (data.originaltexturl) {
        try {
          const response = await fetch(data.originaltexturl);
          const text = await response.text();
          setOriginalText(text);
        } catch (error) {
          console.error('Error fetching text file:', error);
        }
      }
    };

    fetchStory();
  }, [id]);

  const translateStory = async () => {
    setLoadingTranslation(true);

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2`,
        {
          q: originalText,
          target: selectedLanguage,
          format: 'text',
        },
        {
          headers: {
            Authorization: `Bearer YOUR_GOOGLE_API_KEY`,
          },
        }
      );

      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
    } catch (error) {
      console.error('Error translating text:', error);
    } finally {
      setLoadingTranslation(false);
    }
  };

  if (!story) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="story-container">
      <div className="story-header">
        <h1 className="story-title">{story.title}</h1>
        <p className="story-author"><strong>Author:</strong> {story.author}</p>
        <p className="story-description">{story.shortdescription}</p>
      </div>

      <div className="story-content">
        <h3>Original Text:</h3>
        <pre className="story-text">
          {originalText || 'Loading original text...'}
        </pre>
      </div>

      <div className="translation-section">
        <h3>Translate:</h3>
        <div className="translation-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="language-selector"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={translateStory}
            disabled={loadingTranslation}
            className="translate-button"
          >
            {loadingTranslation ? 'Translating...' : 'Translate'}
          </button>
        </div>
        <div className="translated-content">
          <h3>Translated Text:</h3>
          <pre className="story-text">
            {translatedText || 'No translation yet.'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
