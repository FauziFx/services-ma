const pool = require("../db/connect.js");

const getGaransiPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * (page - 1);
    const totalRows = await pool.query(
      `SELECT COUNT(*) as totalRow FROM garansi WHERE nama LIKE '%${search}%'`
    );
    const totalPage = Math.ceil(totalRows[0][0].totalRow / limit);

    const response = await pool.query(
      `SELECT garansi.*, optik.nama_optik FROM garansi
            JOIN optik ON garansi.optik_id = optik.id
            WHERE nama LIKE '%${search}%'
            ORDER BY garansi.id DESC
            LIMIT ${limit} OFFSET ${offset}`,
      {
        raw: false,
      }
    );

    res.status(200).json({
      success: true,
      page: page,
      limit: limit,
      totalRows: totalRows[0][0].totalRow,
      totalPage: totalPage,
      data: response[0],
    });
  } catch (error) {
    next(error);
  }
};

const getGaransiAll = async (req, res, next) => {
  try {
    const [response] = await pool.query(
      `SELECT garansi.*, optik.nama_optik FROM garansi
            JOIN optik ON garansi.optik_id = optik.id
            ORDER BY garansi.id DESC`
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const getGaransiById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [response] = await pool.query(
      `SELECT garansi.*, optik.nama_optik FROM garansi
            JOIN optik ON garansi.optik_id = optik.id
            WHERE garansi.id = ${id}
            ORDER BY garansi.id DESC`
    );
    res.status(200).json({
      success: true,
      data: response[0],
    });
  } catch (error) {
    next(error);
  }
};

const createDataGaransi = async (req, res, next) => {
  const {
    nama,
    frame,
    lensa,
    r,
    l,
    garansi_lensa,
    garansi_frame,
    expired_lensa,
    expired_frame,
    claimed_lensa,
    claimed_frame,
    tanggal,
    optik_id,
  } = req.body;

  try {
    await pool.query(
      `
        INSERT INTO garansi (nama, frame, lensa, r, l, garansi_lensa, garansi_frame, expired_lensa, expired_frame, claimed_lensa, claimed_frame, tanggal, optik_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `,
      [
        nama,
        frame,
        lensa,
        r,
        l,
        garansi_lensa,
        garansi_frame,
        expired_lensa,
        expired_frame,
        claimed_lensa,
        claimed_frame,
        tanggal,
        optik_id,
      ]
    );

    res.status(201).json({ success: true, message: "Data Berhasil disimpan" });
  } catch (error) {
    next(error);
  }
};

const updateDataGaransi = async (req, res, next) => {
  const { id } = req.params;
  const {
    nama,
    frame,
    lensa,
    r,
    l,
    garansi_lensa,
    garansi_frame,
    expired_lensa,
    expired_frame,
    claimed_lensa,
    claimed_frame,
    optik_id,
    tanggal,
  } = req.body;
  try {
    await pool.query(
      `UPDATE garansi SET 
      nama = ?, 
      frame = ?, 
      lensa = ?, 
      r = ?, 
      l = ?, 
      garansi_lensa = ?, 
      garansi_frame = ?, 
      expired_lensa = ?, 
      expired_frame = ?, 
      claimed_lensa = ?, 
      claimed_frame = ?, 
      optik_id = ?
      WHERE id = ?
    `,
      [
        nama,
        frame,
        lensa,
        r,
        l,
        garansi_lensa,
        garansi_frame,
        expired_lensa,
        expired_frame,
        claimed_lensa,
        claimed_frame,
        optik_id,
        id,
      ]
    );
    res.status(201).json({ success: true, message: "Data Berhasil disimpan" });
  } catch (error) {
    next(error);
  }
};

const deleteDataGaransi = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query(`DELETE FROM garansi WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: "Data berhasil dihapus!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getGaransiPagination = getGaransiPagination;
exports.getGaransiAll = getGaransiAll;
exports.getGaransiById = getGaransiById;
exports.createDataGaransi = createDataGaransi;
exports.updateDataGaransi = updateDataGaransi;
exports.deleteDataGaransi = deleteDataGaransi;
