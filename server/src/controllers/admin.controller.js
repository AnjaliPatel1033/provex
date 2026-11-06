const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');

const allowedStatuses = ['New', 'In Progress', 'Completed'];
const statusFilter = (status) => status === 'In Progress' ? ['In Progress', 'Read'] : status === 'Completed' ? ['Completed', 'Contacted'] : [status];
const normalize = (item) => {
  const data = item.toObject ? item.toObject() : item;
  if (data.status === 'Read') data.status = 'In Progress';
  if (data.status === 'Contacted') data.status = 'Completed';
  return data;
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    if (!email || typeof password !== 'string' || password.length > 200) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(503).json({ success: false, message: 'Admin authentication is not configured.' });
    const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { subject: admin.id, algorithm: 'HS256', expiresIn: '8h' });
    res.json({ success: true, token, admin: { email: admin.email }, expiresIn: 28800 });
  } catch (error) { next(error); }
};

exports.dashboard = async (req, res, next) => {
  try {
    const [total, grouped, recent] = await Promise.all([
      Contact.countDocuments(),
      Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Contact.find().sort({ createdAt: -1 }).limit(6)
    ]);
    const counts = { New: 0, 'In Progress': 0, Completed: 0 };
    for (const row of grouped) {
      const key = row._id === 'Read' ? 'In Progress' : row._id === 'Contacted' ? 'Completed' : row._id;
      if (key in counts) counts[key] += row.count;
    }
    res.json({ success: true, data: { total, counts, recent: recent.map(normalize) } });
  } catch (error) { next(error); }
};

exports.listInquiries = async (req, res, next) => {
  try {
    const pageValue = String(req.query.page || '1');
    const limitValue = String(req.query.limit || '20');
    if (!/^\d+$/.test(pageValue) || !/^\d+$/.test(limitValue)) return res.status(400).json({ success: false, message: 'Invalid pagination.' });
    const page = Math.max(1, Math.min(100000, Number(pageValue)));
    const limit = Math.max(1, Math.min(100, Number(limitValue)));
    const query = {};
    const search = String(req.query.search || '').trim().slice(0, 100);
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = ['fullName', 'email', 'phoneNumber', 'subject'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } }));
    }
    const status = String(req.query.status || '');
    if (status && status !== 'All') {
      if (!allowedStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid inquiry status.' });
      query.status = { $in: statusFilter(status) };
    }
    const from = req.query.from ? new Date(String(req.query.from)) : null;
    const to = req.query.to ? new Date(String(req.query.to)) : null;
    if ((req.query.from && (!/^\d{4}-\d{2}-\d{2}$/.test(String(req.query.from)) || Number.isNaN(from.getTime()))) || (req.query.to && (!/^\d{4}-\d{2}-\d{2}$/.test(String(req.query.to)) || Number.isNaN(to.getTime())))) return res.status(400).json({ success: false, message: 'Invalid date filter.' });
    if (from || to) {
      if (to) to.setUTCDate(to.getUTCDate() + 1);
      query.createdAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lt: to } : {}) };
    }
    const [items, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Contact.countDocuments(query)
    ]);
    res.json({ success: true, data: items.map(normalize), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

exports.getInquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid inquiry ID.' });
    const inquiry = await Contact.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: normalize(inquiry) });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid inquiry ID.' });
    if (!allowedStatuses.includes(req.body.status)) return res.status(400).json({ success: false, message: 'Invalid inquiry status.' });
    const inquiry = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: normalize(inquiry) });
  } catch (error) { next(error); }
};

exports.deleteInquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid inquiry ID.' });
    const inquiry = await Contact.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true });
  } catch (error) { next(error); }
};
