import { API_URL } from '../services/api';

export const FormattedUrlImage = (src) => {
  let formattedUrl = '';
  if (!src) {
    return '';
  }
  if (src instanceof File) {
    formattedUrl = URL.createObjectURL(src);
  }

  if (typeof src === 'string') {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      formattedUrl = src;
    } else {
      formattedUrl = `${API_URL}/${src}`;
    }
  }
  return formattedUrl;
};
