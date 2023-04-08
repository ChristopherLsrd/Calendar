import React, { useRef, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import AddEventModal from "./AddEventModal";
import axios from "axios";
import moment from "moment";

export default function () {
    const [modalOpen, setModalOpen] = useState(false);
    const [events,setEvents]= useState([]);
    const calendarRef = useRef(null);

    const onEventAdded = event => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end:   moment(event.end).toDate(),
            title: event.title,
        });
    }

    async function handleEventAdd(data){
        
        console.log(data.event);
       await axios.post("/api/calendar/create-event",data.event);
    }

    async function handleDateSet(data){
       const response = await axios.get("/api/calendar/get-events?start="+moment(data.start).toISOString()+"&end="+moment(data.end).toISOString(),data.event);
        setEvents(response.data);
    }
 

    return (
        <section>
            <button onClick={() => setModalOpen(true)}>Add Event</button>
            <div style={{position:"relative",zIndex:0}}>
                <FullCalendar
                    ref={calendarRef}
                    events={events}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    eventAdd={event => handleEventAdd(event)}
                    datesSet={(date) => handleDateSet(date)}
                />
            </div>

            <AddEventModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onEventAdded={event => onEventAdded(event)} />
        </section>
    )
}