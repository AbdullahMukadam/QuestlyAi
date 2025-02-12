import mongoose from "mongoose"


const ProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    memberShipType: {
        type: String,
        default: "free"
    },
    memberShipStartDate: {
        type: String,
        default: () => new Date().toISOString()
    },
    memberShipEndDate: {
        type: String,
        default: () => {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            return date.toISOString();
        }
    },
    recruiterDetails: {
        required: function () {
            this.role === "recruiter"
        },
        type: {
            companyName: {
                required: true,
                type: String
            },
            companyEmail: {
                required: true,
                type: String
            },
            companyRole: {
                required: true,
                type: String
            },
            _id: false,
        }
    },
    candidateDetails: {
        required: function () {
            this.role === "candidate"
        },
        type: {
            email: {
                type: String,
                required: true
            },
            _id: false
        }
    }
})

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)
export default Profile;