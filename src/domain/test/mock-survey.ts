import { AddSurveyParams } from "@/data/protocols/db/survey/add-survey-protocols";
import { SurveyModel } from "@/data/usecases/survey/load-survey-by-id/db-load-load-survey-by-id-protocols";

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: "any_question",
  answers: [
    {
      image: "any_image",
      answer: "any_answer"
    }
  ],
  date: new Date()
});

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: "any_id",
    question: "any_question",
    answers: [{ image: "any_image", answer: "any_answer" }],
    date: new Date()
  };
};

export const mockSurveys = (): SurveyModel[] => {
  return [
    {
      id: "any_id",
      question: "any_question",
      answers: [{ image: "any_image", answer: "any_answer" }],
      date: new Date()
    },
    {
      id: "other_id",
      question: "other_question",
      answers: [{ image: "other_image", answer: "other_answer" }],
      date: new Date()
    }
  ];
};
