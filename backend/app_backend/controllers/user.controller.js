const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

// Create and Save a new user
exports.create = async (req, res) => {
	try {
		const currentDate = new Date();
		const formattedDate = new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false, // Use 24-hour format
		}).format(currentDate);

		const userData = req.body;

		// Check if username or email already exists
		const existingUser = await User.findOne({
			where: {

				[Op.or]: [
					{ email: userData.email },
					{ username: userData.username  } // Exclude the current user being updated
				]
			}
		});

		if( existingUser){
			// Determine which field (email or username) is already taken
			let errorMessage = "";
			if (existingUser.username === userData.username) {
				errorMessage = "Username is already taken \n";
			}
			if (existingUser.email === userData.email) {
				errorMessage = errorMessage + "Email is already taken";
			}
			
			// Return an error response specifying the taken field
			return res.status(400).json({ message: errorMessage });
		}

		const hash = await bcrypt.hash(userData.password, 13);

		await User.create({
			createdAt: formattedDate,
			date_joined: formattedDate,
			username: userData.username,
			password: hash,
			email: userData.email,
			first_name: userData.first_name,
			last_name: userData.last_name,
			profile_pic: userData.profile_pic,
			updatedAt: formattedDate,
		});

		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}

};

// Retrieve all videos from the database.
exports.findAll = async (req, res) => {
	try {
		const users = await User.findAll();
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Find a single video with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	User.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.send(null);
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Tutorial with id=" + id
			});
		});
};

// Update a video by the id in the request
exports.update = (req, res) => {
  
};

// Delete a video with the specified id in the request
exports.delete = (req, res) => {
  
};

// Delete all videos from the database.
exports.deleteAll = (req, res) => {
  
};

// Find all published videos
exports.findAllPublished = (req, res) => {
  
};

exports.postCount = async (req, res) => {
	try {
		const count = await db.videos.count({
			where: {
				user_id: req.params.id
			}
		});

		if (!count) {
			return res.json(0);
		}
		res.json(count);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ where: { username } });
		
		if (!user) {
			return res.status(401).json({ message: "Invalid username" });
		}

		const validLogin = await bcrypt.compare(password, user.password);

		if(!validLogin){
			return res.status(401).json({message: "invalid password"});
		}

		res.json({ message: "Login successful", user });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


exports.testLogin = (req, res) => {
	res.json({ message: "Handling GET request to /login" });
};

exports.updateEmail = async (req, res) => {
	const { id } = req.params; // Extract the user id from request parameters
	const { newEmail } = req.body; // Extract the new email from request body
  
	try {
		// Check if username or email already exists
		const existingUserWithEmail = await User.findOne({
			where: {
				email: newEmail,
			}
		});

		if(existingUserWithEmail){
			
			// Return an error response specifying the taken field
			return res.status(400).json({ message: "Email is already taken" });
		}

		// Find the user by id
		const user = await User.findByPk(id);
  
		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
  
		// Update the email field
		user.email = newEmail;
		await user.save();
  
		res.json({ message: "Email updated successfully", user });
	} catch (error) {
		console.error("Error updating email:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


// Update password function
exports.updatePassword = async (req, res) => {
	const { id } = req.params; // Extract the user id from request parameters
	const { currentPassword, newPassword } = req.body; // Extract current and new password from request body
  
	try {
	  // Find the user by id
	  const user = await User.findByPk(id);
  
	  // Check if the user exists
	  if (!user) {
			return res.status(404).json({ message: "User not found" });
	  }
  
	  // Verify the current password
	  const validPassword = await bcrypt.compare(currentPassword, user.password);
	  if (!validPassword) {
			return res.status(401).json({ message: "Invalid current password" });
	  }
  
	  // Hash the new password
	  const newHashedPassword = await bcrypt.hash(newPassword, 13);
  
	  // Update the password field
	  user.password = newHashedPassword;
	  await user.save();
  
	  res.json({ message: "Password updated successfully" });
	} catch (error) {
	  console.error("Error updating password:", error);
	  res.status(500).json({ error: "Internal Server Error" });
	}
};
  

// Update profile picture function
exports.updateProfilePicture = async (req, res) => {
	const { id } = req.params; // Extract the user id from request parameters
	const { newProfilePic } = req.body; // Extract the new profile picture from request body
  
	try {
	  // Find the user by id
	  const user = await User.findByPk(id);
	  const old_pic_url = user.profile_pic;
  
	  // Check if the user exists
	  if (!user) {
			return res.status(404).json({ message: "User not found" });
	  }
  
	  // Update the profile picture field
	  user.profile_pic = newProfilePic;
	  await user.save();
  
	  res.json({ message: "Profile picture updated successfully", old_pic_url: old_pic_url });
	} catch (error) {
	  console.error("Error updating profile picture:", error);
	  res.status(500).json({ error: "Internal Server Error" });
	}
};

  
// Update username function
exports.updateUsername = async (req, res) => {
	const { id } = req.params; // Extract the user id from request parameters
	const { newUsername } = req.body; // Extract the new username from request body
  
	try {

		// Check if username or email already exists
		const existingUsername = await User.findOne({
			where: {
				username: newUsername,
			}
		});

		if(existingUsername){
				
			// Return an error response specifying the taken field
			return res.status(400).json({ message: "username is already taken" });
		}
		// Find the user by id
		const user = await User.findByPk(id);
  
		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
  
		// Update the username field
		user.username = newUsername;
		await user.save();
  
		res.json({ message: "Username updated successfully", user });
	} catch (error) {
		console.error("Error updating username:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
  