const Users = require("../models/userModel");
const Events = require("../models/eventModel");
const Bookings = require("../models/bookingModel");

exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await Users.countDocuments({ role: "user" });
        const organizers = await Users.countDocuments({ role: "organizer" });

        const events = await Events.countDocuments({ status: "approved" });

        const ticketsSold = await Bookings.aggregate([
            { $group: { _id: null, total: { $sum: "$ticketsBooked" } } }
        ]);

        const revenue = await Bookings.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const recentEvents = await Events.find({ status: "approved" })
            .sort({ _id: -1 })
            .limit(3);

        const recentTickets = await Bookings.find()
            .populate("eventId")
            .sort({ createdAt: -1 })
            .limit(3);

        res.status(200).json({
            totalUsers,
            organizers,
            events,
            ticketsSold: ticketsSold[0]?.total || 0,
            revenue: revenue[0]?.total || 0,
            recentEvents,
            recentTickets,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json("Dashboard error");
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: "user" }).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params
    try {
        await Users.findByIdAndDelete(id);
        res.status(200).json("deleted");
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllOrganizers = async (req, res) => {
    try {
        const users = await Users.find({ role: "organizer" }).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

// delete event
exports.deleteEvents = async (req, res) => {
    const { ids } = req.body;
    try {
        await Events.deleteMany({ _id: { $in: ids } });
        res.status(200).json("Events deleted Successfully...")
    }
    catch (err) {
        res.status(500).json('Error'+err)
    }
}

exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Events.find({ status: "pending" });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.approveEvent = async (req, res) => {
    try {
        await Events.findByIdAndUpdate(req.params.id, {
            status: "approved"
        }, { new: true });

        res.json("Event approved");
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.rejectEvent = async (req, res) => {
    try {
        await Events.findByIdAndUpdate(req.params.id, {
            status: "rejected"
        });

        res.json("Event rejected");
    } catch (err) {
        res.status(500).json(err);
    }
};