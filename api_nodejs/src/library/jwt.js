import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const generateAccessToken = (publicID,email) => {
    return jwt.sign({ publicID, type: 'access',"email":email, }, jwtKeyAccessToken, { expiresIn: '720m' }); //720 minutes
  };
  
const generateRefreshToken = (publicID) => {
    return jwt.sign({ publicID, type: 'refresh' }, jwtKeyRefreshToken, { expiresIn: '7d' }); //7 day
};

const verifyAccessToken = (token) => {
    try {
    const decoded = jwt.verify(token, jwtKeyAccessToken);
    return decoded;
    } catch (error) {
        console.error('Error verifying Access Token:', error.message);
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, jwtKeyRefreshToken);
        return decoded;
    } catch (error) {
        console.error('Error verifying Refresh Token:', error.message);
        return null;
    }
};

export default {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken}