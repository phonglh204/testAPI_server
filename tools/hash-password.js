const bcrypt = require('bcrypt');

const password = 'thuyhd@123'; // đổi mật khẩu tại đây
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Lỗi hash:', err);
  } else {
    console.log(`Mật khẩu: ${password}`);
    console.log(`Hash:\n${hash}`);
  }
});
