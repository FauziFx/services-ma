const pool = require("../db/connect.js");

const getPasienAll = async (req, res, next) => {
  try {
    const [response] = await pool.query(
      "SELECT * FROM pasien ORDER BY id DESC"
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createDataPasien = async (req, res, next) => {
  const { nama, alamat, ttl, jenis_kelamin, pekerjaan, nohp, riwayat } =
    req.body;

  try {
    const response = await pool.query(
      `INSERT INTO pasien (nama,alamat,ttl,jenis_kelamin,pekerjaan,nohp,riwayat)
        VALUES (?,?,?,?,?,?,?)`,
      [nama, alamat, ttl, jenis_kelamin, pekerjaan, nohp, riwayat]
    );
    res.status(201).json({
      success: true,
      id: response[0].insertId,
      message: "Data Berhasil disimpan",
    });
  } catch (error) {
    next(error);
  }
};

const updateDataPasien = async (req, res, next) => {
  const { id } = req.params;
  const { nama, alamat, ttl, jenis_kelamin, pekerjaan, nohp, riwayat } =
    req.body;
  const update_at = await getCurrentDate();
  try {
    await pool.query(
      `UPDATE pasien SET nama = ?, alamat = ?, ttl = ?, jenis_kelamin = ?, pekerjaan = ?, nohp = ?, riwayat = ?, update_at = ? WHERE id = ?`,
      [
        nama,
        alamat,
        ttl,
        jenis_kelamin,
        pekerjaan,
        nohp,
        riwayat,
        update_at,
        id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteDataPasien = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM pasien WHERE id = ?", [id]);

    res.json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    next(error);
  }
};

exports.getPasienAll = getPasienAll;
exports.createDataPasien = createDataPasien;
exports.updateDataPasien = updateDataPasien;
exports.deleteDataPasien = deleteDataPasien;

const getCurrentDate = async () => {
  const dateObj = new Date();

  let year = dateObj.getFullYear();

  let month = dateObj.getMonth();
  month = ("0" + (month + 1)).slice(-2);
  // To make sure the month always has 2-character-format. For example, 1 => 01, 2 => 02

  let date = dateObj.getDate();
  date = ("0" + date).slice(-2);
  // To make sure the date always has 2-character-format

  let hour = dateObj.getHours();
  hour = ("0" + hour).slice(-2);
  // To make sure the hour always has 2-character-format

  let minute = dateObj.getMinutes();
  minute = ("0" + minute).slice(-2);
  // To make sure the minute always has 2-character-format

  let second = dateObj.getSeconds();
  second = ("0" + second).slice(-2);
  // To make sure the second always has 2-character-format

  const time = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  return time;
};
