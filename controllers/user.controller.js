const pool = require("../db/connect.js");
const bcrypt = require("bcrypt");

const getUserAll = async (req, res, next) => {
  try {
    const [response] = await pool.query(
      "SELECT users.id, users.name, users.email, users.role FROM users"
    );
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const createDataUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?. ?)",
      [name, email, passwordHash, role]
    );
    res.status(201).json({
      success: true,
      message: "Data Berhasil Disimpan!",
    });
  } catch (error) {
    next(error);
  }
};

const getUserbyId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [response] = await pool.query(
      "SELECT users.id, users.name, users.email, users.role FROM users WHERE id = ?",
      [id]
    );
    res.status(200).json({
      success: true,
      data: response[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateDataUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    if (password === "") {
      await pool.query(
        "UPDATE users SET name= ?, email= ?, role= ? WHERE id = ?",
        [name, email, role, id]
      );
    } else {
      const passwordHash = bcrypt.hashSync(password, 10);
      await pool.query(
        "UPDATE users SET name= ?, email= ?, password= ?, role= ? WHERE id = ?",
        [name, email, passwordHash, role, id]
      );
    }

    res.status(201).json({
      success: true,
      message: "Data berhasil disimpan!",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, role, oldPassword, newPassword } = req.body;

  try {
    const [user] = await pool.query("SELECT password FROM users WHERE id = ?", [
      id,
    ]);

    bcrypt.compare(oldPassword, user[0].password, function (err, result) {
      if (err) next(err);

      if (!result) {
        res.json({
          success: false,
          message: "Password lama tidak sesuai!!",
        });
      } else {
        bcrypt.hash(newPassword, 10, async function (err, hash) {
          if (err) throw err;
          if (hash) {
            await pool.query(
              "UPDATE users SET name= ?, email= ?, password= ?, role= ? WHERE id = ?",
              [name, email, hash, role, id]
            );

            res.status(201).json({
              success: true,
              message: "Password berhasil disimpan",
            });
          }
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteDataUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    next(error);
  }
};

exports.getUserAll = getUserAll;
exports.createDataUser = createDataUser;
exports.getUserbyId = getUserbyId;
exports.updateDataUser = updateDataUser;
exports.changePassword = changePassword;
exports.deleteDataUser = deleteDataUser;
