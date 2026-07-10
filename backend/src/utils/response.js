const successResponse = (res, data = null, message = 'OK', status = 200, meta = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(status).json(payload);
};

const errorResponse = (res, message = 'Error', status = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors !== null) payload.errors = errors;
  return res.status(status).json(payload);
};

export { successResponse, errorResponse };
