const fs = require('fs');
const path = require('path');

function UserHandler(fileName) {
  this.filePath = path.join(__dirname, '..','..' ,'public' ,'users', fileName);

  this.readData = function () {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error.message);
      return null;
    }
  };

  this.usernameExists = function (username) {
    const existingData = this.readData() || [];
    return existingData.find(user => user.username === username);
  };

  this.IDExists = function (id) {
    const existingData = this.readData() || [];
    return existingData.find(user => user.id === id);
  };
  
  this.addUserData = function (newUser) {
    try {
      // Check if the username already exists
      if (this.usernameExists(newUser.username)) {
        return 'User with the same username already exists.Try Different Username'
      }

      const existingData = this.readData() || [];
      existingData.push(newUser);
      fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2), 'utf8');
      return `Account Created ${newUser.username}`
    } catch (error) {
      console.error('Error adding user data:', error.message);
    }
  };

  this.updateUserName = function (userId, newName) {
    try {
      const existingData = this.readData() || [];
      const user = existingData.find(user => user.id === userId);

      if (!user) {
        return 'User not found.';
      }
      // Update user name
      user.name = newName;

      fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2), 'utf8');
      return `User name updated for ID: ${userId}`;
    } catch (error) {
      console.error('Error updating user name:', error.message);
    }
  };

  this.updateProfile = function (userId, newProfile) {
    try {
      const existingData = this.readData() || [];
      const user = existingData.find(user => user.id === userId);

      if (!user) {
        return 'User not found.';
      }
      // Update user name
      user.dp = newProfile;

      fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2), 'utf8');
      return `User name updated for ID: ${userId}`;
    } catch (error) {
      console.error('Error updating user name:', error.message);
    }
  };

  
  this.updateSocialLink= function (userId, NewSocialLink) {
    try {
      const existingData = this.readData() || [];
      const user = existingData.find(user => user.id === userId);

      if (!user) {
        return 'User not found.';
      }
      // Update user name
      user.socialLink = NewSocialLink;

      fs.writeFileSync(this.filePath, JSON.stringify(existingData, null, 2), 'utf8');
      return `User name updated for ID: ${userId}`;
    } catch (error) {
      console.error('Error updating user name:', error.message);
    }
  };
}

const user = new UserHandler('users.json')

module.exports = user;
