const pool = require("../db/connect.js");

const getRekamAll = async (req, res, next) => {
  try {
    const [response] = await pool.query(
      `SELECT pasien.nama, pasien.alamat, pasien.ttl, pasien.jenis_kelamin, pasien.pekerjaan, pasien.nohp, pasien.riwayat, rekam.*, optik.nama_optik FROM rekam
        JOIN pasien ON rekam.pasien_id = pasien.id 
        LEFT JOIN optik ON rekam.optik_id = optik.id
        ORDER BY id DESC`
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createDataRekam = async (req, res, next) => {
  try {
    const {
      od,
      os,
      pd_jauh,
      pd_dekat,
      tanggal_periksa,
      pemeriksa,
      keterangan,
      ukuran_lama,
      pasien_id,
      optik_id,
    } = req.body;

    await pool.query(
      `INSERT INTO rekam 
      (od,os,pd_jauh,pd_dekat,tanggal_periksa,pemeriksa,keterangan,ukuran_lama,pasien_id,optik_id)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        od,
        os,
        pd_jauh,
        pd_dekat,
        tanggal_periksa,
        pemeriksa,
        keterangan,
        ukuran_lama,
        pasien_id,
        optik_id,
      ]
    );
    res.status(201).json({
      success: true,
      message: "Data Berhasil Disimpan!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteDataRekam = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await pool.query("DELETE FROM rekam WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "Data berhasil dihapus!",
      res: response,
    });
  } catch (error) {
    next(error);
  }
};

const getRekamByPasienId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [response] = await pool.query(
      `SELECT rekam.*, optik.nama_optik FROM rekam 
      LEFT JOIN optik ON rekam.optik_id = optik.id WHERE rekam.pasien_id = ?`,
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

exports.getRekamAll = getRekamAll;
exports.createDataRekam = createDataRekam;
exports.deleteDataRekam = deleteDataRekam;
exports.getRekamByPasienId = getRekamByPasienId;
