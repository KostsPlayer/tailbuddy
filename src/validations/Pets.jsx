import * as yup from "yup";

export const petsSchema = yup.object().shape({
  name: yup.string().required("Pet's Name is required"),
  location: yup.string().required("Pet's Location is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Pet's Price is required"),
  image: yup.mixed().test("required", "Pet's Image is required", (value) => {
    return value instanceof File || (value && typeof value === "object");
  }),
});
