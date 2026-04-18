import express from "express";

import debug from "debug";
const debugUserRouter = debug("App:user");

import Joi from "joi";
import bcrypt from "bcrypt";

import { validBody } from "../../middleware/validBody.js";

import jwt from "jsonwebtoken";

import { fetchRoles, mergePermissions } from "@merlin4/express-auth";

const router = express.Router();

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});
import { getAllUsers, getUserByEmail, addUser } from "../../database.js";

router.use(express.urlencoded({ extended: false }));

async function issueAuthToken(user) {
  //const roles = await fetchRoles(user, (role) => findRoleByName(role));

  //const permissions = mergePermissions(user, roles);

  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return token;
}

async function issueAuthCookie(res, token) {
  const cookieOptions = {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "strict",
    secure: true,
  };
  res.cookie("authToken", token, cookieOptions);
}

//get all users
router.get("/", async (req, res) => {
  debugUserRouter("Get All Users Route Hit");
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//new user
router.post("/create", async (req, res) => {
  debugUserRouter("New user route hit");
  const user = req.body;
  console.log("New user info logged: ", user);
  let exsistingUser = null;

  try {
    exsistingUser = await getUserByEmail(user.email);
  } catch (e) {
    debugUserRouter(e);
    res
      .status(500)
      .json({ message: "Error creating new user, make sure info is correct" });
  }
  if (exsistingUser) {
    return res.status(400).json({ message: "Email already exsists" });
  }

  user.password = await bcrypt.hash(user.password, 10);
  const newUser = await addUser(user);
  console.log("New User Created", newUser);

  if (newUser.acknowledged) {
    //Generate JWT
    const jwtToken = await issueAuthToken(user);

    //Create Auth Cookie
    await issueAuthCookie(res, jwtToken);
    res
      .status(201)
      .json({ message: "User registered successfully", email: user.email });
  } else {
    res.status(500).json({
      message: "Error registering user, incorrect username or password",
    });
  }
});

//login existing user
router.post("/login", validBody(userSchema), async (req, res) => {
  debugUserRouter("Login route hit");
  const user = req.body;
  console.log("Log in info:", user);

  try {
    const existingUser = await getUserByEmail(user.email);
    if (!existingUser) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const jwtToken = await issueAuthToken(existingUser);
    await issueAuthCookie(res, jwtToken);
    res.status(200).json({
      message: "User logged in successfully",
      email: existingUser.email,
      token: jwtToken,
    });
  } catch (e) {
    debugUserRouter(e);
    res.status(500).json({ message: "Error logging in user" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "User logged out successfully" });
});

export { router as UserRouter };
