export default interface ICreatePatientDTO {
  first_name: string;
  last_name: string;
  email?: string;
  document_id: string;
  document_type: 'RG' | 'CPF' | 'Passaporte' | 'RNE';
  height?: number;
  weight?: number;
  mobility_restrictions?: string;
  medical_exam_request?: string;
  user_id: string;
}
