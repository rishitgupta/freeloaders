'use client';

import styled from "styled-components";
import {Organization} from "@prisma/client";
import React, {useCallback, useEffect, useState} from "react";
import Scrollbars from "react-custom-scrollbars-2";

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

const Card = styled.article`
    background-color: #f6f6f6;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: calc(33.333% - 60px); /* Three cards per row */
    // max-height: 500px;
    padding: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-left: 35px;
    margin-top: 30px;
    overflow: hidden;
`

const CardRows = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const CardTitle = styled.h3`
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    font-size: 4vh;
`

const CardContent = styled.h4`
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    margin: 10px 0;
    overflow: hidden;
`

const ViewEventButton = styled.button`
    width: 20vh;
    height: 6vh;
    margin-top: auto;
    background-color: ${p => p.theme.background.default};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 0.9rem;
    
    &:hover {
        background-color: ${p => p.theme.background.active};
    }
`;

const CardContentHolder = styled.div`
`

const CardHolder = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`

const ImageContainer = styled.div`
    background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%25' width='100%25'%3E%3Cdefs%3E%3Cpattern id='doodad' width='35' height='35' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(237)'%3E%3Crect width='100%25' height='100%25' fill='rgba(161, 168, 201, 1)'/%3E%3Ccircle cx='5' cy='33' r='1.75' fill='rgba(112, 132, 153,1)'/%3E%3Ccircle cx='25' cy='7' r='1.75' fill='rgba(112, 132, 153,1)'/%3E%3Ccircle cx='5' cy='-7' r='1.75' fill='rgba(112, 132, 153,1)'/%3E%3Ccircle cx='25' cy='47' r='1.75' fill='rgba(112, 132, 153,1)'/%3E%3Ccircle cx='15' cy='20' r='1.75' fill='rgba(187, 209, 236,1)'/%3E%3Ccircle cx='35' cy='20' r='1.75' fill='rgba(187, 209, 236,1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23doodad)' height='200%25' width='200%25'/%3E%3C/svg%3E ");
    height: 250px;
    width: 175px;
    display: flex; /* Center image in the container */
    align-items: center;
    justify-content: center;
    border-radius: 8px; /* Optional: Add rounded corners */
    overflow: hidden; /* Ensure image does not overflow container */
    margin: 10px;
`

const EventImage = styled.img`
  width: 100%; /* Scale image to container width */
  height: 100%; /* Scale image to container height */
  object-fit: contain; /* Ensure the image fits without distortion */
`;




const EventCard = (
    { poi, eventTitle, organizer, description, startTime, endTime, location, imageLink }:
        { poi: mapEvent; eventTitle: string; organizer: string; description: string; startTime: string; endTime: string; location: string; imageLink: string | null}
) => {
    return (
        <Card>
            <CardTitle>{eventTitle}</CardTitle>
            <CardRows>
                <CardContentHolder>
                    <CardContent><b>Organizer: </b>{organizer}</CardContent>
                    <CardContent><b>Description: </b>{description}</CardContent>
                    <CardContent><b>Location: </b>{location}</CardContent>
                    <CardContent><b>Start Time: </b>{startTime}</CardContent>
                    <CardContent><b>End Time: </b>{endTime}</CardContent>
                </CardContentHolder>
                <CardContentHolder>
                    <ImageContainer>
                        <EventImage src= {imageLink ? imageLink : 'https://events.calpoly.edu/sites/events.calpoly.edu/files/2024-07/saf-2023-3.jpg'} alt="event photo" style={{ height: '100%', width: 'auto' }}/>
                    </ImageContainer>
                </CardContentHolder>
            </CardRows>
            {/*<ViewEventButton >View Event</ViewEventButton>*/}
        </Card>
    )
}

const EventCardHolder = (props: { pois: mapEvent[] }) => {
    return (
        <CardHolder>
            {/* create cards for all the events */}
            {props.pois.map( (poi: mapEvent) => (
                <EventCard
                    key={poi.id}
                    poi={poi}
                    eventTitle={poi.name}
                    organizer={poi.organization.display_name}
                    description={poi.description}
                    location={poi.location_select ? poi.location_select : "No location description"}
                    startTime={poi.start_time ? new Date(poi.start_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : 'Start time not available'}
                    endTime={poi.end_time ? new Date(poi.end_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : 'End time not available'}
                    imageLink={poi.photo}
                >
                </EventCard>
                ))}
        </CardHolder>
    )
}


const ListView = () => {
    // for prisma, get Event(s) from database
    // locations = list of Event(s) from database
    const [events, setEvents] = useState<mapEvent[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [popupInfo, setPopupInfo] = useState<{poi: mapEvent}>();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/getevents');
                if (!response.ok) {
                    const error = await response.json();
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
        <Scrollbars style={{ width: '100%', height: '90vh' }}>
            <EventCardHolder pois={events}/>
        </Scrollbars>
    )
}

export default ListView;
