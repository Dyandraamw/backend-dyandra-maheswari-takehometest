import { Router } from "express";
import { createUser, findUser } from "./user-query";
import { compareSync } from "bcrypt";
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password, user_type } = req.body;

  try {
    const data = await createUser({ name, email, password, user_type });
    return res
      .status(201)
      .json({ message: "Sucessfully registered user", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to register user: " + error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await findUser({ email });

  if (!user || !compareSync(password, user.password)) {
    return res.status(403).json({ message: 'Email or password is incorrect' });
  }

  const token = sign(
    {
      user_id: user.user_id,
      user_type: user.user_type,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return res.status(200).json({
    message: 'Successfully logged in user',
    data: {
      token: token,
    },
  });
});

export default router;
