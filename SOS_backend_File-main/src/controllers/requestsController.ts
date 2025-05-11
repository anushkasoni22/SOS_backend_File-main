import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import {
  calculateDistance,
  startBroadCastTimer,
} from "../utils/helperFunctions";
import { activeTimers } from "../utils/globalConstants";

export const sendSOSrequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    mobile,
    image_url,
    device_id,
    request_type,
    longitude,
    latitude,
    image_classification
    
  } = req.body;
  //adding the request in supabase database
  try {
    const { data, error } = await supabase
      .from("sos_requests")
      .insert({
        sender_name: name,
        phone_no: mobile,
        photo_url: image_url,
        device_id,
        emergency_type: request_type,
        longitude,
        latitude,
        radius: 2,
        ids_rejected:[],
        image_classification:image_classification,
      })
      .select("id")
      .single();
    if (error) throw error;
    res.status(200).json({ message: "Request sent successfully" });
    //request will start broadcasting after 5 sec
    console.log("success");
    setTimeout(() => startBroadCastTimer(data.id), 5000);
  } catch (error: any) {
    console.log("Error in sending request", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const rejectRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, requestId }: { email: string; requestId: string } = req.body;
    const { data, error } = await supabase
      .from("request_handlers")
      .select("id")
      .eq("email", email)
      .single();
    if (error) throw error;
    const { error: updateError } = await supabase.rpc(
      "append_to_ids_rejected",
      { row_id: requestId, new_id: data?.id }
    );
    if (updateError) {
      res
        .status(404)
        .json({ message: "Request rejection fail", error: updateError });
      return;
    }
    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error: any) {
    console.log("Error in accepting request", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const acceptRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, requestId }: { email: string; requestId: string } = req.body;
    const { data, error } = await supabase
      .from("request_handlers")
      .select("id")
      .eq("email", email)
      .single();
    if (error) throw error;
    const { data: updatedData, error: UpdateError } = await supabase
      .from("sos_requests")
      .update({ status: "resolved", assigned_handler_id: data.id })
      .eq("id", requestId)
      .neq("status", "resolved")
      .select("id")
      .single(); // Ensure only one station can resolve it;
    if (UpdateError) throw UpdateError;
    if (!updatedData) {
      console.log("Request already resolved");
      res.status(400).json({ message: "Request already resolved" });
      return;
    }
    if (activeTimers[requestId]) {
      clearInterval(activeTimers[requestId]);
      delete activeTimers[requestId];
      console.log("Stopped the broadcast of request");
    }
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error: any) {
    console.log("Error in accepting request", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getNearbyRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;

    // 1️⃣ Get the request handler's station location
    const { data: stationData, error: stationInfoError } = await supabase
      .from("request_handlers")
      .select("id,station_type, Longitude, Latitude")
      .eq("email", email)
      .single();

    if (stationInfoError || !stationData) {
      throw new Error("Could not find station data");
    }
    const stationId: string = stationData.id;
    const stationLat = stationData.Latitude;
    const stationLng = stationData.Longitude;
    // 2️⃣ Fetch all unresolved requests
    const { data: requests, error } = await supabase
    .from("sos_requests")
    .select(
      "id,sender_name,phone_no, emergency_type, latitude, longitude, status, radius, photo_url, ids_rejected, assigned_handler_id,image_classification"
    )
    .eq('emergency_type',stationData.station_type)
    .not("ids_rejected", "cs", `{${stationId}}`)
    .or(
      `status.neq.resolved, and(status.eq.resolved, assigned_handler_id.eq.${stationId})`
    )
    
  if (error) {
    console.error("Error fetching SOS requests:", error.message);
  } else {
    console.log("Fetched requests:", requests);
  }

    if (error) throw error;
    // 3️⃣ Filter only nearby requests based on dynamic radius
    const nearbyRequests = requests?.filter((request) => {
      const distance = calculateDistance(
        stationLat,
        stationLng,
        request.latitude,
        request.longitude
      )
      return distance <= request.radius; // Only keep requests within the request’s own radius
    });
    //filter on base on
    // const interestedStations=requests?.filter((request)=>)
    res.status(200).json(nearbyRequests);
  } catch (error: any) {
    console.error("Error fetching nearby requests:", error.message);
    res.status(500).json({ error: error.message });
  }
};