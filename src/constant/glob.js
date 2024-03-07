import {jwtDecode} from "jwt-decode";


const token = JSON.parse(localStorage.getItem('token'));
let userID = null;
let accountType = null;

try {
  const decoded = jwtDecode(token);

  userID = decoded.id;
  accountType = decoded.role;
} catch (error) {
  console.error('JWT verification failed:', error.message);
}

export { userID, accountType };