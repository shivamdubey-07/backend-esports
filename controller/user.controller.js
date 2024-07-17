import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const registerUser = async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({
    username,
    name,
    password,
    email,
  });

  const createdUser = await User.findOne({ _id: user._id }).select("-password");
  if (!createdUser) {
    return res.status(500).json({ message: "User not created" });
  }
  res
    .status(201)
    .json({ user: createdUser, message: "user created successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid password" });
  }
  if (isPasswordCorrect) {
    const token = await user.generateToken();

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
    const retrievedUser = await User.findOne({ email: email }).select(
      "-password"
    );
    res
      .status(200)
      .json({ retrievedUser, token, message: "Login successfully" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, email } = req.body;
    console.log(username);

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (username && user.username != username) {
      const existedUser = await User.findOne({ username: username });
      if (existedUser) {
        return res.status(409).json({ message: "username already exists" });
      }

      user.username = username;
    }

    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }

    if (req.file) {
      const filePath = req.file.path;

      if (!filePath) {
        return res
          .status(500)
          .json({ message: "profile image path not found" });
      }
      if (filePath) {
        const profileImage = await uploadOnCloudinary(filePath);

        if (!profileImage) {
          return res
            .status(500)
            .json({ message: "profile image not uploaded" });
        }

        user.profileImage = profileImage.url;
      }
    }

    const updatedUser = await user.save();

    return res
      .status(200)
      .json({ user: updatedUser, message: "profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
