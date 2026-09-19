import mongoose from 'mongoose';

const connectionInfoSchema = new mongoose.Schema({
  connectionStatus: {
    type: String,
    default: 'ACTIVE_CONNECTED'
  },
  databaseName: {
    type: String,
    required: true
  },
  clusterHost: {
    type: String,
    required: true
  },
  connectedUser: {
    type: String,
    required: true
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  application: {
    type: String,
    default: 'Sagar Kaushik Full-Stack Portfolio (MERN Stack)'
  },
  serverNodeVersion: {
    type: String
  },
  platform: {
    type: String
  },
  adminUsername: {
    type: String,
    default: 'sagar'
  },
  collectionsInitialized: [
    { type: String }
  ],
  systemNote: {
    type: String,
    default: 'MongoDB Atlas cluster0 is active, verified and synced with live portfolio data.'
  }
}, {
  timestamps: true,
  collection: 'connection_info'
});

export const ConnectionInfo = mongoose.model('ConnectionInfo', connectionInfoSchema);
