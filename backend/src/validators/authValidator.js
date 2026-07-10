const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerValidation = (req, res, next) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    return res.status(400).json({ message: 'fullName is required.' });
  }
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }
  return next();
};

const loginValidation = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'Password is required.' });
  }
  return next();
};

export { registerValidation, loginValidation };
