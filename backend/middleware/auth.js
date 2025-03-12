import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

export const authenticateMember = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (req.user.role !== "member") {
        return res.status(403).json({ error: "Access denied: Members only" });
    }
    
    next();
};

