const { Queue, QueueLog, Staff } = require('../models');
const { fn, col, literal } = require('sequelize');
const { success, error } = require('../utils/response');

exports.getDashboardData = async (req, res) => {
  try {
    const staffId = req.user.id;

    const activeQueues = await Queue.count({ where: { status: 'WAITING' } });
    const activeStaff = await Staff.count({ where: { is_active: true } });

    const queues = await Queue.findAll({
      where: { status: ['WAITING', 'CALLED'] },
      order: [['created_at', 'ASC']],
      attributes: ['id', 'queue_number', 'name', 'type', 'status']
    });

    const staffs = await Staff.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'is_active']
    });

    const topStaff = await QueueLog.findAll({
      attributes: [
        'staff_id',
        [fn('COUNT', col('QueueLog.id')), 'served_count']
      ],
      include: [{ model: Staff, as: 'staff', attributes: ['name'] }],
      group: ['staff_id'],
      order: [[literal('served_count'), 'DESC']],
      limit: 3
    });

    const avgDurations = await QueueLog.findAll({
      attributes: [
        'staff_id',
        [fn('AVG', col('duration_seconds')), 'avg_duration']
      ],
      include: [{ model: Staff, as: 'staff', attributes: ['name'] }],
      group: ['staff_id']
    });

    const currentStaff = await Staff.findByPk(staffId, {
      attributes: ['id', 'name', 'email', 'is_active']
    });

    return success(res, {
      activeQueues,
      activeStaff,
      queues,
      staffs,
      topStaff,
      avgDurations,
      currentStaff,
    }, 'Dashboard data fetched');
  } catch (err) {
    return error(res, err, 'Failed to load dashboard data');
  }
};