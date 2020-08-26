require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const users = express.Router();

// Encrypt password
const bcrypt = require("bcryptjs");
const pool = require("../db");

const emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**************************
 *     MIDDLEWARE JWT
 **************************/
const authenticateJWT = (req, res, next) => {
  const token = req.headers["auth-token"];

  if (!token) return res.status(401).send("Access Denied.");

  try {
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      const userVerified = jwt.verify(token, process.env.SECRET_KEY);

      req.user = userVerified;
      next();
    }
  } catch (error) {
    res.status(400).send("Invalid Token.");
  }
};

/**************************
 *        REGISTER
 ***************************/
users.post("/register", async (req, res) => {
  // Use Regex to check if email is valid.
  if(emailRegex.test(req.body.Email.toLowerCase())) {
    try {
      // Check if Email already exist.
      const queryUser = await pool.query("SELECT * FROM users WHERE email=($1)", [
        req.body.Email,
      ]);
  
      if (queryUser.rowCount == 0) {
        // Encrypt Password
        const hashPassword = bcrypt.hashSync(req.body.Password, 8);
  
        const newUser = await pool.query(
          "INSERT INTO users (email, name, password) VALUES ($1, $2, $3)  RETURNING *",
          [req.body.Email, req.body.Name, hashPassword]
        );
  
        res.json(newUser);
      } else {
        res.json({ error: "This Email already exists." });
      }
    } catch (error) {
      console.error("Fetch err: " + error.message);
    }
  } else {
    res.json({ error: "Email is invalid." });
  }
  
});

/**************************
 *        LOG IN
 **************************/
users.post("/login", async (req, res) => {
  try {
    const queryUser = await pool.query("SELECT * FROM users WHERE email=($1)", [
      req.body.Email,
    ]);

    // Check if Email exist.
    if (queryUser.rowCount != 0) {
      if (bcrypt.compareSync(req.body.Password, queryUser.rows[0].password)) {
        console.log(queryUser.rows[0].password);

        let token = jwt.sign(queryUser.rows[0], process.env.SECRET_KEY, {
          expiresIn: 9600,
        });

        // Send Response the token to client.
        res.json({ "auth-token": token });
      } else {
        res.send("Email/Password is incorrect.");
      }
    } else {
      res.json({ error: "Email/Password is incorrect." });
    }
  } catch (error) {
    console.error("Fetch err: " + error.message);
  }
});

/**************************
 *     VIEW ALL GROUPS
 **************************/
users.get("/view-all-groups", authenticateJWT, async (req, res) => {
  const currUser = req.user;

  try {
    const groupList = await pool.query(
      "SELECT * FROM groups WHERE group_owner=($1)",
      [currUser.email]
    );

    if (groupList.rowCount > 0) {
      res.json(groupList.rows);
    } else {
      res.send("You haven't created any group.");
    }
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
});


/**************************
 *   VIEW GROUP MEMBER
 **************************/
users.get("/view-group-member/:id", authenticateJWT, async (req, res) => {
  const currUser = req.user;
  const groupID = req.params.id;
  try {
    const groupList = await pool.query(
      "SELECT groups.group_id,  groups.group_name,  group_member.email, users.name FROM group_member INNER JOIN groups ON group_member.group_id = groups.group_id LEFT OUTER JOIN users ON group_member.email = users.email WHERE groups.group_id=($1) AND groups.group_owner=($2)",
      [groupID, currUser.email]
    );

    if (groupList.rowCount > 0) {
      res.json(groupList.rows);
    } else {
      res.send("The group selected doesn't exists or It doesn't belong to you.");
    }
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
});

/**************************
 *     CREATE NEW GROUP
 **************************/
users.post("/create-group", authenticateJWT, async (req, res) => {
  const currUser = req.user;

  try {
    const newGroup = await pool.query(
      "INSERT INTO groups (group_name, group_owner) VALUES ($1, $2)  RETURNING *",
      [req.body.GroupName, currUser.email]
    );

    if (newGroup.rowCount > 0) {
      res.json(newGroup.rows);
    } else {
      res.send("Unable to create new group.");
    }
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
});

/**************************
 *   ADD USER TO GROUP
 **************************/
users.post("/add-to-group", authenticateJWT, async (req, res) => {
  const currUser = req.user;

  try {
    console.log("Try Catch");
    const groupList = await pool.query(
      "SELECT * FROM groups WHERE group_owner=($1)",
      [currUser.email]
    );
    let checkValid = false;

    // Select all group belong to this User.
    groupList.rows.forEach((row) => {
      // Check the validity for the group.
      if (row["group_id"] == req.body.GroupID) {
        checkValid = true;
      }
    });

    if (checkValid) {
      const newMember = await pool.query(
        "INSERT INTO group_member (group_id, email) VALUES ($1, $2)  RETURNING *",
        [req.body.GroupID, req.body.Email]
      );

      console.log("Group Is Ok:" + newMember.rowCount);

      if (newMember.rowCount > 0) {
        res.json(newMember.rows);
      } else {
        res.send("Unable to add new member to group.");
      }
    } else {
      res.send("This Group doesn't belong to this user.");
    }
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
});

module.exports = users;
