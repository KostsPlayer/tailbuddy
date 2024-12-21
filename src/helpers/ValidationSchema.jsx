import * as yup from "yup";

export const signupSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password is too short - should be 8 chars minimum."),
});
