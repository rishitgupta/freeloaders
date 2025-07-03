'use client'

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import styled from "styled-components";
import ProtectedRoute from '../components/protectedPage';
import { useSession } from "next-auth/react";
import Scrollbars from 'react-custom-scrollbars-2';

// calpoly coordinates
const DEFAULT_CENTER = { lat: 35.3009142, lng: -120.6618162 };

const HeaderText = styled.h1`
    padding-top: 3vh;
    color: ${p => p.theme.color.default};
    text-align: center;
    font-size: 1.75em;
    font-weight: ${p => p.theme.weight.bold};
    font-family: ${p => p.theme.font.heading};
`

const LabelText = styled.label`
    font-size: 1.2rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    color: ;
`

const LabelTextSmall = styled.label`
    font-size: 1rem;
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    color: ;
`

// if required fields are not filled error message
const ErrorText = styled.p`
    font-size: 1.2rem;
    text-align: center;
    font-family: ${p => p.theme.font.heading};
    color: #FF0000;
    color: ;
`

const InputFieldLarge = styled.input`
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1.5rem;
    color: ${p => p.theme.color.default};
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
`

// form as in the typed stuff, dates, etc
const FormDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    padding-left: 5rem;
    padding-right: 5rem;
    width: 55%;
`

const MapDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 2rem;
    width: 45%;
`

const SubmitButton = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1.125rem;
    color: ${p => p.theme.color.default};
    background-color: #e0e0e0;
    border: 4px solid #8A8A8A; 
    border-radius: 8px;
    cursor: pointer;
    font-family: ${p => p.theme.font.heading};
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.25); 

    &:hover {
        background-color: #d0d0d0;
    }
`;

const OptionValue = styled.option`
    font-family: ${p => p.theme.font.heading};
    color: ${p => p.theme.color.default};
    font-size: 1.25rem;
    background-color: white,
