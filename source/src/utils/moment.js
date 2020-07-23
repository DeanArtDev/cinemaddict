import moment from 'moment';

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};
export const formatTimeForComment = (date) => {
  return moment(date).format(`YYYY/MM/DD hh:mm`);
};
