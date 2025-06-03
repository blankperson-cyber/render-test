const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const bcrypt = require('bcrypt');
const multer = require("multer");
const storage = multer.memoryStorage(); // Store file as a buffer
const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

app.use(express.static('public'));

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Connected at:', res.rows[0].now);
  }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/about', async (req, res) => {
  try {
    const teamResult = await pool.query('SELECT * FROM teams ORDER BY team_id DESC');

    res.render('about', {
      teams: teamResult.rows || [], 
    });

  } catch (error) {
    console.error('Error fetching data:', error);

    res.render('about', {
      teams: [], 
    });
  }
});



app.get('/team', (req, res) => {
  res.render('team');
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/member', (req, res) => {
  res.render('member');
})

//add news
app.post('/admin/news', upload.single('news_img'), async (req, res) => {
  const { news_title, news_date, news_desc } = req.body;
  const news_img = req.file ? req.file.buffer : null; // Get binary image data

  try {
    // Generate news_id
    const result = await pool.query("SELECT COUNT(*) FROM news");
    const count = parseInt(result.rows[0].count) + 1;
    const news_id = `N${count.toString().padStart(2, '0')}`;

    const queryText = `
          INSERT INTO news(news_id, news_title, news_date, news_desc, news_img)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
      `;

    const insertResult = await pool.query(queryText, [
      news_id,
      news_title,
      news_date,
      news_desc,
      news_img
    ]);

    console.log('Inserted news item:', insertResult.rows[0]);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error inserting news item:', error);
    res.send('Error saving news item.');
  }
});

//edite the news informations
app.post('/admin/news/update', upload.single('news_img'), async (req, res) => {


  const { news_title, news_date, news_desc } = req.body;
  const newsId = req.body.news_id;
  const news_img = req.file ? req.file.filename : null; // Store filename

  if (!newsId) {
    return res.status(400).json({ success: false, message: "News ID is missing" });
  }

  try {
    const result = await pool.query(
      `UPDATE news SET news_title = $1, news_date = $2, news_img = $3, news_desc = $4 WHERE news_id = $5 RETURNING *`,
      [news_title, news_date, news_img, news_desc, newsId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `News ID ${newsId} not found` });
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
//delete news
app.delete('/admin/news/delete/:id', async (req, res) => {
  const newsId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM news WHERE news_id = $1', [newsId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `news ID ${newsId} not found` });
    }

    res.json({ success: true, message: `news ${newsId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//add lab
app.post('/admin/labs', upload.single('lab_img'), async (req, res) => {
  const { lab_name, lab_create_date, lab_desc } = req.body;
  const lab_img = req.file ? req.file.buffer : null; // Store image as a binary buffer

  if (!lab_name) {
    return res.status(400).send("Error: lab_name is required");
  }

  try {
    // Get the last inserted lab_id to generate a new one
    const idResult = await pool.query("SELECT lab_id FROM labs ORDER BY lab_id DESC LIMIT 1");
    let newLabId = 'L01';

    if (idResult.rows.length > 0) {
      const lastIdNum = parseInt(idResult.rows[0].lab_id.substring(1), 10);
      newLabId = `L${String(lastIdNum + 1).padStart(2, '0')}`;
    }

    const queryText = `
      INSERT INTO labs (lab_id, lab_name, lab_create_date, lab_img, lab_desc)
      VALUES ($1, $2, $3, $4, $5);
    `;

    await pool.query(queryText, [
      newLabId,
      lab_name,
      lab_create_date,
      lab_img, // Insert the binary image data here
      lab_desc
    ]);

    // Reload the page after insertion
    res.redirect('/admin');
  } catch (error) {
    console.error('Error inserting lab:', error);
    res.status(500).send("Error inserting lab");
  }
});


//delete lab
app.delete('/admin/labs/delete/:id', async (req, res) => {
  const labId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM labs WHERE lab_id = $1', [labId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `Lab ID ${labId} not found` });
    }

    res.json({ success: true, message: `Lab ${labId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
//edite the lab informations
app.post('/admin/labs/update', upload.single('lab_img'), async (req, res) => {


  const { lab_name, lab_create_date, lab_desc } = req.body;
  const labId = req.body.lab_id;
  const lab_img = req.file ? req.file.filename : null; // Save filename if a new image is uploaded

  if (!labId) {
    return res.status(400).json({ success: false, message: "Lab ID is missing" });
  }

  try {
    // If a new image was uploaded, update the image column; otherwise, keep the old image
    const queryText = lab_img
      ? `UPDATE labs SET lab_name = $1, lab_create_date = $2, lab_img = $3, lab_desc = $4 WHERE lab_id = $5 RETURNING *`
      : `UPDATE labs SET lab_name = $1, lab_create_date = $2, lab_desc = $3 WHERE lab_id = $4 RETURNING *`;

    const values = lab_img
      ? [lab_name, lab_create_date, lab_img, lab_desc, labId]
      : [lab_name, lab_create_date, lab_desc, labId];

    const result = await pool.query(queryText, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `Lab ID ${labId} not found` });
    }

    res.redirect('/admin'); // Redirect back to the admin page after update
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Login test 
app.post('/login/users', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "⚠️ Username and password are required." }); // ✅ Add return here
  }

  try {
    console.log("Username:", username);

    // Query user
    const userQuery = `
         SELECT COALESCE(a.user_id, m.user_id) AS user_id, u.password, 
       CASE 
           WHEN a.user_id IS NOT NULL THEN 'admin' 
           WHEN m.user_id IS NOT NULL THEN 'member' 
           ELSE NULL 
       END AS userType
FROM users u
LEFT JOIN admins a ON u.user_id = a.user_id
LEFT JOIN members m ON u.user_id = m.user_id
WHERE COALESCE(a.username, m.username) = $1`;
    const userResult = await pool.query(userQuery, [username]);

    console.log("User Query Result:", userResult.rows);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "⚠️ Invalid username or password." }); // ✅ Add return here
    }

    const { user_id, password: storedPassword, usertype } = userResult.rows[0];

    console.log("Stored Password from DB:", storedPassword);
    console.log("User Type:", usertype);
    console.log("Entered Password:", password);

    // Ensure password exists before comparing
    if (!storedPassword) {
      return res.status(401).json({ error: "⚠️ Password not found." }); // ✅ Add return here
    }

    // Compare passwords (if using plain text, just use ===)
    if (password === storedPassword) {
      console.log(`✅ ${usertype} login successful!`);

      return res.json({
        success: true,
        userType: usertype,
        redirect: usertype === 'admin' ? '/admin' : '/dashboard'
      }); // ✅ Make sure to return here
    }

    return res.status(401).json({ error: "⚠️ Invalid username or password." }); // ✅ Add return here

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: "⚠️ Something went wrong." }); // ✅ Add return here
  }
});


