const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{8,15}$/;


const registerValidation = (req, res, next) => {
  const { fullName, email, phone, password } = req.body || {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    return res.status(400).json({ 
      message: 'fullName is required.' 
    });
  }


 if (email && phone) {
  return res.status(400).json({
    message: "Please provide either an email address or a phone number."
  });
}


  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format.'
    });
  }


  if (phone && !phoneRegex.test(phone)) {
    return res.status(400).json({
      message: 'Invalid phone number format.'
    });
  }


  if (!password || password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters.'
    });
  }


  next();
};



const loginValidation = (req, res, next) => {
  const { identifier, password } = req.body || {};

  if (
    !identifier ||
    typeof identifier !== "string" ||
    identifier.trim() === ""
  ) {
    return res.status(400).json({
      message: "Email or phone number is required.",
    });
  }

  if (
    !password ||
    typeof password !== "string" ||
    password.trim() === ""
  ) {
    return res.status(400).json({
      message: "Password is required.",
    });
  }

  next();
};


export {
  registerValidation,
  loginValidation
};