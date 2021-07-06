import config from '../config/config';
import AxiosService from './axios-service';

const URL = config.baseUrl + "addressbookservice";

export default class AddressBookService {

  addContact(contactData) {
    return AxiosService.postService(`${URL}/create`, contactData);
  }
  getAllContacts() {
    return AxiosService.getService(`${URL}/get`);
  }
  getContactById(id) {
    return AxiosService.getService(`${URL}/get/${id}`);
  }
  updateContact(contactData) {
    return AxiosService.putService(`${URL}/update/${contactData.id}`, contactData);
  }
  deleteContact(id) {
    return AxiosService.deleteService(`${URL}/delete/${id}`);
  }
}