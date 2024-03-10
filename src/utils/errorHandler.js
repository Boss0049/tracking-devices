const CustomError = (errorOption) => {
  const exception = new Error();
  exception.header = errorOption?.header || "";
  exception.body = errorOption?.body || "";
  return exception;
};

export default CustomError;
