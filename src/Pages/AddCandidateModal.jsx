import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { candidateSchema } from "../validation/candidateSchema"; // your schema

function AddCandidateModal({ onAdd }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        + Add Candidate
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>

            <Formik
              initialValues={{
                name: "",
                lname: "",
                email: "",
                tech: "",
                difficulty: "",
              }}
              validationSchema={candidateSchema}
              onSubmit={(values, { resetForm }) => {
                onAdd(values); // callback to parent to save data
                resetForm();
                setOpen(false); // close modal
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block mb-1">First Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block mb-1">Last Name</label>
                    <Field
                      type="text"
                      name="lname"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <ErrorMessage
                      name="lname"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Tech */}
                  <div>
                    <label className="block mb-1">Tech</label>
                    <Field
                      as="select"
                      name="tech"
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select Tech</option>
                      <option value="General">General</option>
                      <option value="React">React</option>
                      <option value="Node">Node</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Next js">Next js</option>
                      <option value="Graphic Design">Graphic Design</option>
                    </Field>
                    <ErrorMessage
                      name="tech"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block mb-1">Difficulty</label>
                    <Field
                      as="select"
                      name="difficulty"
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select Difficulty</option>
                      <option value="Easy">Easy</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Field>
                    <ErrorMessage
                      name="difficulty"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCandidateModal;
