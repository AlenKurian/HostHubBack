const express = require('express')

const userController = require('../controllers/userController')
const eventController = require('../controllers/eventController')
const bookingController = require('../controllers/bookingController')
const adminController = require('../controllers/adminController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const router = express.Router()

router.post('/api/register', userController.userRegister)

router.post('/api/login', userController.userLogin)

router.post('/api/google-login', userController.googleLogin)

router.post('/api/add-event', jwtMiddleware, eventController.addEvent)

router.get('/api/get-events', eventController.getEvent)

router.get('/api/get-home-events', eventController.getHomeEvent)

router.get('/api/viewEvent/:id', eventController.viewEvent)

router.post('/api/book-event', jwtMiddleware, bookingController.bookEvent)


router.delete('/api/admin-delete-events', adminMiddleware, adminController.deleteEvents)

router.get('/api/admin-dashboard', jwtMiddleware, adminMiddleware, adminController.getAdminDashboard)

router.get('/api/get-users', jwtMiddleware, adminMiddleware, adminController.getAllUsers)

router.delete('/api/admin-delete/:id', jwtMiddleware, adminMiddleware, adminController.delete)

router.get('/api/get-organizers', jwtMiddleware, adminMiddleware, adminController.getAllOrganizers)

router.delete('/api/org-delete-event/:id', jwtMiddleware, eventController.deleteEvent)

router.put('/api/update-event/:id', jwtMiddleware, eventController.updateEvent)

router.get('/api/pending-events', jwtMiddleware, adminMiddleware, adminController.getPendingEvents)

router.put('/api/approve-event/:id', jwtMiddleware, adminMiddleware, adminController.approveEvent)

router.put('/api/reject-event/:id', jwtMiddleware, adminMiddleware, adminController.rejectEvent)

router.get('/api/my-events', jwtMiddleware, eventController.getOrganizerEvents)

router.get('/api/approved-home-events', eventController.getApprovedEvent)

router.get('/api/approved-events', eventController.getApprovedEvents)

router.put('/api/makePayment/:id', jwtMiddleware, bookingController.buyEventTicket)

router.get('/api/get-bookings', jwtMiddleware, bookingController.
getMyBookings)

router.post('/api/confirm-booking', jwtMiddleware, bookingController.confirmBooking)

module.exports = router
