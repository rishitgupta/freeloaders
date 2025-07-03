"use client"

import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {Organization} from "@prisma/client";


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

const BannerImage = styled.img`
  height: 35vh;
  width: 100vw;
  object-fit: cover;
  background-color: ${p => p.theme.background.white};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.color.accent};
`

const BottomChunk = styled.div`
  position: relative;
  display: flex;
  // justify-content: space-between;
  // align-items: flex-start;
  background-color: ${p => p.theme.background.default};
  min-height: 55vh;
  flex-grow: 1;
  flex-direction: column;
  padding: 3rem;
  // overflow: auto;
`


const ProfilePhoto = styled.img`
  position: absolute;
  top: -70%; 
  left: 7%;
  // transform: translate(-270%, -67%);
  width: 225px;
  height: 225px;
  border-radius: 50%;
  background-color: ${p => p.theme.background.default};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled.div`
  position: relative;
  top: 10px;
  left: 90px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // background-color: ${p => p.theme.background.white};
  height: 35vh;
  width: 60vh;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
`

const OrgTitle = styled.h1`
  position: relative;
  top: 22%;
  left: 6.5%;
  // background-color: ${p => p.theme.background.white};
  font-family: ${p => p.theme.font.heading};
  font-weight: ${p => p.theme.weight.bold};
  font-size: 3.2rem;
`

const OrgBio = styled.h3`
  position: relative;
  top: 15%;
  left: 6.5%;
  // background-color: ${p => p.theme.background.white};
  font-family: ${p => p.theme.font.content};
  font-size: 1.5rem;
`

const EventsContainer = styled.div`
  position: absolute;
  top: 10%;
  left: 47%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // background-color: ${p => p.theme.background.white};
  height: 49.5vh;
  width: 48vw;
  overflow: auto;
  gap: 20px;
`

const EventOverlayCard = styled.article`
  position: relative;
  width: calc(33.333% - 20px);
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImageBackground = styled.div<{ imageUrl: string }>`
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
`;

const OverlayText = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  font-size: 1rem;
  font-family: ${(p) => p.theme.font.heading};
`;

const EventCard = ({ event }: { event: mapEvent }) => {
  const imageUrl = event.photo
    ? event.photo
    : "https://events.calpoly.edu/sites/events.calpoly.edu/files/2024-07/saf-2023-3.jpg";

  return (
    <EventOverlayCard>
      <ImageBackground imageUrl={imageUrl} />
      <OverlayText>{event.name}</OverlayText>
    </EventOverlayCard>
  );
};


const ProfilePage: React.FC  = () => {

  const [events, setEvents] = useState<mapEvent[]>([]);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
          try {
              const response = await fetch(`/api/getorg?reqId=${session.user.id}`);
              if (response.ok) {
                  const data = await response.json();
                  setUser(data); 
                  fetchEvents(data.id); 
              } else {
                  console.error("Failed to fetch user data");
              }
          } catch (error) {
              console.error("Error fetching user data:", error);
          }
      };

      fetchUserData();
    }
  }, [session]);

  const fetchEvents = async (userId: string) => {
    try {
      const response = await fetch(`/api/getuserevents?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch user-specific events");
      }
    } catch (error) {
      console.error("Error fetching user-specific events:", error);
    }
  };


  return (
    <div>
      <BannerImage src={user?.cover_photo || null} alt="User's Banner Image"/>
      <BottomChunk>
        <TextContainer>
          <ProfilePhoto src={user?.profile_photo || null} alt="Profile Picture" />  
          <OrgTitle>{user?.display_name || null}</OrgTitle>
          <OrgBio>{user?.description || null}</OrgBio>
        </TextContainer>
        <EventsContainer>
          {events.map((event) => (
              <EventCard key={event.id} event={event} />
          ))}
        </EventsContainer>
      </BottomChunk>
    </div>
  );
};

export default ProfilePage

