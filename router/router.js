const express = require("express");
const {
  getGaransiPagination,
  getGaransiAll,
  getGaransiById,
  createDataGaransi,
  updateDataGaransi,
  deleteDataGaransi,
} = require("../controllers/garansi.controller");
const {
  getOptikAll,
  createDataOptik,
  deleteDataOptik,
  updateDataOptik,
} = require("../controllers/optik.controller.js");
const { login, authToken } = require("../controllers/auth.controller.js");
const {
  getUserAll,
  createDataUser,
  getUserbyId,
  updateDataUser,
  changePassword,
  deleteDataUser,
} = require("../controllers/user.controller.js");
const {
  getProductsAll,
  getProductById,
  updateDataProductStok,
} = require("../controllers/product.controller.js");
const {
  getPasienAll,
  createDataPasien,
  updateDataPasien,
  deleteDataPasien,
} = require("../controllers/pasien.controller.js");
const {
  getRekamAll,
  createDataRekam,
  deleteDataRekam,
  getRekamByPasienId,
} = require("../controllers/rekam.controller.js");
const {
  getKlaimALl,
  getKlaimByGaransiId,
  createDataKlaim,
  deleteDataKlaim,
} = require("../controllers/klaim.controller.js");

const router = express.Router();

// Router Garansi
router.route("/garansipage").get(getGaransiPagination);
router.route("/garansi").get(getGaransiAll).post(createDataGaransi);
router
  .route("/garansi/:id")
  .get(getGaransiById)
  .put(updateDataGaransi)
  .delete(deleteDataGaransi);

// Router Optik
router.route("/optik").get(getOptikAll).post(createDataOptik);

router.route("/").get((req, res) => {
  res.json({ message: "Localhost is safe" });
});

// Auth
router.route("/login").post(login);
router.use(authToken);

// Router Optik
router.route("/optik").post(createDataOptik);
router.route("/optik/:id").delete(deleteDataOptik).put(updateDataOptik);

// Router Users
router.route("/users").get(getUserAll).post(createDataUser);
router
  .route("/users/:id")
  .get(getUserbyId)
  .put(updateDataUser)
  .delete(deleteDataUser);
router.route("/change_password/:id").put(changePassword);

// Router Products
router.route("/products").get(getProductsAll);
router.route("/product/:id").get(getProductById).put(updateDataProductStok);

// Router Klaim Garansi
router.route("/garansi_klaim").get(getKlaimALl).post(createDataKlaim);
router
  .route("/garansi_klaim/:id")
  .get(getKlaimByGaransiId)
  .delete(deleteDataKlaim);

// Router Pasien
router.route("/pasien").get(getPasienAll).post(createDataPasien);
router.route("/pasien/:id").put(updateDataPasien).delete(deleteDataPasien);

// Router Rekam Medis
router.route("/rekam").get(getRekamAll).post(createDataRekam);
router.route("/rekam/:id").delete(deleteDataRekam).get(getRekamByPasienId);

// Error
const Error404 = (req, res) => {
  res.status(404).json({
    error: 404,
    message: "Not Found",
  });
};
router.route("*").get(Error404).post(Error404);

module.exports = router;
