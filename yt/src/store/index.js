import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import videoReducer from "./slices/videoSlice";
import commentReducer from "./slices/commentSlice";
import likeReducer from "./slices/likeSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import playlistReducer from "./slices/playlistSlice";
import dashboardReducer from "./slices/dashboardSlice";
import channelReducer from "./slices/channelSlice";
import historyReducer from "./slices/historySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comment: commentReducer,
        like: likeReducer,
        subscription: subscriptionReducer,
        playlist: playlistReducer,
        dashboard: dashboardReducer,
        channel: channelReducer,
        history: historyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allows FormData in thunk payloads
        }),
});

export default store;