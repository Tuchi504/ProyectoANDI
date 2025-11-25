import { useState, useEffect, useRef } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { ReservationModal } from './ReservationModal';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export function ReservationsPage() {
    const [calendarConfig, setCalendarConfig] = useState({
        viewType: "Week",
        durationBarVisible: false,
        timeRangeSelectedHandling: "Enabled",
        onTimeRangeSelected: async (args) => {
            const dp = calendarRef.current.control;
            setSelectedRange(args);
            setSelectedEvent(null);
            setIsModalOpen(true);
            dp.clearSelection();
        },
        eventDeleteHandling: "Disabled",
        onEventClick: async (args) => {
            setSelectedEvent(args.e);
            setSelectedRange(null);
            setIsModalOpen(true);
        },
    });

    const calendarRef = useRef();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [startDate, setStartDate] = useState(DayPilot.Date.today());

    const fetchReservations = async () => {
        try {
            // Adjust endpoint to fetch reservations for the visible range if possible
            // For now fetching all or a subset
            const response = await api.get('/reservations/');

            // Transform backend data to DayPilot format
            // Backend: { id_reserva, descripcion, fecha, hora_inicio, hora_fin, ... }
            // DayPilot: { id, text, start, end }
            const mappedEvents = response.data.map(res => ({
                id: res.id_reserva,
                text: res.descripcion,
                start: `${res.fecha}T${res.hora_inicio}`,
                end: `${res.fecha}T${res.hora_fin}`,
                backColor: "#3b82f6", // Blue-500
                fontColor: "#ffffff"
            }));

            setEvents(mappedEvents);
        } catch (error) {
            console.error("Error fetching reservations", error);
            // toast.error("Error al cargar reservas");
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [startDate]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Prácticas de Laboratorio</h1>
            </div>

            <div className="flex flex-1 gap-4">
                <div className="w-64 flex-shrink-0">
                    <DayPilotNavigator
                        selectMode={"Week"}
                        showMonths={3}
                        skipMonths={3}
                        onTimeRangeSelected={args => {
                            setStartDate(args.day);
                        }}
                    />
                </div>
                <div className="flex-1 bg-white rounded-lg shadow p-4">
                    <DayPilotCalendar
                        {...calendarConfig}
                        ref={calendarRef}
                        startDate={startDate}
                        events={events}
                    />
                </div>
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedRange={selectedRange}
                selectedEvent={selectedEvent}
                onRefresh={fetchReservations}
            />
        </div>
    );
}
