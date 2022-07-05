import { createSlice } from "@reduxjs/toolkit"

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        name: 'User Name',
        dateOfBirth: null,
        gender: null,
        weight: null,
        height: null,
        BMI: null,
        weightTargets: [],
        profilePic: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/e00gxd21wgj-10%3A212?alt=media&token=0b84b92e-ad6d-4f45-a1a5-2c519feb85fb",
        lifestyleType: null,
    },
    reducers: {
        setName(state, action) {
            state.name = action.payload
        },
        setDateOfBirth(state, action) {
            state.dateOfBirth = action.payload
        },
        setGender(state, action) {
            state.gender = action.payload
        },
        setWeight(state, action) {
            state.weight = action.payload
            state.BMI = state.weight / Math.pow(state.height / 100, 2);
        },
        setHeight(state, action) {
            state.height = action.payload
            state.BMI = state.weight / Math.pow(state.height / 100, 2);
        },
        setWeightTargets(state, action) {
            state.weightTargets = action.payload;
        },
        setProfilePic(state, action) {
            state.profilePic = action.payload
        },
        setLifestyleType(state, action) {
            state.lifestyleType = action.payload;
        }
    }
});

export const { setName, setDateOfBirth, setGender, setWeight, setHeight, setWeightTargets, setProfilePic, setLifestyleType } = profileSlice.actions
export default profileSlice.reducer