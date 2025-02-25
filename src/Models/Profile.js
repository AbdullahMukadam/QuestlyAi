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
    email: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    memberShipType: {
        type: String,
        enum: ['free', 'Basic Monthly', 'Premium Monthly'],
        default: 'free'
    },
    memberShipStartDate: {
        type: Date,
        default: null
    },
    memberShipEndDate: {
        type: Date,
        default: null
    },
    subscriptionId: {
        type: String,
        default: null
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired', 'created'],
        default: 'inactive'
    },
    effectiveCancellationDate: {
        type: Date,
        default: null
    },
    recruiterDetails: {
        required: function () {
            this.role === "recruiter"
        },
        type: {
            username: {
                required: true,
                type: String
            },
            companyName: {
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
            username: {
                required: true,
                type: String
            },
            Skills: {
                type: String,
                required: true
            },

            _id: false
        }
    }
})

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema)
export default Profile;