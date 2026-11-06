require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const { connectDB } = require('../config/db');

async function seed() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('Set MONGODB_URI, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters.');
  // Use the same trimmed URI and connection options as the running backend.
  await connectDB();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.updateOne({ email }, { $set: { passwordHash } }, { upsert: true });
  console.log(`Admin account ready for ${email}.`);
  await mongoose.disconnect();
}
seed().catch(async error => { console.error(error.message); await mongoose.disconnect(); process.exitCode = 1; });
