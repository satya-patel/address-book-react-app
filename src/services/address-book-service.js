import config from '../config/config';
import AxiosService from './axios-service';

const URL = config.baseUrl + "addressbookservice";

export default class AddressBookService {

  addContact(employeeData) {
    return AxiosService.postService(`${URL}/create`, employeeData);
  }
}