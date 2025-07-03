import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// *for creating an event*
export async function POST(req: Request) {
    try {
      // get event data info
      const { name,  description, food_type, quantity, location, location_select,
        latitude, longitude, start_time, end_time, photo, organizationId
      } = await req.json();
      
      // checking if required fields are filled 
      // lat and long should always be instantied (pin by default)
      if (!name || !description || !food_type ||!quantity || !location_select || start_time==='' || end_time==='') {
        return NextResponse.json({ error: "Please fill in all required fields!" }, { status: 400} );
      }

      // checking if start time is after end time (then invalid date inputs)
      if (start_time > end_time) {
        return NextResponse.json({ error: "Provided start time is later than end time!" }, { status: 400} );
      }

      // checking if current time is after event end time (then invalid date inputs)
      const current_time = new Date().toISOString();
      if (current_time > end_time) {
        return NextResponse.json({ error: "Event must be ongoing or occuring in the future" }, { status: 400} );
      }
      
      // if 2 pins have same lat/lng, only one shows up, so prevent event creation
      // (only checking against events on map, ongoing/future events)
      const same_latlng_event = await prisma.event.findFirst({
        where: { 
          latitude: latitude,
          longitude: longitude,
        },
      });
      if (same_latlng_event && same_latlng_event.end_time.toISOString() >= current_time) {
        return NextResponse.json({ error: "Pin location taken by event on map! Please move pin a little" }, { status: 400} );
      }

      const newEvent = await prisma.event.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          food_type: food_type.trim(),
          quantity: quantity.trim(),
          location: location.trim(),
          location_select: location_select,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          // since photo can be null
          photo: photo || null,
          organizationId: parseInt(organizationId, 10),
        },
      });
  
      return NextResponse.json(newEvent, { status: 200 });

    } catch (error) {
      console.error('Error creating event:', error);
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
  }