const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const { removeTemp, uploadedFile, deleteFile } = require("../services/cloudinary");

const userCtrl = {
  //  Get a User
  getUser: async (req, res) => {
    const {id} = req.params;
    try {
      const user = await Users.findById(id);
      if(user) {
        const {password, ...otherDetails} = user._doc;
        return res.status(200).json(otherDetails);
      }
      res.status(404).json({message: "User not found!"});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // Get all Users
  getAllUser: async (req, res) => {
    try {
      let users = await Users.find();
      users = users.map(user => {
        const {password, ...otherDetails} = user._doc;
        return otherDetails
      })

      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // Update a User
  updateUser: async (req, res) => {
    const {id} = req.params;
    const {currentUserAdmin} = req;
    try {
      if(id === req.user.id || currentUserAdmin) {

        const user = await Users.findById(id);

        if(req.body.password) {
          const hashedPassword = await bcrypt.hash(req.body.password, 12);
          req.body.password = hashedPassword;
        }
        // Update images
        if(req.files) {
          if(req.files.profilePicture) {
            const profilePicture = req.files.profilePicture;
            if(profilePicture.mimetype !== "image/jpeg" && profilePicture.mimetype !== "image/png") {
              removeTemp(profilePicture.tempFilePath);
              return res.status(400).json({message: "File format is should png or jpeg!"})
            }

            const img = await uploadedFile(profilePicture);
            req.body.profilePicture = img;
            if(user.profilePicture.public_id) {
              await deleteFile(user.profilePicture.public_id);
            }
          }

          if(req.files.coverPicture) {
            const coverPicture = req.files.coverPicture;
            if(coverPicture.mimetype !== "image/jpeg" && coverPicture.mimetype !== "image/png") {
              removeTemp(coverPicture.tempFilePath);
              return res.status(400).json({message: "File format is should png or jpeg!"})
            }

            const img = await uploadedFile(coverPicture);
            req.body.coverPicture = img;
            if(user.coverPicture.public_id) {
              await deleteFile(user.coverPicture.public_id);
            }
          }
        }

        const updatedUser = await Users.findByIdAndUpdate(id, req.body, {new: true})
        const {password, ...otherDetails} = updatedUser._doc;
        res.status(200).json(otherDetails);
      } else {
        res.status(403).json({message: " Access Deined!. You can update only your own Account!"})
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  // Delete a User
  deleteUser: async (req, res) => {
    const {id} = req.params;
    const {currentUserAdmin} = req;
    try {
      if(id === req.user.id || currentUserAdmin) {
        
        // Delete images
        const deletedUser = await Users.findByIdAndDelete(id);
        if(deletedUser) {
          return res.status(200).json("User deleted successfully!");
        }
        res.status(404).json({message: "User not found!"});
      } else {
        res.status(403).json({message: " Access Deined!. You can delete only your own Account!"});
      }
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
}

module.exports = userCtrl