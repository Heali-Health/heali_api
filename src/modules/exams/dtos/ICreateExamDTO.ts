export default interface ICreateExamDTO {
  title: string;
  slug: string;
  synonyms?: string;
  original_exams_ids?: string[];
}
