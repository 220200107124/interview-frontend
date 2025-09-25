import axios from "axios";

export const quizAPI = {
  getQuizzes: () =>
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/quizzes`)
      .then((res) => res.data),
  createQuiz: (quiz) =>
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/quizzes`, quiz)
      .then((res) => res.data),
  updateQuiz: (id, quiz) =>
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/quizzes/${id}`, quiz)
      .then((res) => res.data),
  deleteQuiz: (id) =>
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/quizzes/${id}`)
      .then((res) => res.data),
};
export const candidateAPI={
  getCandidates:()=>axios.get(`${process.env.REACT_APP_API_URL}/api/candidates`)
  .then((res)=>res.data),
  
}