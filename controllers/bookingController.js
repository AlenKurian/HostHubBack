const stripe = require('stripe')(process.env.paymentKey);
const Bookings = require("../models/bookingModel");
const Events = require("../models/eventModel");

exports.bookEvent = async (req, res) => {
    const { eventId, ticketsBooked } = req.body;
    const userMail = req.payload;

    try {
        const event = await Events.findById(eventId);

        if (!event) {
            return res.status(404).json("Event not found");
        }

        if (event.nooftickets < ticketsBooked) {
            return res.status(400).json("Not enough tickets available");
        }

        // reduce tickets
        event.nooftickets -= ticketsBooked;
        await event.save();

        // create booking
        const booking = new Bookings({
            userMail,
            eventId,
            ticketsBooked
        });

        await booking.save();

        res.status(201).json({
            message: "Booking successful",
            booking
        });
    } catch (err) {
        res.status(500).json("Booking failed");
    }
};

exports.getMyBookings = async (req, res) => {
    console.log('fetching bookings')
    const userMail = req.payload.userMail;

    try {
        if (!userMail) {
            return res.status(401).json("User not authenticated");
        }

        const bookings = await Bookings.find({ userMail })
            .populate("eventId");

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json("Failed to fetch bookings");
    }
};


exports.buyEventTicket = async (req, res) => {
    console.log("Inside Event Payment");

    try {
        const eventId = req.params.id;
        const ticketsBooked = Number(req.body.ticketsBooked) || 1;
        const userId = req.user.userId;
        const buyerEmail = req.payload.userMail;

        console.log("Tickets booked:", req.body.ticketsBooked);


        const event = await Events.findById(eventId);

        if (!event) {
            return res.status(404).json("Event not found");
        }

        if (event.nooftickets <= 0) {
            return res.status(400).json("Tickets sold out");
        }

        const totalAmount = event.price * ticketsBooked;

        await Bookings.create({
            userId: userId,
            userMail: buyerEmail,
            eventId: event._id,
            ticketsBooked,
            totalAmount,
            bookedAt: new Date()
        });

        event.nooftickets -= ticketsBooked;
        await event.save();

        // 2️⃣ Create Stripe Checkout session
        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: event.title,
                        description: `${event.category} | ${event.location}`,
                        images: event.imageUrl ? [event.imageUrl] : [],
                        metadata: {
                            eventId: event._id.toString(),
                            title: String(event.title),
                            category: String(event.category),
                            date: String(event.date),
                            time: String(event.time),
                            location: String(event.location),
                            price: String(event.price),
                            nooftickets: String(event.nooftickets),
                            imageUrl: String(event.imageUrl),
                            description: String(event.description),
                            buyerEmail,
                        },
                    },
                    unit_amount: Math.round(Number(event.price) * 100),
                },
                quantity: ticketsBooked,
            },
        ];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",

            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-failed",
        });

        await Events.findByIdAndUpdate(event._id, {
            $push: {
                buyers: {
                    email: buyerEmail,
                    status: "pending",
                },
            },
        });

        res.status(200).json({
            message: "Checkout session created",
            url: session.url,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json("Payment Error: " + err.message);
    }
};


exports.confirmBooking = async (req, res) => {
    try {
        const buyerEmail = req.payload.userMail;

        const event = await Events.findOne({
            "buyers.email": buyerEmail,
            "buyers.status": "pending",
        });

        if (!event) return res.status(404).json("No pending booking");

        const ticketsBooked = 1; // or store session metadata later

        event.nooftickets -= ticketsBooked;

        event.buyers = event.buyers.map(b =>
            b.email === buyerEmail
                ? { ...b, status: "paid" }
                : b
        );

        await event.save();

        const booking = new Bookings({
            userMail: buyerEmail,
            eventId: event._id,
            ticketsBooked,
            eventName: event.title,
        });

        await booking.save();

        res.status(200).json({ booking });

    } catch (err) {
        console.log(err);
        res.status(500).json("Booking confirm error");
    }
};
