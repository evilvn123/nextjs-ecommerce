const valid = (name, email, password, cf_password) => {
  if (!name || !email || !password) return "Hãy điền đầy đủ thông tin!";

  if (!validateEmail(email)) return "Email không hợp lệ!";

  if (password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";

  if (password != cf_password) return "Mật khẩu không trùng khớp.";
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export default valid;
