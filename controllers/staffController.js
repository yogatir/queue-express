const jwt = require('jsonwebtoken');
const { Staff } = require('../models');
const { success, error } = require('../utils/response');
const bcrypt = require('bcrypt');

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      attributes: ['id', 'name', 'is_active'],
      order: [['id', 'ASC']]
    });

    return success(res, staff, 'Staff list retrieved');
  } catch (err) {
    return error(res, err, 'Failed to fetch staff');
  }
};

exports.login = async (req, res) => {
  const { id, pin } = req.body;

  try {
    const staff = await Staff.findOne({ where: { id } });

    if (!staff) {
      return error(res, new Error(), 'Staff not found');
    }

    const isMatch = await bcrypt.compare(pin, staff.pin);
    if (!isMatch) {
      return error(res, new Error(), 'Invalid PIN');
    }

    await staff.update({ is_active: true });

    const token = jwt.sign(
      { id: staff.id, name: staff.name, email: staff.email },
      "secret-key",
      { expiresIn: '1d' }
    );

    return success(res, {
      id: staff.id,
      name: staff.name,
      token,
    }, 'Login successful');
  } catch (err) {
    return error(res, err, 'Failed to login');
  }
};