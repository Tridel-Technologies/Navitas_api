const {pool} = require('./db');
const dayjs = require('dayjs');

// Utility to simulate values within a range
const simulateValue = (min, max, precision = 2) => {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(precision));
};

// Generate a simulated row for a given station and datetime
const generateSimulatedRow = (stationID, dateTime) => ({
  stationID,
  dateTime,
  hs: simulateValue(0.5, 4),
  dominant_period_fw: simulateValue(5, 12),
  wave_direction_apd: simulateValue(0, 360),
  mean_wave_dir: simulateValue(0, 360),
  average_period_te: simulateValue(4, 10),
  gn: simulateValue(0.5, 1.5),
  dp1: simulateValue(5, 15),
  dp2: simulateValue(5, 15),
  rms_tilt: simulateValue(0, 5),
  max_tilt: simulateValue(0, 10),
  heading: simulateValue(0, 360),
  tzc: simulateValue(5, 12),
  p_max: simulateValue(1, 5),
  average_period_apd: simulateValue(5, 10),
  h_max: simulateValue(2, 6),
  fourier_coefficient_a1: simulateValue(-1, 1),
  fourier_coefficient_a2: simulateValue(-1, 1),
  fourier_coefficient_b1: simulateValue(-1, 1),
  fourier_coefficient_b2: simulateValue(-1, 1),
  hs_swell: simulateValue(0.5, 3),
  period_swell: simulateValue(6, 14),
  direction_swell: simulateValue(0, 360),
  hm0: simulateValue(1, 4),
  hm1: simulateValue(1, 4),
  t_mean: simulateValue(6, 12),
  t_peak: simulateValue(6, 12),
  epsilon: simulateValue(0.1, 1.0),
  h3eps: simulateValue(1, 3),
  h2: simulateValue(1, 3),
  t2: simulateValue(6, 12),
  h3: simulateValue(1, 4),
  t3: simulateValue(6, 12),
  h10: simulateValue(2, 5),
  t10: simulateValue(6, 12),
  h_avg: simulateValue(1, 4),
  h_max_zc: simulateValue(2, 6),
  hs_swell2: simulateValue(0.5, 3),
  direction_swell2: simulateValue(0, 360),
  hs2: simulateValue(0.5, 4),
  pitch: simulateValue(-10, 10),
  roll: simulateValue(-10, 10),
  heave: simulateValue(-2, 2),
});

// Express route handler for inserting simulated data
const insertSimulatedData = async (req, res) => {
  const { stationID = 'ST001' } = req.body;
  const start = dayjs('2025-01-01T00:00:00Z');
  const end = dayjs('2025-06-30T23:00:00Z');
  const batchSize = 100;
  let current = start;
  const rows = [];

  try {
    while (current.isBefore(end)) {
      rows.push(generateSimulatedRow(stationID, current.toISOString()));
      current = current.add(10, 'minutes');

      if (rows.length === batchSize) {
        await insertBatch(rows);
        rows.length = 0;
      }
    }

    if (rows.length) {
      await insertBatch(rows);
    }

    return res.status(201).json({
      message: 'Simulated data inserted successfully for Jan to May 2025',
      stationID,
    });
  } catch (error) {
    console.error('❌ Error inserting data:', error);
    return res.status(500).json({ message: 'Failed to insert data', error: error.message });
  }
};

const insertBatch = async (rows) => {
//   const client = await pool.connect();
  try {
    const keys = Object.keys(rows[0]);
    const values = rows.map(Object.values);
    const placeholders = values.map(
      (row, i) => `(${row.map((_, j) => `$${i * keys.length + j + 1}`).join(', ')})`
    ).join(', ');
    const flatValues = values.flat();
    const query = `INSERT INTO tb_master (${keys.join(', ')}) VALUES ${placeholders}`;
    await pool.query(query, flatValues);
  } catch (err) {
    console.error('❌ Insertion error in batch:', err);
    throw err;
  } finally {
    // pool.release();
  }
};

module.exports = { insertSimulatedData };
