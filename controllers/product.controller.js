const pool = require("../db/connect.js");

const getProductsAll = async (req, res, next) => {
  try {
    const [response] = await pool.query("SELECT * FROM products");
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [resProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    const resPower = await pool.query(
      `SELECT power.id,products.product_name, power.power_name, power.stock, power.stock AS actual_stock FROM products
            JOIN power ON products.id = power.product_id
            WHERE power.product_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      product_name: resProduct[0].product_name,
      data: resPower[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateDataProductStok = async (req, res, next) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    await pool.query("UPDATE power SET stock = ? WHERE id = ?", [stock, id]);
    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductsAll = getProductsAll;
exports.getProductById = getProductById;
exports.updateDataProductStok = updateDataProductStok;
