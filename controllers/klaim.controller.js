const pool = require("../db/connect.js");

const getKlaimALl = async (req, res, next) => {
  try {
    const [response] = await pool.query(
      `SELECT garansi.nama, garansi.frame, garansi.lensa, klaim_garansi.* FROM garansi
      JOIN klaim_garansi ON klaim_garansi.garansi_id = garansi.id ORDER BY id DESC`
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createDataKlaim = async (req, res, next) => {
  const { garansi_id, jenis_garansi, kerusakan, perbaikan, tanggal } = req.body;
  try {
    const response = await pool.query(
      `INSERT INTO klaim_garansi (garansi_id, jenis_garansi, kerusakan, perbaikan, tanggal)
      VALUES (?,?,?,?,?)`,
      [garansi_id, jenis_garansi, kerusakan, perbaikan, tanggal]
    );

    let sql;
    if (jenis_garansi === "lensa") {
      sql = `UPDATE garansi SET claimed_lensa = '0' WHERE id = ?`;
    } else {
      sql = `UPDATE garansi SET claimed_frame = '0' WHERE id = ?`;
    }

    if (response) {
      await pool.query(sql, [garansi_id]);
    }
    res.status(201).json({
      success: true,
      message: "Data Berhasil disimpan",
    });
  } catch (error) {
    next(error);
  }
};

const getKlaimByGaransiId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [response] = await pool.query(
      "SELECT * FROM klaim_garansi WHERE garansi_id = ?",
      [id]
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDataKlaim = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await pool.query(
      "DELETE FROM klaim_garansi WHERE id = ?",
      [id]
    );
    res.status(200).json({
      success: true,
      message: "Data Berhasil dihapus!",
      res: response,
    });
  } catch (error) {
    next(error);
  }
};

exports.getKlaimALl = getKlaimALl;
exports.createDataKlaim = createDataKlaim;
exports.getKlaimByGaransiId = getKlaimByGaransiId;
exports.deleteDataKlaim = deleteDataKlaim;