//end login test



// Signup test / SEND REQEUST


app.post("/signup/requests", async (req, res) => {
  try {
    const { firstname, lastname, email, username, password, date_of_birth ,gender } = req.body;

    // Insert into requests table
    await pool.query(
      "INSERT INTO requests (firstname, lastname, email, username, password,date_of_birth ,gender) VALUES ($1, $2, $3, $4, $5,$6,$7)",
      [firstname, lastname, email, username, password, date_of_birth,gender]
    );

    res.status(200).send("Signup request submitted.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});





// Main route that fetches lab/news/teams items and renders index.ejs
app.get('/', async (req, res) => {
  try {
    const labsResult = await pool.query('SELECT * FROM labs ORDER BY lab_create_date DESC');
    const newsResult = await pool.query('SELECT * FROM news ORDER BY news_date DESC');
    const teamsResult = await pool.query('SELECT * FROM teams ORDER BY team_creat_date');

    res.render('index', {
      labs: labsResult.rows || [],
      news: newsResult.rows || [],
      teams: teamsResult.rows || [],
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('index', { labs: [], news: [], teams: [] });  // Pass empty arrays if there's an error
  }
});



//insert users via requests

// Function to generate the next user_id (U00, U01, ..., U99)
async function generateUserId() {
  const result = await pool.query("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1");
  if (result.rows.length === 0) return "U00";

  let lastId = result.rows[0].user_id;
  let numericPart = parseInt(lastId.substring(1), 10) + 1;
  return `U${numericPart.toString().padStart(2, "0")}`;
}

// Accept request API

app.post("/admin/requests/accept-request/:request_id", async (req, res) => {
  try {
    const { request_id } = req.params;

    // Fetch request details
    const request = await pool.query("SELECT * FROM requests WHERE request_id = $1", [request_id]);
    if (request.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { email, firstname, lastname, username, password,date_of_birth } = request.rows[0]; // Assume request has a raw password

    // Check if the email already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "⚠️ Email already exists!" });
    }

    // Generate user_id
    const user_id = await generateUserId();

    await pool.query(
      "INSERT INTO users (user_id, email, firstname, lastname, password, role, created_at, date_of_birth) VALUES ($1, $2, $3, $4, $5, 'member', NOW(), $6)",
      [user_id, email, firstname, lastname, password, date_of_birth]
    );
    
    // Set default image for the new user (not all users)
    await pool.query(
      "UPDATE users SET image = pg_read_binary_file('C:/Users/carinfo/Desktop/projects/UNIV/public/Data/members/default_pic.jpg') WHERE user_id = $1 AND image IS NULL",
      [user_id]
    );

    // Insert into members table
    await pool.query(
      "INSERT INTO members (user_id, username) VALUES ($1, $2)",
      [user_id, username]
    );

    // Update the request status to "approved"
    await pool.query("UPDATE requests SET request_status = 'approved' WHERE request_id = $1", [request_id]);

    console.log(`✅ Request ${request_id} accepted and user ${user_id} created.`);
    res.json({ success: true, request_id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "⚠️ Server error. Please try again." });
  }
});


// reject request
app.post("/admin/requests/reject-request/:request_id", async (req, res) => {
  try {
    const { request_id } = req.params;

    // Fetch request details
    const request = await pool.query("SELECT * FROM requests WHERE request_id = $1", [request_id]);
    if (request.rows.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const { email, request_status } = request.rows[0];

    // Check if the request was previously accepted
    if (request_status === "approved") {
      // Find the user_id based on the email
      const user = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
      if (user.rows.length > 0) {
        const user_id = user.rows[0].user_id;

        // Delete from members first (to respect foreign key constraints)
        await pool.query("DELETE FROM members WHERE user_id = $1", [user_id]);

        // Then delete from users
        await pool.query("DELETE FROM users WHERE user_id = $1", [user_id]);
      }
    }

    // Update the request status to "rejected"
    await pool.query("UPDATE requests SET request_status = 'rejected' WHERE request_id = $1", [request_id]);

    console.log(`✅ Request ${request_id} rejected.`);
    res.json({ success: true, request_id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "⚠️ Server error. Please try again." });
  }
});

//delete request
app.delete('/admin/requests/delete/:id', async (req, res) => {
  const request_id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM requests WHERE request_id = $1', [request_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `request id ${request_id} not found` });
    }

    res.json({ success: true, message: `request ${request_id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//delete user
app.delete('/admin/users/delete/:id', async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `user id ${user_id} not found` });
    }

    res.json({ success: true, message: `user ${user_id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//ADD TEAMS 

const generateTeamID = async () => {
  const result = await pool.query("SELECT MAX(team_id) FROM teams");
  const lastID = result.rows[0].max; // Get last team_id

  let num = lastID ? parseInt(lastID.substring(1)) + 1 : 1;
  return `T${num.toString().padStart(3, '0')}`; // Ensures 3-digit format
};


async function generateResearchAreaID() {
  const result = await pool.query("SELECT COUNT(*) FROM team_research_areas");
  const count = parseInt(result.rows[0].count) + 1;
  return `RA${count.toString().padStart(5, '0')}`; // Formats: RA00001, RA00002, ..., RA99999
}


//add team
app.post("/admin/teams", upload.single("team_img"), async (req, res) => {
  const { team_title, team_leader_id, team_location, team_creat_date, team_desc, team_field, team_research, team_members } = req.body;
  const team_img = req.file ? req.file.buffer : null; // Store as binary buffer

  try {
    const team_id = await generateTeamID(); // Generate unique team ID

    await pool.query(
      "INSERT INTO teams (team_id, team_title, team_img, team_leader_id, team_location, team_creat_date, team_desc, team_field) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [team_id, team_title, team_img, team_leader_id, team_location, team_creat_date, team_desc, team_field]
    );

    for (const research_area of team_research) {
      const research_area_id = await generateResearchAreaID();
      await pool.query(
        "INSERT INTO team_research_areas (id, team_id, research_area) VALUES ($1, $2, $3)",
        [research_area_id, team_id, research_area]
      );
    }

    for (const member_id of team_members) {
      await pool.query(
        "UPDATE members SET team_id = $1 WHERE user_id = $2;",
        [team_id, member_id]
      );
    }

    await pool.query(
      "UPDATE members SET member_role = 'Leader' WHERE user_id = $1;",
      [team_leader_id]
    );

    res.json({ success: true, message: "Team added successfully!" });

  } catch (error) {
    console.error("Error adding team:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//edit teams
app.post('/admin/teams/update', upload.single('team_img'), async (req, res) => {
  const {
    team_title,
    team_creat_date,
    team_leader_id,
    team_location,
    team_desc,
    team_field
  } = req.body;

  const teamId = req.body.team_id;

  let team_img = null;
  if (req.file) {
    // Store the image file name, multer already handles the file as buffer
    team_img = Date.now() + '-' + req.file.originalname;  // Generate a unique filename
  }

  if (!teamId) {
    return res.status(400).json({ success: false, message: "Team ID is missing" });
  }

  try {
    const result = await pool.query(
      `UPDATE teams 
        SET team_title = $1,
            team_creat_date = $2,
            team_leader_id = $3,
            team_location = $4,
            team_desc = $5,
            team_field = $6,
            team_img = COALESCE($7, team_img)  -- Update image if new one is provided
        WHERE team_id = $8
        RETURNING *`,
      [
        team_title,
        team_creat_date,
        team_leader_id,
        team_location,
        team_desc,
        team_field,
        team_img,  // This is the file name (not the buffer)
        teamId
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: `Team ID ${teamId} not found` });
    }

    // Redirect or send success response
    res.redirect('/admin');
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Delete team member
app.post('/admin/teams/:teamId/members/:memberId/delete', async (req, res) => {
  const { teamId, memberId } = req.params;
  
  try {
    await pool.query('UPDATE members SET team_id = NULL WHERE team_id = $1 AND user_id = $2', [teamId, memberId]);

    
    // Redirect back to the admin page or the team members page
    res.redirect(`/admin?teamId=${teamId}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).send('Error deleting member');
  }
});

//add members
app.post('/admin/teams/:teamId/members', async (req, res) => {
  const { teamId } = req.params;
  const { member_id, member_role } = req.body;

  console.log('Assigning member:', { teamId, member_id, member_role });

  try {
    // Check if the team exists in the teams table
    const teamExists = await pool.query(
      'SELECT team_id FROM teams WHERE team_id = $1',
      [teamId]
    );

    if (teamExists.rows.length === 0) {
      return res.status(400).send('Team does not exist');
    }

    // Update member's team and role
    await pool.query(
      'UPDATE members SET team_id = $1, member_role = $2 WHERE user_id = $3',
      [teamId, member_role, member_id]
    );

    // If the member is a leader, update the team_leader_id in the teams table
    if (member_role.toLowerCase() === 'leader') {
      await pool.query(
        'UPDATE teams SET team_leader_id = $1 WHERE team_id = $2',
        [member_id, teamId]
      );
    }

    res.redirect(`/admin`);
  } catch (error) {
    console.error('Error assigning member:', error);
    res.status(500).send('Something went wrong');
  }
});




// DISPLAY TEAM IMG
app.get("/team/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT team_img FROM teams WHERE team_id = $1", [id]);

    if (result.rows.length === 0 || !result.rows[0].team_img) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", "image/jpeg"); // Adjust if using PNG, WebP, etc.
    res.send(result.rows[0].team_img);
  } catch (error) {
    console.error("Error fetching team image:", error);
    res.status(500).send("Server error");
  }
});

// DISPLAY lab IMG
app.get("/labs/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT lab_img FROM labs WHERE lab_id = $1", [id]);

    if (result.rows.length === 0 || !result.rows[0].lab_img) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", "image/jpg"); // Adjust if using PNG, WebP, etc.
    res.send(result.rows[0].lab_img);
  } catch (error) {
    console.error("Error fetching lab image:", error);
    res.status(500).send("Server error");
  }
});

//display news image 
app.get('/news/image/:id', async (req, res) => {
  try {
    const result = await pool.query("SELECT news_img FROM news WHERE news_id = $1", [req.params.id]);
    if (result.rows.length > 0) {
      res.set('Content-Type', 'image/png'); // Adjust type if necessary
      res.send(result.rows[0].news_img);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});


// fetch admin page
app.get('/admin',async (req, res) => {
  try {
    const labsResult = await pool.query('SELECT * FROM labs ORDER BY lab_create_date DESC');
    const newsResult = await pool.query('SELECT * FROM news ORDER BY news_date DESC');
    const requestsResult = await pool.query('SELECT * FROM requests ORDER BY request_id DESC');
    const adminsResult = await pool.query('SELECT * FROM admins');
    const membersResult = await pool.query('SELECT * FROM members');
    const usersResult = await pool.query('SELECT * FROM users');
    const teamsResult = await pool.query('SELECT * FROM teams ORDER BY team_creat_date');
    const researchAreasResult = await pool.query('SELECT * FROM team_research_areas ORDER BY team_id, research_area');
    const teammembersResult = await pool.query(`
      SELECT members.*, users.firstname, users.lastname, users.image
      FROM members
      LEFT JOIN users ON members.user_id = users.user_id
    `);

    const teamId = req.query.teamId || teamsResult.rows[0]?.team_id;
    // pass to front end
    res.render('admin', {
      labs: labsResult.rows || [],
      news: newsResult.rows || [],
      requests: requestsResult.rows || [],
      admins: adminsResult.rows || [],
      members: membersResult.rows || [],
      users: usersResult.rows || [],
      teams: teamsResult.rows || [],
      researchAreas: researchAreasResult.rows || [],
      teamId: teamId,
      teammembers: teammembersResult.rows || [],
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.render('admin', {
      labs: [],
      news: [],
      requests: [],
      admins: [],
      members: [],
      users: [],
      teams: [],
      researchAreas: [],
      teamId: [],
      teammembers: []
    });
  }
});

// Fetch team members for a specific team
app.get('/admin/teams/:teamId/members', async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const teamMembersResult = await pool.query(`
      SELECT members.*, users.firstname, users.lastname, users.image
      FROM members
      LEFT JOIN users ON members.user_id = users.user_id
      WHERE members.team_id = $1
    `, [teamId]);

    res.json({ members: teamMembersResult.rows });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).send('Error fetching team members');
  }
});


// crate the team pages
app.get('/team/:title', async (req, res) => {
  const teamTitle = req.params.title;

  try {
    // Fetch the selected team
    const teamResult = await pool.query("SELECT * FROM teams WHERE team_title = $1", [teamTitle]);
    const team = teamResult.rows[0];

    if (!team) {
      console.log(`Team not found: ${teamTitle}`);
      return res.status(404).send("Team not found");
    }

    // Fetch all teams for the dropdown menu
    const allTeamsResult = await pool.query("SELECT * FROM teams");
    const teams = allTeamsResult.rows;

    // Fetch team members with their user details
    const membersResult = await pool.query(`
        SELECT 
            users.user_id AS user_id, 
            users.firstname,
            users.lastname,
            users.image,
            members.school,
            members.degree,
            members.member_role
        FROM members
        JOIN users ON members.user_id = users.user_id
        WHERE members.team_id = $1
        ORDER BY 
            LOWER(member_role) = 'leader' DESC, -- Case-insensitive sorting by 'Leader'
            users.user_id -- secondary sorting to maintain order
      `, [team.team_id]);

    const members = membersResult.rows;

    // Fetch research areas for the team from the team_research_areas table
    const researchAreasResult = await pool.query(`
        SELECT research_area FROM team_research_areas WHERE team_id = $1
      `, [team.team_id]);

    const researchAreas = researchAreasResult.rows;

    // Render the page with all required data
    res.render("team", { team, teams, researchAreas, members });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});



//get user image for the team.ejs
app.get('/user/image/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT image FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length > 0 && result.rows[0].image) {
      res.setHeader('Content-Type', 'image/jpg');  // Adjust based on stored format
      res.send(result.rows[0].image);
    } else {
      res.sendFile(__dirname + '/public/default.png');  // Serve a default image
    }
  } catch (error) {
    console.error("Error fetching user image:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get research areas for a team
app.get('/admin/teams/:teamId/research-areas', async (req, res) => {
  const teamId = req.params.teamId;

  try {
    const result = await pool.query('SELECT * FROM team_research_areas WHERE team_id = $1', [teamId]);

    res.json({ research_areas: result.rows }); // Matching the frontend's expected key
  } catch (error) {
    console.error("Error fetching research areas:", error);
    res.status(500).send("Internal Server Error");
  }
});

//delete research area
app.post('/admin/teams/:teamId/research-areas/:research_area_id/delete', async (req, res) => {
  const { teamId, research_area_id } = req.params;

  console.log('Deleting research area with teamId:', teamId, 'and research_area_id:', research_area_id);

  try {
    const result = await pool.query(
      'DELETE FROM team_research_areas WHERE team_id = $1 AND id = $2',
      [teamId, research_area_id]
    );

    console.log('Delete result:', result);  // Log the result of the query

    if (result.rowCount === 0) {
      console.log('No rows were deleted. Maybe the research area ID does not exist.');
    }

    res.redirect(`/admin?teamId=${teamId}`);
  } catch (error) {
    console.error('Error deleting research area:', error);
    res.status(500).send('Error deleting research area');
  }
});


// Add research area from research areas modal
app.post('/admin/teams/:teamId/research-areas', async (req, res) => {
  const { teamId } = req.params;
  const { research_area } = req.body;  // Single research area (not an array)

  if (!research_area) {
    return res.status(400).send('No research area provided.');
  }

  try {
    const research_area_id = await generateResearchAreaID();  // Ensure this function generates a valid ID

    // Insert the research area
    await pool.query(
      "INSERT INTO team_research_areas (id, team_id, research_area) VALUES ($1, $2, $3)",
      [research_area_id, teamId, research_area]
    );

    res.redirect(`/admin?teamId=${teamId}`);
  } catch (error) {
    console.error('Error adding research area:', error);
    res.status(500).send('Something went wrong');
  }
});
//delete team
app.post('/admin/teams/:teamId/delete', async (req, res) => {
  const { teamId } = req.params;

  try {
    await pool.query('UPDATE members SET team_id = NULL WHERE team_id = $1', [teamId]);

    // Delete associated research areas (or other team-linked records)
    await pool.query('DELETE FROM team_research_areas WHERE team_id = $1', [teamId]);

    // Delete the team itself
    await pool.query('DELETE FROM teams WHERE team_id = $1', [teamId]);

    res.status(200).send('Team deleted successfully');
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).send('Failed to delete team');
  }
});



// Render member page
app.get("/member/:fullname_id", async (req, res) => {
  const fullname_id = req.params.fullname_id;
  const parts = fullname_id.split("-");
  const userId = parts[parts.length - 1]; // Extract the user ID

  try {
    // Query to get member details
    const memberQuery = "SELECT * FROM members WHERE user_id = $1";
    const { rows: memberRows } = await pool.query(memberQuery, [userId]);

    if (memberRows.length === 0) {
      return res.status(404).send("Member not found");
    }

    // Query to get user details
    const userQuery = "SELECT * FROM users WHERE user_id = $1";
    const { rows: userRows } = await pool.query(userQuery, [userId]);

    if (userRows.length === 0) {
      return res.status(404).send("User not found");
    }

    // Query to get team title
    const teamQuery = `
      SELECT teams.team_title 
      FROM teams 
      JOIN members ON members.team_id = teams.team_id 
      WHERE members.user_id = $1
    `;
    const { rows: teamRows } = await pool.query(teamQuery, [userId]);

    // Check if the user has a team
    const teamTitle = teamRows.length > 0 ? teamRows[0].team_title : "No Team Assigned";

    // Render the member page and pass member, user, and team data
    res.render("member", {
      member: memberRows[0],
      user: userRows[0],
      teamTitle
    });

  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).send("Server error");
  }
});


app.get('/memberpage', (req, res) => {
  res.render('memberpage');
});










app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
