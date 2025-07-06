const { Queue, QueueLog, Staff } = require('../models');
const { Op } = require('sequelize');
const { success, error } = require('../utils/response');

exports.createQueue = async (req, res) => {
  const { name, birth_date, complaint, type } = req.body;
  try {
    const lastQueue = await Queue.findOne({
      where: { type },
      order: [['id', 'DESC']]
    });

    const nextNumber = lastQueue ? parseInt(lastQueue.queue_number.slice(1)) + 1 : 1;
    const prefix = type === 'RESERVATION' ? 'R' : 'W';
    const queue_number = `${prefix}${String(nextNumber).padStart(3, '0')}`;

    const newQueue = await Queue.create({
      queue_number,
      name,
      birth_date,
      complaint,
      type,
      status: 'WAITING'
    });

    return success(res, newQueue, 'Queue created successfully', 201);
  } catch (err) {
    return error(res, err, 'Failed to create queue');
  }
};

exports.callNextQueue = async (req, res) => {
  const { Queue, QueueLog } = require('../models')
  const { success, error } = require('../utils/response')

  try {
    const io = req.app.get('io');
    const staff_id = req.user.id;
    const staff_name = req.user.name;

    if (!io) {
      console.error('Socket.IO not initialized');
      return error(res, null, 'Server error: Socket not available');
    }

    const waitingQueues = await Queue.findAll({
      where: { status: 'WAITING' },
      order: [['created_at', 'ASC']]
    });

    const reservasiList = waitingQueues.filter(q => q.type === 'RESERVATION');
    const walkinList = waitingQueues.filter(q => q.type === 'WALK-IN');

    const combined = [];
    let r = 0, w = 0;
    while (r < reservasiList.length || w < walkinList.length) {
      if (r < reservasiList.length) combined.push(reservasiList[r++]);
      if (r < reservasiList.length) combined.push(reservasiList[r++]);
      if (w < walkinList.length) combined.push(walkinList[w++]);
    }

    if (combined.length === 0) {
      return success(res, {}, 'Tidak ada antrian untuk dipanggil');
    }

    const next = combined[0];

    next.status = 'CALLED';
    await next.save();

    const log = await QueueLog.create({
      queue_id: next.id,
      staff_id,
      called_at: new Date(),
      duration_seconds: 0
    });

    io.emit('queue-called', {
      queue_number: next.queue_number,
      type: next.type,
      staff: staff_name || 'Petugas',
      log_id: log.id
    });

    return success(res, next, 'Antrian berikutnya dipanggil');
  } catch (err) {
    return error(res, err, 'Gagal memanggil antrian');
  }
};

exports.markQueueAsDone = async (req, res) => {
  try {
    const queueId = req.params.id;

    const queue = await Queue.findByPk(queueId);
    if (!queue) return error(res, {}, 'Antrian tidak ditemukan', 404);

    if (queue.status !== 'CALLED') {
      return error(res, {}, 'Antrian belum dipanggil atau sudah selesai', 400);
    }

    queue.status = 'DONE';
    await queue.save();

    const log = await QueueLog.findOne({
      where: {
        queue_id: queueId
      }
    });

    if (log && log.called_at) {
      const now = new Date();
      const calledAt = new Date(log.called_at);
      const duration = Math.floor((now - calledAt) / 1000);

      log.duration_seconds = duration;
      await log.save();
    }

    return success(res, queue, 'Antrian diselesaikan');
  } catch (err) {
    return error(res, err, 'Gagal menyelesaikan antrian');
  }
};

exports.getDisplayQueue = async (req, res) => {
  try {
    const queue = await Queue.findOne({
      where: { status: 'CALLED' },
      order: [['created_at', 'DESC']],
      include: [{
        model: QueueLog,
        as: 'log',
        include: [{ model: Staff, as: 'staff', attributes: ['name'] }]
      }]
    })

    if (!queue) {
      return success(res, null, 'Tidak ada antrian sedang dipanggil')
    }

    return success(res, {
      queue_number: queue.queue_number,
      type: queue.type,
      staff: queue.log?.staff?.name || 'Petugas'
    }, 'Antrian dipanggil ditemukan')
  } catch (err) {
    return error(res, err, 'Gagal mengambil data display')
  }
}