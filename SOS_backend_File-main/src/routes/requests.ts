import express from 'express'
import { validateRequest } from '../middleware/zodMiddleware';
import { requestsSchema } from '../models/zodModels';
import { acceptRequest, getNearbyRequests, rejectRequest, sendSOSrequest } from '../controllers/requestsController';
const requestsRouter=express.Router();
requestsRouter.post(
    "/send-request",
    // validateRequest(requestsSchema),
    sendSOSrequest
  );
requestsRouter.post(
  "/get-requests",
  getNearbyRequests,
)
requestsRouter.post(
  "/reject-request",
  rejectRequest,
)
requestsRouter.post(
  "/accept-request",
  acceptRequest,
)
  
export default requestsRouter;