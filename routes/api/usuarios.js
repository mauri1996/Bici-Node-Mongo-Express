var express = require("express");
var router = express.Router();
var userController = require("../../controllers/api/usuarioControllerApi");

router.get("/", userController.usuarios_list);
router.post("/create", userController.usuarios_create);
router.post("/reservar", userController.usuarios_reservar);

module.exports = router;