`

// route.ts default time is utc->can't seem to convert correctly there, so will do here
// formatting for datetime-local, so if json error, time inputs are saved
function isoToLocal(input_time) {
    const time = new Date(input_time); 
    const year = time.getFullYear(); 
    const month = String(time.getMonth() + 1).padStart(2, '0'); 
    const day = String(time.getDate()).padStart(2, '0'); 
    const hours = String(time.getHours()).padStart(2, '0'); 
    const minutes = String(time.getMinutes()).padStart(2, '0'); 
    const format_time= `${year}-${month}-${day}T${hours}:${minutes}`;
    return format_time;
}

const MapForm = () => {
    // get org id of current login
    const { data: session } = useSession();

    // keep pin lat/long (from map)
    const [position, setPosition] = useState({
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng
    });

    // keep all the inputed data 
    // (could include lat/lng but doesn't seem to matter much)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        food_type: '',
        quantity: '',
        location: '',
        // default is dexter lawn
        location_select: 'Dexter Lawn',
        start_time: '',
        end_time: '',
        photo: '',
    });

    // error when submitting 
    const [showError, setShowError] = useState(false);
    const [Error, setError] = useState('');

    // to track text/time input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // event type is different for select (dropdown)
    const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();  
        
        // if no time provided new Date('') returns error, so don't run it through Date()
        // json checks if empty 
        if (formData.start_time !== '') {
            formData.start_time = new Date(formData.start_time).toISOString();
        }
        if (formData.end_time !== '') {
            formData.end_time  = new Date(formData.end_time).toISOString();
        }

        try {
            const response = await fetch('/api/event', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                food_type: formData.food_type,
                quantity: formData.quantity,
                location: formData.location,
                location_select: formData.location_select,
                latitude: position.lat,
                longitude: position.lng,
                start_time: formData.start_time,
                end_time: formData.end_time,
                photo: formData.photo,
                organizationId: session.user.id
            }),
        });

        if (!response.ok) {
            // display error (should be red text)
            const errorData = await response.json();
            setError(errorData.error);
            setShowError(true);
            // reconvert iso time to datetime-local
            if (formData.start_time !== '') {
                formData.start_time = isoToLocal(new Date(formData.start_time));
            }
            if (formData.end_time !== '') {
                formData.end_time = isoToLocal(new Date(formData.end_time));
            }
            return;
        }
        // back to map
        window.location.href = '/'
        } catch (err) {
            console.error(err);
        }
    };

    return (
      <ProtectedRoute requiredRole="organization">
        <Scrollbars style={{ width: '100%', height: '90vh' }}>
        <div>
            <br></br>
            <HeaderText>Create an Event</HeaderText>
            {/* error (depending on json response) */}
            {showError && (
                <ErrorText>{Error}</ErrorText>
            )}
            <br></br>
            <Container>
                <FormDiv>
                    <form onSubmit={handleSubmit}>
                        <LabelText> Event Name: </LabelText>
                        <InputFieldLarge type="text" name='name' value={formData.name} onChange={handleChange} placeholder='(Required)' />
                        <br />
                        <LabelText>Event Description:</LabelText>
                        <InputFieldLarge type="text" name='description' value={formData.description} onChange={handleChange} placeholder='(Required)' />
                        <br />
                        {/* dropdown to make search by location easier (if event has specific value) */}
                        <LabelText>Building/Area: </LabelText>
                        <select id="dropdown" value={formData.location_select} name='location_select' onChange={handleChangeSelect}>                           
                            <OptionValue value="1901 Marketplace">1901 Marketplace</OptionValue> 
                            <OptionValue value="Agriculture Building">Agriculture Building</OptionValue>
                            <OptionValue value="Agricultural Sciences Building">Agricultural Sciences Building</OptionValue>   
                            <OptionValue value="Arboretum">Arboretum</OptionValue>
                            <OptionValue value="Architecture & Environmental Design Building">Architecture & Environmental Design Building</OptionValue>
                            <OptionValue value="Baker Center for Science and Mathematics">Baker Center for Science and Mathematics</OptionValue>
                            <OptionValue value="Bioresource and Agricultural Engineering Building">Bioresource and Agricultural Engineering Building</OptionValue>   
                            <OptionValue value="Business Building (Orfalea)">Business Building (Orfalea)</OptionValue>
                            <OptionValue value="Campus Market">Campus Market</OptionValue>
                            <OptionValue value="Cerro Vista Apartments">Cerro Vista Apartments</OptionValue>
                            <OptionValue value="Computer Science Building">Computer Science Building</OptionValue>
                            <OptionValue value="Cotchett Education Building">Cotchett Education Building</OptionValue>
                            <OptionValue value="Dexter Building">Dexter Building</OptionValue>
                            <OptionValue value="Dexter Lawn">Dexter Lawn</OptionValue>
                            <OptionValue value="Engineering Building">Engineering Building</OptionValue>
                            <OptionValue value="Engineering East">Engineering East</OptionValue>
                            <OptionValue value="Engineering West">Engineering West</OptionValue>
                            <OptionValue value="Engineering IV">Engineering IV</OptionValue>
                            <OptionValue value="English Building">English Building</OptionValue>
                            <OptionValue value="Farm Shop">Farm Shop</OptionValue>
                            <OptionValue value="Fisher Science Hall">Fisher Science Hall</OptionValue>
                            <OptionValue value="Food Pantry">Food Pantry</OptionValue>
                            <OptionValue value="Kennedy Library">Kennedy Library</OptionValue>                           
                            <OptionValue value="Mathematics and Science Building">Mathematics and Science Building</OptionValue>                           
                            <OptionValue value="Mott Athletics Center">Mott Athletics Center</OptionValue>
                            <OptionValue value="ONeill Lawn">ONeill Lawn</OptionValue>
                            <OptionValue value="Performing Arts Center (PAC)">Performing Arts Center (PAC)</OptionValue>
                            <OptionValue value="Poly Canyon Village">Poly Canyon Village</OptionValue>
                            <OptionValue value="Recreation Center">Recreation Center</OptionValue>
                            <OptionValue value="University Union">University Union</OptionValue>
                            <OptionValue value="Vista Grande">Vista Grande</OptionValue>          
                            <OptionValue value="yakʔitʸutʸu">yakʔitʸutʸu</OptionValue>            
                            <OptionValue value="North Mountain Halls">North Mountain Halls</OptionValue>           
                            <OptionValue value="South Mountain Halls">South Mountain Halls</OptionValue>
                            <OptionValue value="Sierra Madre Residence Hall">Sierra Madre Residence Hall</OptionValue>
                            <OptionValue value="Yosemite Residence Hall">Yosemite Residence Hall</OptionValue>                    
                            <OptionValue value="Other">Other</OptionValue>
                        </select>
                        <br/>
                        <br/>
                        <LabelText>Additional Detail:</LabelText>
                        <br/>
                        <LabelTextSmall>(ie Room Number, Floor, etc)</LabelTextSmall>
                        <br/>
                        <InputFieldLarge type="text" name='location' value={formData.location} onChange={handleChange} placeholder='(Optional)' />
                        <br/>
                        <LabelText>Provided Food:</LabelText>
                        <InputFieldLarge type="text" name='food_type' value={formData.food_type} onChange={handleChange} placeholder='(Required)' />
                        <br/>
                        <LabelText>Initial Quantity:</LabelText>
                        <InputFieldLarge type="text" name='quantity' value={formData.quantity} onChange={handleChange} placeholder='(Required)' />
                        <br/>
                        <LabelText>Dates/Times:</LabelText>
                        <br/>
                        <LabelTextSmall>(Required)</LabelTextSmall>
                        <br/>
                        <LabelText> Start Time: </LabelText>
                        <input type="datetime-local" name='start_time' value={formData.start_time} onChange={handleChange} />
                        <br/>
                        <LabelText>End Time: </LabelText>
                        <input type="datetime-local" name='end_time' value={formData.end_time} onChange={handleChange} />
                        <br/>
                        <br/>
                        <LabelText>Image URL:</LabelText>
                        <br/>
                        <LabelTextSmall>(A default image will be provided if not specified)</LabelTextSmall>
                        <br/>
                        {/* image url (unless uploading file works) */}
                        <InputFieldLarge type="text" name='photo' value={formData.photo} onChange={handleChange} placeholder='(Optional) Image URL' />
                        {formData.photo !== '' && (
                            <img src={formData.photo} alt="your image" style={{ width: '150px' }} />
                        )}
                        <br/>
                        {showError && (
                            <ErrorText>{Error}</ErrorText>
                        )}
                        <br/>
                        <SubmitButton type="submit">Submit</SubmitButton>
                    </form>
                    <br/>
                    <br/>
                </FormDiv>
                <MapDiv>
                    <APIProvider apiKey={"AIzaSyCQkzGZi6LfAzkukJxdE8twTdzrMarNjvo"} >
                        <Map
                            // change size as necessary
                            style={{ width: '450px', height: '450px', position: 'absolute' }}
                            defaultCenter={DEFAULT_CENTER}
                            defaultZoom={16}
                            mapId='bc1a32a7945f3e86'
                            disableDefaultUI
                            // get lat/lng location of user input on map
                            onClick={(event) => {
                                const {
                                    detail: { latLng }
                                } = event;
                                const latitude = latLng?.lat ?? 0;
                                const longitude = latLng?.lng ?? 0;
                                setPosition({
                                    lat: latitude,
                                    lng: longitude
                                })
                            }}>
                            <AdvancedMarker position={position} onDragEnd={(event) => {
                                const { latLng } = event;
                                const latitude = latLng?.lat();
                                const longitude = latLng?.lng();
                                setPosition({
                                    lat: latitude ?? 0,
                                    lng: longitude ?? 0
                                })
                            }} />
                        </Map>
                    </APIProvider>
                </MapDiv>
            </Container>
        </div>
        </Scrollbars>
      </ProtectedRoute>
    );
};

export default MapForm;

