import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import supabase from '../supabaseClient'; // Import your Supabase client





const Globe = () => {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 2,
  });

  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch story data
  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories') // Name of your Supabase table
        .select('storyid, title, latitude, longitude, shortdescription, originaltexturl, translatedtexturl');

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      console.log('Fetched stories:', data); // Debug fetched stories
      setStories(data);
    };

    fetchStories();
  }, []);


  return (
    <div style={{ height: '100vh' }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1Ijoia3JhdG9zMDAwMiIsImEiOiJjbTQ4Y280aG0wZm4xMmtzZGZrcXdoMXFuIn0.z_AqjSVzYjEXg5eDtnVYpQ"
        collectResourceTiming={false} // Disables telemetry

      >
        {stories.map((story) => (
          <Marker
            key={story.id}
            latitude={story.latitude}
            longitude={story.longitude}
          >
            <button
              onClick={() => setSelectedStory(story)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              📍
            </button>
          </Marker>
        ))}

        {selectedStory && (
          <Popup
            latitude={selectedStory.latitude}
            longitude={selectedStory.longitude}
            onClose={() => setSelectedStory(null)}
            closeOnClick={false}
          >
            <h3>{selectedStory.title}</h3>
            <p>{selectedStory.shortdescription}</p>
            <a href={selectedStory.originalTextURL} target="_blank" rel="noreferrer">
              Original Story
            </a>
            <br />
            <a href={selectedStory.translatedTextURL} target="_blank" rel="noreferrer">
              Translated Story
            </a>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default Globe;