import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { updateProfileSchema, changePasswordSchema } from '../middleware/schemas.js';

/**
 * Admin: List users with pagination
 */
export const getUsersAdmin = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, 'email fullName role status createdAt updatedAt')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      User.countDocuments()
    ]);

    return res.status(200).json({
      page,
      total,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * Admin: Activate user
 */
export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User activated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Activation failed' });
  }
};

/**
 * Admin: Deactivate user
 */
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User deactivated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Deactivation failed' });
  }
};

/**
 * Get current user's profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
      'email fullName role status createdAt updatedAt lastLoginAt'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Update current user's profile
 */
export const updateProfile = async (req, res) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { fullName, email } = parsed.data;
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, email },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Update failed' });
  }
};

/**
 * Change current user's password
 */
export const changePassword = async (req, res) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { currentPassword, newPassword } = parsed.data;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Adjust field name if your schema uses passwordHash
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid current password' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.status(200).json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Password change failed' });
  }
};
