import { connection } from "../index.js";
import bcrypt from "bcrypt";

export const getUserbyID = async (req, res, next) => {
  const dbquery = "SELECT * from users where id = ?";
  try {
    const id = req.user.id;
    const [userDetails] = await connection.query(dbquery, [id]);
    res.json(userDetails);
  } catch (error) {
    console.log("Error fetching user details from user.js:", error);
  }
};

export const getAllUsers = async (req, res, next) => {
  const dbquery = "SELECT * from users";
  try {
    const [users] = await connection.query(dbquery);
    res.json(users);
  } catch (error) {
    console.log("Error fetching all users from user.js:", error);
    res.status(500).json({ message: "Error fetching all users" });
  }
};

export const getAnyUser = async (req, res, next) => {
  const dbquery = "SELECT * from users where id = ?";
  try {
    const { id } = req.query;
    const [userDetails] = await connection.query(dbquery, [id]);
    res.json(userDetails);
  } catch (error) {
    console.log("Error fetching user details from user.js:", error);
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const dbquery =
    "UPDATE users SET full_name = ?, address = ?, birthday = ?, gender=?, phone_number=?,avatar =? WHERE id = ?";

  try {
    const { full_name, address, birthday, gender, phone_number, avatar } =
      req.body;
    const id = req.user.id;

    await connection.query(dbquery, [
      full_name,
      address,
      new Date(birthday).toISOString().substring(0, 10),
      gender,
      phone_number,
      avatar,
      id,
    ]);
    res.status(201).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user");
    console.log("Error updating user details", error);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  try {
    const [result] = await connection.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

export const requestTheatreAdmin = async (req, res) => {
  const dbquery =
    "INSERT INTO request_for_theatre_admin (user_id, description,requested_date) VALUES (?, ?,?)";
  const { description } = req.body;
  const id = req.user.id;
  try {
    await connection.query(dbquery, [
      id,
      description,
      new Date().toISOString().split("T")[0],
    ]);
    res.status(201).send("Request submitted successfully");
  } catch (error) {
    res.status(500).send("Error submitting request");
    console.log("Error submitting request", error);
  }
};

export const addUser = async (req, res, next) => {
  const {
    full_name,
    email,
    phone_number,
    address,
    gender,
    birthday,
    role,
    password,
  } = req.body;
  const insertQuery = `
    INSERT INTO users (full_name, email, phone_number, address, gender, birthday, role, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(insertQuery, [
      full_name,
      email,
      phone_number,
      address,
      gender,
      birthday,
      role,
      password,
    ]);

    res.status(201).json({
      message: "User added successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.log("Error adding user:", error);
    res.status(500).json({ message: "Server error while adding user" });
  }
};


export const getUserRequests = async (req, res, next) => {
  const id= req.user.id;
  const dbquery = 
    "SELECT rfa.*, u.* FROM request_for_theatre_admin rfa JOIN users u ON rfa.user_id = u.id;";
  try {
    const [users] = await connection.query(dbquery);
    res.json(users);
  } catch (error){
    console.log("Error fetching all users from user.js:", error);
    res.status(500).json({ message: "Error fetching all user requests" });
  }};

  export const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updateQuery = `UPDATE request_for_theatre_admin SET status = ? WHERE id = ?`;

  try {
    const [result] = await connection.query(updateQuery, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

export const changePassword = async (req, res) => {
  const updateDbquery = "UPDATE users SET password = ? WHERE id = ?";
  const getPasswordDbquery = "SELECT password from users where id = ?";
  const id = req.user.id;
  const { previous_Password, new_password, confirm_password } = req.body;

  try {
    const [user] = await connection.query(getPasswordDbquery, [id]);
    const isPasswordCorrect = await bcrypt.compare(
      previous_Password,
      user[0].password
    );
    if (!isPasswordCorrect) {
      return res.status(200).send("Invalid password");
    }

    if (new_password !== confirm_password) {
      return res.status(200).send("Passwords do not match");
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);

    await connection.query(updateDbquery, [hashedPassword, id]);
    res.status(201).send("Password updated successfully");
  } catch (error) {
    res.status(500).send("Error updating password");
    console.log("Error updating password", error);
  }
};

