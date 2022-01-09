import express from "express";

const routes = express.Router();

routes.use((req, res, next) => {
    console.log('Middleware Called');
    next();
});

export const router = routes;