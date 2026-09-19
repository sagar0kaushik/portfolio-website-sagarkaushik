import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const uri = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(uri, {
    dbName: 'sagar_kaushik_portfolio',
    serverSelectionTimeoutMS: 15000
  });

  console.log('Connected to database:', mongoose.connection.name);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections present:');
  for (const c of collections) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    console.log(` - ${c.name}: ${count} document(s)`);
  }

  const connDoc = await mongoose.connection.db.collection('connection_info').findOne();
  console.log('\n--- CONNECTION_INFO DOCUMENT IN ATLAS ---');
  console.log(JSON.stringify(connDoc, null, 2));

  await mongoose.disconnect();
}

run();
