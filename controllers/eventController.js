const Events = require('../models/eventModel')

// Add event
exports.addEvent = async (req, res) => {
    console.log('Inside add event')
    console.log(req.body);
    const { title, category, date, time, location, price, nooftickets, imageUrl, description } = req.body
    const organizerId = req.user.userId;
    const userMail = req.user.userMail;
    console.log(title, category, date, time, location, price, nooftickets, imageUrl, description, userMail);

    try {
        const existingEvent = await Events.findOne({ title, organizerId })
        if (existingEvent) {
            res.status(400).json('Event already existing...')
        }
        else {
            const newEvent = new Events({
                title, category, date, time, location, price, nooftickets, imageUrl, description, userMail, organizerId, status:"pending"
            })
            console.log(newEvent);
            await newEvent.save()
            res.status(201).json({message: 'Event added successfully...',newEvent })
        }
    }
    catch (err) {
        res.status(500).json('Error'+err)
    }
}

// Get event
exports.getEvent = async (req, res) => {
    try {
        const allEvents = await Events.find()
        res.status(200).json(allEvents)
    }
    catch (err) {
        res.status(500).json('Error'+err)
    }
}

// Get Home Events
exports.getHomeEvent = async (req, res) => {
    try {
        const allEvents = await Events.find().sort({ _id: -1 }).limit(3)
        res.status(200).json(allEvents)
    }
    catch {
        res.status(500).jjson('Error'+err)
    }
}

// view event
exports.viewEvent = async (req, res) => {
    console.log(req.params);
    const { id } = req.params
    try {
        const viewEvent = await Events.findOne({ _id: id })
        res.status(200).json(viewEvent)
    }
    catch (err) {
        res.status(500).json('Error'+err)
    }
}


exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        await Events.findByIdAndDelete(id);

        res.status(200).json("Event deleted successfully");

    } catch (err) {
        res.status(500).json("Error deleting event");
    }
};


// update event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;   // event id from URL
        const updatedData = req.body;

        const updatedEvent = await Events.findByIdAndUpdate(
            id,
            updatedData,
            { new: true } // return updated doc
        );

        if (!updatedEvent) {
            return res.status(404).json("Event not found");
        }

        res.status(200).json({ message: "Event updated successfully", updatedEvent });

    } catch (err) {
        res.status(500).json("Update failed " + err);
    }
};

exports.getApprovedEvent = async (req, res) => {
    try {
        const events = await Events.find({ status: "approved" })
            .sort({ _id: -1 })
            .limit(3);
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getApprovedEvents = async (req, res) => {
    try {
        const events = await Events.find({ status: "approved" })
            .sort({ _id: -1 })
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.getOrganizerEvents = async (req, res) => {
    try {
        const organizerId = req.payload.userId;

        const events = await Events.find({ organizerId });

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json("Fetch failed");
    }
};
