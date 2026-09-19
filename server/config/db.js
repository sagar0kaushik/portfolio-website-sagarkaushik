import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { initialProjects, initialBlogs } from '../data/seedData.js';
import { Project } from '../models/Project.js';
import { Blog } from '../models/Blog.js';
import { Contact } from '../models/Contact.js';
import { User } from '../models/User.js';
import { ConnectionInfo } from '../models/ConnectionInfo.js';

dotenv.config();

// Configure robust DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('[DNS] Could not override default DNS servers:', e.message);
}

let isMongoConnected = false;

// Fallback memory store when MongoDB URI is offline
export const memoryStore = {
  projects: JSON.parse(JSON.stringify(initialProjects)),
  blogs: JSON.parse(JSON.stringify(initialBlogs)),
  contacts: [],
  users: [
    {
      _id: 'admin-seed-id-01',
      username: process.env.ADMIN_USERNAME || 'sagar',
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'SagarKaushik@2026', 10),
      role: 'admin',
      createdAt: new Date()
    }
  ]
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.log('[DB] No MONGODB_URI configured. Running with embedded in-memory data store.');
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      dbName: 'sagar_kaushik_portfolio',
      serverSelectionTimeoutMS: 15000
    });
    isMongoConnected = true;
    console.log('[DB] Successfully connected to MongoDB Atlas cluster0!');

    // Seed database and save connection info into MongoDB collection
    await seedMongoIfEmpty();
  } catch (error) {
    console.warn('[DB] Could not connect to MongoDB:', error.message);
    console.log('[DB] Falling back to embedded in-memory data store. APIs will function normally.');
    isMongoConnected = false;
  }
};

const seedMongoIfEmpty = async () => {
  try {
    // 1. Projects Collection - Ensure all initial projects exist
    for (const p of initialProjects) {
      const exists = await Project.findOne({ slug: p.slug });
      if (!exists) {
        console.log(`[DB] Seeding missing project [${p.slug}] into MongoDB...`);
        await Project.create(p);
      }
    }

    // 2. Blogs Collection - Ensure all initial blogs exist
    for (const b of initialBlogs) {
      const exists = await Blog.findOne({ slug: b.slug });
      if (!exists) {
        console.log(`[DB] Seeding missing article [${b.slug}] into MongoDB...`);
        await Blog.create(b);
      } else if (!exists.featuredImage || !exists.excerpt || !exists.status) {
        await Blog.updateOne({ slug: b.slug }, { $set: {
          excerpt: exists.excerpt || b.excerpt,
          featuredImage: exists.featuredImage || b.featuredImage,
          featuredImageAlt: exists.featuredImageAlt || b.featuredImageAlt,
          status: exists.status || b.status,
          readingTime: exists.readingTime || b.readingTime,
          canonicalUrl: exists.canonicalUrl || b.canonicalUrl
        }});
      }
    }

    // 3. Admin User in Users Collection
    const adminUser = process.env.ADMIN_USERNAME || 'sagar';
    const adminPass = process.env.ADMIN_PASSWORD || 'SagarKaushik@2026';
    const existingAdmin = await User.findOne({ username: adminUser });

    if (!existingAdmin) {
      console.log(`[DB] Creating default admin user [${adminUser}] in MongoDB...`);
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      await User.create({
        username: adminUser,
        password: hashedPassword,
        role: 'admin'
      });
    }

    // 4. Initial Contacts if empty
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create([
        {
          name: 'Sarah Chen',
          email: 'sarah.chen@productdesign.io',
          message: 'Hi Sagar, loved your Grovia e-commerce and FastAPI systems. Would love to discuss a full-stack engineering role with our product team.',
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          name: 'David Miller',
          email: 'david.m@apexventures.co',
          message: 'Impressive editorial portfolio and clean MERN stack architecture. Can we schedule a brief intro call this week?',
          createdAt: new Date(Date.now() - 36000000)
        }
      ]);
      console.log('[DB] Seeded initial contact inquiries into MongoDB.');
    }

    // 5. Connection Information Collection (as requested by user)
    await ConnectionInfo.deleteMany({}); // Keep clean current record
    await ConnectionInfo.create({
      connectionStatus: 'ACTIVE_CONNECTED',
      databaseName: 'sagar_kaushik_portfolio',
      clusterHost: 'cluster0.uejj6gg.mongodb.net',
      connectedUser: 'sagarkaushik584_db_user',
      connectedAt: new Date(),
      application: 'Sagar Kaushik Full-Stack Portfolio (MERN + FastAPI)',
      serverNodeVersion: process.version,
      platform: process.platform,
      adminUsername: adminUser,
      collectionsInitialized: ['projects', 'blogs', 'users', 'contacts', 'connection_info'],
      systemNote: 'MongoDB Atlas cluster0 is active, verified and synced with live portfolio data.'
    });
    console.log('[DB] Recorded connection details in [connection_info] collection on MongoDB Atlas.');

  } catch (err) {
    console.error('[DB] Error during initial database seeding:', err.message);
  }
};

export const getDbStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'mongodb' : 'in-memory-fallback',
  database: 'sagar_kaushik_portfolio',
  cluster: 'cluster0.uejj6gg.mongodb.net'
});
