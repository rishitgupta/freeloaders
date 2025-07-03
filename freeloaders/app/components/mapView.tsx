"use client"

import React, {CSSProperties, useEffect, useState, useRef, useCallback} from 'react';
import {APIProvider, Map, useMap, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import styled from "styled-components";
import { Organization, Comment, Student } from '@prisma/client';
import { useSession } from "next-auth/react";
import PinColorModal from "./key";

// the input info (except desc)
const PopupTextInfo = styled.h4`
    padding-left: 2vh;
    padding-right: 5vh;
    font-size: 1.2rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    box-sizing: border-box;
    word-wrap: break-word;
`

const PopupTextInfoRed = styled.h4`
    color: red;
    padding-left: 2vh;
    padding-right: 2vh;
    font-size: 1.2rem;
    font-family: ${p => p.theme.font.heading};
    box-sizing: border-box;
    word-wrap: break-word;
`

// only event name (probably)
const PopupTextTitle = styled.h4`
    padding-top: 5vh;
    padding-left: 3.5vh;
    padding-right: 5vh;
    font-size: 2rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    box-sizing: border-box;
    word-wrap: break-word;
`

// club name (only for now)
const PopupTextSmallerHeader = styled.h4`
    padding-left: 3.5vh;
    padding-right: 5vh;
    font-size: 1.5rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    box-sizing: border-box;
    word-wrap: break-word;
`

// the icons
const PopupImg = styled.img`
    padding-left: 3.5vh;
`

// icon+text (flexbox) (like Food Info!, etc)
const PopupHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`
const PopupTitle = styled.div`
    padding-left: 1vh;
    font-size: 1.6rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    box-sizing: border-box;
    word-wrap: break-word;
`

// for the event info in popup
const PopupInfo = styled.div`
    padding-left: 2vh;
    padding-right: 2vh;
`

// comment stuff
const CommentProfContainer = styled.div`
    padding-left: 1.1vh;
    padding-right: 1vh;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`

const SubmitButton = styled.button`
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    color: ${p => p.theme.color.default};
    background-color: #e0e0e0;
    border: 2px solid #8A8A8A; 
    border-radius: 8px;
    cursor: pointer;
    font-family: ${p => p.theme.font.heading};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25); 

    &:hover {
        background-color: #d0d0d0;
    }
`;

const CommentDisplayName = styled.h4`
    padding-left: 0.5vh;
    padding-right: 1vh;
    padding-top:1.3vh;
    font-size: 1.25rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.white};
    box-sizing: border-box;
    word-wrap: break-word;
`

// like the blurb
const CommentBox= styled.div`
    color: ${p => p.theme.color.white};
    padding-left: 1vh;
    padding-right: 5vh;
    padding-top: 0.5vh;
`

const CommentInfo = styled.h4`
    padding-left: 2vh;
    padding-right: 2vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    font-size: 1.2rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    box-sizing: border-box;
    word-wrap: break-word;
    background-color: ${p => p.theme.color.white};
    border-radius: 20px;
`

const ProfilePictureImage = styled.img`
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  margin-right: 10px; 
  object-fit: cover; 
`

const InputField = styled.input`
    width: 100%;
    padding: 0.5rem;
    padding-left: 5vh;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    padding-left:15px;
    padding-right:5px;
    color: ${p => p.theme.color.default};
`

const CommentInputContainer = styled.div`
    padding-left: 1vh;
    padding-right: 2vh;
`

const BulletPoints = styled.ul`
    list-style-type: disc; 
    padding-left: 5vh;
    color: ${p => p.theme.color.white};
