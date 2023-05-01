import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl';
import { Star, Place } from "@mui/icons-material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import './app.css';
import { format } from "timeago.js"

import Register from './components/Register';
import Login from './components/Login';
import AddInfo from './components/AddInfo';

function App() {

  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    longitude: 71.26,
    latitude: 51.08,
    zoom: 5,
  })

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({
      ...viewport,
      longitude: long,
      latitude: lat,
      zoom: 7,
    })
  }

  const handleAddClick = (e) => {
    console.log('Hello bratan!!!');
    const { lat: latitude, lng: longtude } = e.lngLat;
    setNewPlace({
      long: longtude,
      lat: latitude,
    })
  }

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err)
      }
    }
    getPins();
  }, []);

  // useEffect(() => {
  //   const map = mapRef.current.getMap();
  //   map.addControl(
  //     new MapboxDirections({
  //       accessToken: mapboxgl.accessToken
  //     }),
  //     'top-left'
  //   );
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      desc,
      title,
      rating,
      long: newPlace.long,
      lat: newPlace.lat,
    }

    try {
      const res = await axios.post('/pins', newPin)
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const removePin = async (id) => {
    try {
      await axios.delete(`/pins/${id}`);
      const res = await axios.get("/pins");
      setPins(res.data);
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className='App'>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ width: '100vw', height: '100vh', }}
        mapStyle="mapbox://styles/saibabdulla/clh22d6bb00lt01p6hlsl819u"
        //initial style: mapbox://styles/saibabdulla/clftdx4h200n001mxdioqadhy
        onDblClick={handleAddClick}
        // onViewportChange={(viewport) => setViewport(viewport)}
        onMove={evt => setViewport(evt.viewport)}
      // transitionDuration="1000"
      // fadeDuration={3000}
      >


          <NavigationControl />
          <GeolocateControl />


        {pins.map(p =>
          <React.Fragment key={p._id}>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              anchor="bottom"
            >
              <Place
                style={{
                  fontSize: "50px",
                  color: p.username === currentUser ? 'maroon' : 'purple',
                  cursor: 'pointer'
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {currentPlaceId === p._id && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label >Place:</label>
                  <h4 className="Place">{p.title}</h4>
                  <label >Review:</label>
                  <p className='desc'>{p.desc}</p>
                  <label >Rating:</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label >Information: </label>
                  <div className="infoBlock">
                    <span className="username">Created by <b>{p.username}</b></span>
                    <span className="date">{format(p.createdAt)}</span>
                  </div>
                  <button onClick={() => removePin(p._id)}>Delete</button>
                </div>
                <AddInfo pin={p} pins={pins} setPins={setPins} setNewPlace={setNewPlace} />
              </Popup>
            )}
          </React.Fragment>
        )}

        {newPlace &&
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  type="text"
                  placeholder='Enter a title'
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder='Say us something about this place'
                  onChange={(e) => setDesc(e.target.value)}
                ></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        }

        {currentUser ?
          (<button className="button logout" onClick={handleLogout}>Log out</button>)
          :
          (<div className='buttons'>
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>)
        }

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />}


      </Map>
    </div>
  );
}

export default App;
