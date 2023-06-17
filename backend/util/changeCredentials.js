
const { ObjectId } = require('mongodb');
const { getClient } = require('./db');
const bcrypt = require('bcrypt');
client=getClient();
dbName = 'web_db';
const db = client.db(dbName);
const collectionName = 'users';
const collection = db.collection(collectionName);

async function updateName(userId, newName) {
  try {
    const objectId = new ObjectId(userId);

    await collection.updateOne({ _id: objectId }, { $set: { name: newName } });
    return { success: true, message: 'Name updated successfully' };
  } catch (error) {
    console.error('Error updating name:', error);
    return { success: false, message: 'Failed to update name' };
  }
}

async function updateEmail(userId, newEmail) {
  try {
    const objectId = new ObjectId(userId);
    const existingUser = await collection.findOne({ email: newEmail });
    if (existingUser) {
      return { success: false, message: 'Email already exists' };
    }
    await collection.updateOne({ _id: objectId }, { $set: { email: newEmail } });
    console.log('ici');
    return { success: true, message: 'Email updated successfully' };
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, message: 'Failed to update email' };
  }
}

async function updatePassword(userId, newPassword) {
  try {
    const objectId = new ObjectId(userId);
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await collection.updateOne({ _id: objectId }, { $set: { password: newHashedPassword } });

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {

    console.error('Error updating password:', error);
    return { success: false, message: 'Failed to update password' };
  }
}

module.exports = {
    updateName,
    updateEmail,
    updatePassword,
};