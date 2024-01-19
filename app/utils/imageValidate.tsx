/** yup form validation */
export const MAX_FILE_SIZE: number = 2048000; // 2MB
export const BANNER_MAX_FILE_SIZE: number = 5120000; // 2MB
type TValidFileExtensions = {
  [key: string]: string[];
};

const validFileExtensions: TValidFileExtensions = {
  image: ["jpg", "png", "jpeg"],
};

export function isValidFileType(fileName?: string, fileType?: string) {
  if (fileName && fileType) {
    const validExtensions = validFileExtensions[fileType];

    // Pastikan validExtensions tidak null atau undefined
    if (validExtensions) {
      // Cek apakah ekstensi file ada dalam daftar validExtensions
      return validExtensions.indexOf(fileName.split(".").pop() as string) > -1;
    }
  }

  return false;
}
