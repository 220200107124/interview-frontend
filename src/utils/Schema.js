import * as Yup from "yup";


export const loginSchema =  Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    })


export const candidateSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name can't exceed 50 characters")
    .required("First Name is required"),

  lname: Yup.string()
    .min(3, "Last Name must be at least 3 characters")
    .max(50, "Last Name can't exceed 50 characters")
    .required("Last Name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  tech: Yup.string()
    .oneOf(
      ["General", "React", "Node", "JavaScript", "Next js", "Graphic Design"],
      "Invalid tech option"
    )
    .required("Tech is required"),

  difficulty: Yup.string()
    .oneOf(["Easy", "Beginner", "Intermediate", "Advanced"], "Invalid difficulty option")
    .required("Difficulty is required"),
});
