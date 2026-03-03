import mongoose from 'mongoose';
const AngelOneCredentialSchema = mongoose.Schema({
    angel_client_id: {
        type: String,
        required: true
    },
    angel_api_key: {
        type: String,
        required: true
    },
    angel_password: {
        type: String,
        required: true
    },
    angel_totp_key: {
        type: String,
        required: true
    },
    // Tokens
    feedToken: { type: String },
    jwtToken: { type: String },
    refreshToken: { type: String },
    token_expiry: { type: Date }
}, {
    timestamps: true,
});

const AngelOneCredential = mongoose.model('AngelOneCredential', AngelOneCredentialSchema);

export default AngelOneCredential;
