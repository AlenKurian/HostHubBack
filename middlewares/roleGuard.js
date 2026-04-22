const roleGuard = (role) => {
    return (req, res, next) => {
        if (req.role !== role) {
            return res.status(403).json("Access denied");
        }
        next();
    };
};

module.exports = roleGuard;
