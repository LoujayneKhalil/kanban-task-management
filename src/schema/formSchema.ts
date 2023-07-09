import * as yup from "yup";

export const registerSchema = yup.object().shape({
  title: yup.string().required("Card title is required"),
  lists: yup.string().required("Please Select a Column Name"),
  column: yup.string().required('Column is required')
});