`

// Event object variables (word for word from database)
type mapEvent ={ 
  id: number,
  name: string, 
  description: string,
  food_type: string, 
  quantity: string,
  location: string,
  location_select: string,
  latitude: number,
  longitude: number,
  start_time: Date,
  end_time: Date,
  photo: string | null,
  organizationId: number,
  organization: Organization,
  comments: Comment[]
}

// map 
const MapView = () => {
  const [events, setEvents] = useState<mapEvent[]>([]);
  const [showKeyModal, setShowKeyModal] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getevents');
        if (!response.ok) {
          const error= await response.json();
          console.log(error);
          return;
        }
        const data = await response.json();

        // prisma stores time as utc (so convert to utc)
        const currentTime = new Date().toISOString(); 

        // filter by time: don't include events that ended before current time
        const filteredEvents = data.filter(event => { 
          return event.end_time >= currentTime; 
        });

        setEvents(filteredEvents);
        
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    // map screen
    <APIProvider apiKey={"AIzaSyCQkzGZi6LfAzkukJxdE8twTdzrMarNjvo"} >
      <Map
        // full screen (minus navbar space)
        style={{width: '100vw', height: '90vh', position: 'absolute'}}
        // calpoly, can change lat/lng to change default
        defaultCenter={{ lat: 35.3007741, lng: -120.6618162 }}
        defaultZoom={17}
        // change in google cloud (needed for advanced markers)
        mapId='bc1a32a7945f3e86'
        // to get rid of all map buttons
        disableDefaultUI
      >
      {/* the pins (includes clusters and everything) */}
      <MapMarkers pois={events} />
      </Map> 
    </APIProvider>
  );
};

// pin colors (can change for sure (the colors, and time ranges)!)
function getPinColor(start_time: Date, end_time: Date): string { 
  const current = new Date().getTime(); 
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();

  // ongoing -> green
  if (current >= start && current <= end) { 
    return 'green'; 
  } else { 
      // time diff between current and start (to see how soon event is)
      // time is in ms (10^3 ms/s, 60 s/min, 60 min/hr)
      const hourDiff = (start - current) / (3600000); 
      // in less then 2 hours -> orange (*can change anytime*)
      if (hourDiff <= 2) {
        return 'orange'; 
      } else {
      // longer -> red
        return 'red'; 
      }
  }
}
 
const styles: { [key: string]: CSSProperties } = {
  popup: {
    position: 'fixed',
    bottom: 0,
    width: '500px',
    height: '90%',
    backgroundColor: '#7D84B2',
    overflow: 'auto'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: 'white',
  }
};

const EventPopup = ( {popupInfo, onClose} ) => {
  const { data: session, status } = useSession();

  // comment info
  const [comment, setComment] = useState('');
  const [showError, setShowError] = useState(false);
  const [Error, setError] = useState('');

  useEffect(() => {
    setComment('');
  }, [popupInfo]);
   
  // otherwise submits comment with enter key
  const handleKeyPress = (e) => { 
    if (e.key === 'Enter') { 
      e.preventDefault(); 
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('/api/addcomment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: comment,
              studentId: session.user.id,
              eventId: popupInfo.poi.id
        }),
    });

    if (!response.ok) {
        // display error (should be red text)
        const errorData = await response.json();
        setError(errorData.error);
        setShowError(true);
        return;
    }
    // back to map (to refresh comments)
    window.location.href = '/'
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div style={styles.popup} > 
          <span style={styles.closeButton} 
          onClick={onClose}>&#x2716;</span> 
          {/* there's a default image if photo is null (could change) */}
          <img src={popupInfo?.poi.photo ? popupInfo?.poi.photo: 'https://events.calpoly.edu/sites/events.calpoly.edu/files/2024-07/saf-2023-3.jpg'} alt="event image" style={{ width: '100%' }}/>
          <PopupTextTitle>{popupInfo?.poi.name}</PopupTextTitle>
          <PopupTextSmallerHeader>Brought to you by: {popupInfo?.poi.organization.display_name}</PopupTextSmallerHeader>
          <br/>
          <PopupInfo>
            <PopupTextInfo>{popupInfo?.poi.description}</PopupTextInfo>
          </PopupInfo>
          <br/>
          <hr/>
          <br/>
          <PopupHeader>
              <PopupImg src="/images/hash.png" alt="hash" style={{ width: '65px' }} />
              <PopupTitle> Food Info </PopupTitle>
          </PopupHeader>
          <PopupInfo>
            <br/>
            <PopupTextInfo>Provided Food: {popupInfo?.poi.food_type}</PopupTextInfo>          
            <PopupTextInfo>Initial quantity: {popupInfo?.poi.quantity}</PopupTextInfo>
            <br/>
          </PopupInfo>
          <hr></hr>
          <br/>
          <PopupHeader>
            <PopupImg src="/images/pinicon.png" alt="pin" style={{ width: '65px' }} />
            <PopupTitle> Location Info </PopupTitle>
          </PopupHeader>
          <PopupInfo>
            <br/>
            <PopupTextInfo>Event is at: {popupInfo?.poi.location_select}</PopupTextInfo>
            <PopupTextInfo>Additional Details: {popupInfo?.poi.location ? popupInfo?.poi.location : 'None'}</PopupTextInfo>
            <br/>
          </PopupInfo>
          <hr></hr>
          <br/>
          <PopupHeader>
            <PopupImg src="/images/clock.png" alt="clock" style={{ width: '65px' }} />
            <PopupTitle> Time Info </PopupTitle>
          </PopupHeader>
          <PopupInfo>   
            <br/>   
            <PopupTextInfo>Start time: {popupInfo?.poi.start_time ? new Date(popupInfo.poi.start_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles',
              weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'Start time not available'}</PopupTextInfo>
            <PopupTextInfo>End time:  {popupInfo?.poi.end_time ? new Date(popupInfo.poi.end_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles',
              weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'End time not available'}</PopupTextInfo>
          </PopupInfo> 
          <br/>
          <hr></hr>
          <br/>
          <PopupHeader>
            <PopupImg src="/images/comment.png" alt="comment" style={{ width: '65px' }} />
            <PopupTitle> Comments </PopupTitle>  
          </PopupHeader>
          <PopupInfo>
            <br/>
            <PopupTextInfo>We would appreciate updates if you visit!</PopupTextInfo>
            <PopupTextInfo>Your contribution is appreciated!</PopupTextInfo>
            <br/>
            <PopupTextInfo>Recommended Comments:</PopupTextInfo>          
            <BulletPoints>
              <li><PopupTextInfo>Busy, Not busy</PopupTextInfo></li>
              <li><PopupTextInfo>No food left, plenty here</PopupTextInfo></li>
              <li><PopupTextInfo>Fake event</PopupTextInfo></li>
              <li><PopupTextInfo>Any feedback!</PopupTextInfo></li>
            </BulletPoints>
            <br/><hr/><br/>
            {/* only students can comment */}
            {status === 'authenticated' ? ( 
              session?.user?.role === 'student' ? (
                <CommentInputContainer>
                  <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}> 
                      <InputField type="text" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} /> 
                      {showError && (
                        <div>
                          <PopupTextInfoRed>&#x2717; {Error}</PopupTextInfoRed>
                          <br/>
                        </div>
                      )}
                      <SubmitButton type="submit">Post</SubmitButton> 
                    </form>
                </CommentInputContainer>
              ) : ( 
                <PopupTextInfo><strong>Only students can create comments</strong></PopupTextInfo>
              ) 
              ) : ( 
                <PopupTextInfo><strong>Please log in or create a student account to leave a comment</strong></PopupTextInfo>
              )
            }           
            <br/><hr/><br/>
            {popupInfo?.poi.comments.length === 0 && <PopupTextInfo><strong>No comments</strong></PopupTextInfo>} 
            {popupInfo?.poi.comments.map(comment => ( 
              <div key={comment.id} > 
                <CommentProfContainer>
                  <ProfilePictureImage src={comment.student.profile_photo ? comment.student.profile_photo: 'https://preview.redd.it/uipkoxw71uv21.png?auto=webp&s=b8f79063e8aa3bdaa9d8193f6f04f3ceb3187d0d'} alt="student profile" />
                  <CommentDisplayName> {comment.student.display_name}</CommentDisplayName> 
                </CommentProfContainer>
                <CommentBox>
                  <CommentInfo>{comment.text}</CommentInfo>  
                </CommentBox>               
                <br/>
              </div> 
            ))}         
          </PopupInfo>
            
          <br/><br/>
        </div> 
  );
};

// pins + pin clusters
// explained in tuturial vv 
// https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#0
const MapMarkers = (props: { pois: mapEvent[] }) => {
  const map = useMap();
  // for markers+clusters
  const [markers, setMarkers] = useState<{[name: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  // for info pop up
  const [isOpen, setIsOpen] = useState(false);
  const [popupInfo, setPopupInfo] = useState<{poi: mapEvent}>();

  // clicking a pin
  const handleClick = useCallback((poi: mapEvent, ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    map.panTo(ev.latLng);
    // to launch pop up window after click (+ get info)
    setPopupInfo({ poi });
    setIsOpen(true);
  }, [map]);

  // initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  // set markers
  const setMarkerRef = (marker: Marker | null, id: number) => {
    if (marker && markers[id]) return;
    if (!marker && !markers[id]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [id]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[id];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <PinColorModal />
      {props.pois.map( (poi: mapEvent) => ( 
        <AdvancedMarker
          key={poi.id}
          position={{ lat: poi.latitude, lng: poi.longitude }}
          ref={marker => setMarkerRef(marker, poi.id)}
          clickable={true}
          // send in poi (point of interest) to get specific marker info
          onClick={(ev) => handleClick(poi, ev)}     
          >
          <Pin background={getPinColor(poi.start_time, poi.end_time)} glyphColor={'white'} borderColor={'white'} />              
        </AdvancedMarker>
      ))}

      {/* to create pop up (sidebar?) if clicked */}
      {isOpen && popupInfo && ( 
        <EventPopup 
          popupInfo={popupInfo} 
          onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default MapView;