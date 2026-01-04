export const authorize = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.role) {
      return res.status(403).json({
        message: "Role information missing"
      });
    }

    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this action"
      });
    }

    next();
  };
};
