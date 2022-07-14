const express = require("express");
const router = express.Router();

const authenticate = require("./middleware")

const { login, verify } = require("./controllers");

router.route("/login").post(login);
router.route("/verify").post(authenticate, verify);

