const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
/**
 * get Users
 * @param {String} searchfn -fieldname for search
 * @param {RegExp} searchkey -search key
 * @returns {Array}
 */
async function getUsers(searchfn, searchkey) {
  const users = await usersRepository.getUsers();
  const results = [];
  const userkey = await usersRepository.getUserkey();
  if (!!searchfn && !!searchkey && userkey.includes(searchfn)) {
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      if (searchkey.test(user[searchfn])) {
        results.push({
          id: user.id,
          name: user.name,
          email: user.email,
        });
      }
    }
  } else {
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      results.push({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    }
  }
  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

async function splitFormat(query) {
  if (!!query) {
    const fieldname = query.match(/^[^:]+/) ? query.match(/^[^:]+/)[0] : null;
    const key = query.match(/(?<=:).+$/) ? query.match(/(?<=:).+$/)[0] : null;
    return [fieldname, key];
  } else {
    return [null, null];
  }
}

async function regularExpression(fieldname, key) {
  console.log(fieldname, key);
  const userkey = await usersRepository.getUserkey();
  let pattern;
  if (userkey.includes(fieldname)) {
    if (!!key) {
      pattern = new RegExp(key, 'i');
    } else {
      pattern = new RegExp('.*', 'i');
    }
    return pattern;
  } else {
    return;
  }
}

async function userSort(users, fieldname, key) {
  const userkey = await usersRepository.getUserkey();
  const sortedUser = await users.sort((a, b) => {
    if (key === 'asc' && userkey.includes(fieldname)) {
      return a[fieldname].localeCompare(b[fieldname]);
    } else if (key === 'desc' && userkey.includes(fieldname)) {
      return b[fieldname].localeCompare(a[fieldname]);
    } else {
      return a['email'].localeCompare(b['email']);
    }
  });
  return sortedUser;
}

async function pagination(users, page_size, page_number) {
  if (!!!page_size) {
    page_size = users.length;
  }
  const count = users.length;
  const total_pages = Math.ceil(count / page_size);
  if(page_number > total_pages){
    page_number = total_pages;
  }
  const start = (page_number - 1) * page_size;
  const end = page_number * page_size;
  let has_previous_page;
  let has_next_page;
  if (page_number > 1) {
    has_previous_page = true;
  } else {
    has_previous_page = false;
  }
  if (page_number < total_pages) {
    has_next_page = true;
  } else {
    has_next_page = false;
  }
  users = users.slice(start, end);
  const result = {
    page_number: page_number,
    page_size: page_size,
    count: count,
    total_pages: total_pages,
    has_previous_page: has_previous_page,
    has_next_page: has_next_page,
    data: users,
  };
  return result;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  pagination,
  emailIsRegistered,
  checkPassword,
  changePassword,
  splitFormat,
  regularExpression,
  userSort,
};
