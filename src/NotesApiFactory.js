import AwsNotesApi from "./AwsNotesApi";

export default class NotesApiFactory {
  static AWS = "AWS";

  static create(PROVIDER) {
    if (PROVIDER === NotesApiFactory.AWS) {
      return new AwsNotesApi();
    } else {
      throw new Error(`Unknown Provider ${PROVIDER}`);
    }
  }
}
