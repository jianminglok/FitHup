import { createSlice } from "@reduxjs/toolkit"

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        name: 'User Name',
        profilePic: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/e00gxd21wgj-10%3A212?alt=media&token=0b84b92e-ad6d-4f45-a1a5-2c519feb85fb",
    },
    reducers: {
        setName(state, action) {
            state.name = action.payload
        },
        setProfilePic(state, action) {
            state.profilePic = action.payload
        }
    }
});

export const { setName, setProfilePic } = profileSlice.actions
export default profileSlice.reducer