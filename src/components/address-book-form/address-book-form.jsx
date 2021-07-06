import React from 'react';
import './address-book-form.scss';
import logo from '../../assets/images/logo.png';
import cross from '../../assets/images/cross.png'
import {Link, withRouter} from 'react-router-dom';
import AddressBookService from '../../services/address-book-service'; 

const initialState = {
  fullName: '',
  address: '',  
  city: '',
  state: '',
  zip: '',
  phoneNumber: '',

  id: '',      
  isUpdate: false,
  isError: false,

  error: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phoneNumber: ''
  },  
  valid: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phoneNumber: ''
  }
}
class AddressBookForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      address: '',
      locationInfo: {
        "Assam": ["Dispur", "Guwahati"],
        "Gujarat": ["Vadodara", "Surat"],
        "Uttar Pradesh": ["Lucknow", "Kanpur"],
        "Madhya Pradesh": ["Bhopal", "Jabalpur"]
      },
      city: '',
      state: '',
      zip: '',
      phoneNumber: '',

      id: '',      
      isUpdate: false,
      isError: false,

      error: {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phoneNumber: ''
      },  
      valid: {
        fullName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phoneNumber: ''
      }
    }
    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
    this.addressChangeHandler = this.addressChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);
    this.stateChangeHandler = this.stateChangeHandler.bind(this);
    this.zipChangeHandler = this.zipChangeHandler.bind(this);
  }

  componentDidMount = () => {
    let id = this.props.match.params.id;
    if(id !== undefined && id!=='') {
      this.getContactById(id);
    }
  }

  getContactById = (id) => {
    new AddressBookService().getContactById(id)
    .then(responseDTO => {
      let responseText = responseDTO.data;
      this.setContactData(responseText.data);
    }).catch(error => {
      console.log("Error while fetching contact data by ID :\n" + JSON.stringify(error));
    })
  }
  setContactData = (contact) => {
    this.setState({
      id: contact.id,
      fullName: contact.fullName,
      address: contact.address,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
      phoneNumber: contact.phoneNumber,
      isUpdate: true
    });
  }

  nameChangeHandler = (event) => {
    this.setState({fullName: event.target.value});
    this.checkName(event.target.value);
  }
  phoneNumberChangeHandler = (event) => {
    this.setState({phoneNumber: event.target.value});
    this.checkPhoneNumber(event.target.value);
  }
  addressChangeHandler = (event) => {
    this.setState({address: event.target.value});
    this.checkAddress(event.target.value);
  }
  cityChangeHandler = (event) => {
    this.setState({city: event.target.value})
    this.checkSelect('city', event.target.value);
  }
  stateChangeHandler = (event) => {
    this.setState({state: event.target.value});
    this.checkSelect('state', event.target.value);
  }
  zipChangeHandler = (event) => {
    this.setState({zip: event.target.value});
    this.checkZip(event.target.value);
  }

  initializeMessage = (field, errorMessage, validMessage) => {
    this.setState(previousState => ({
      error: {
        ...previousState.error,
        [field]: errorMessage
      }
    }));
    this.setState(previousState => ({
      valid: {
        ...previousState.valid,
        [field]: validMessage
      }
    }));
  }
  checkName = (nameValue) => {
    if(nameValue.length === 0) {
      this.initializeMessage('fullName', '', '');
    } else {
      const NAME_REGEX = RegExp("^[A-Z]{1}[a-z]{2,}[ ][A-Z]{1}[a-z]{2,}$");
      if(NAME_REGEX.test(nameValue)) {
        this.initializeMessage('fullName', '', '✓');
      } else {
        this.initializeMessage('fullName', 'Full Name is Invalid!', '');
      }
    }
  }
  checkPhoneNumber = (phoneNumberValue) => {
    if(phoneNumberValue.length === 0) {
      this.initializeMessage('phoneNumber', 'Phone Number is a Required Field!', '');
    } else {
      const PHONE_NUMBER_REGEX = RegExp("((^\\+?)(([0-9]{2,3})(\\s))?)[1-9]{1}[0-9]{9}$");
      if(PHONE_NUMBER_REGEX.test(phoneNumberValue)) {
        this.initializeMessage('phoneNumber', '', '✓');
      } else {
        this.initializeMessage('phoneNumber', 'Phone Number is Invalid!', '');
      }
    }
  }
  checkAddress = (addressValue) => {
    if(addressValue.length === 0) {
      this.initializeMessage('address', 'Address is a Required Field!', '');
    } else {
      const PHONE_NUMBER_REGEX = RegExp("^[A-Za-z0-9-,\\.]{3,}([\\s][A-Za-z0-9-,\\.]{3,}){0,}$");
      if(PHONE_NUMBER_REGEX.test(addressValue)) {
        this.initializeMessage('address', '', '✓');
      } else {
        this.initializeMessage('address', 'Address is Invalid!', '');
      }
    }
  }
  checkSelect = (field, fieldValue) => {
    if(fieldValue.length === 0) {
      this.initializeMessage(field, '✖', '');
    } else {
      this.initializeMessage(field, '', '✓');
    }    
  }
  checkZip = (zipValue) => {
    if(zipValue.length === 0) {
      this.initializeMessage('zip', '✖', '');
    } else {
      const ZIP_CODE_REGEX = RegExp("^[1-9]{1}[0-9]{5}$");
      if(ZIP_CODE_REGEX.test(zipValue)) {
        this.initializeMessage('zip', '', '✓');
      } else {
        this.initializeMessage('zip', '✖', '');
      }
    }
  }

  checkGlobalError = () =>{
    if(this.state.error.fullName.length === 0 && this.state.error.address.length === 0 && this.state.error.city.length === 0 
      && this.state.error.state.length === 0 && this.state.error.zip.length === 0 && this.state.error.phoneNumber.length === 0) {
        this.setState({isError: false});
      } else {
        this.setState({isError: true});
      }
  }

  checkValidations = async () => {
    await this.checkName(this.state.fullName);
    await this.checkAddress(this.state.address);
    await this.checkSelect('city',this.state.city);
    await this.checkSelect('state',this.state.state);
    await this.checkZip(this.state.zip);
    await this.checkPhoneNumber(this.state.phoneNumber);
    await this.checkGlobalError();
    return (this.state.isError);
  }
  save = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    saveOperation: {         
      if(await this.checkValidations()) {
        let errorLog = JSON.stringify(this.state.error);
        alert("Error Occured while Submitting the Form ==> ERROR LOG : " + errorLog);
        break saveOperation;
      }    
      let contactObject = {
        id: this.state.id,
        fullName: this.state.fullName,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        phoneNumber: this.state.phoneNumber
      }
      if(this.state.isUpdate) {
        new AddressBookService().updateContact(contactObject)
        .then(responseText => {
          alert("Contact Updated Successfully!!!\n" + JSON.stringify(responseText.data));
          this.reset();
          this.props.history.push("/home");
        }).catch(error => {
          console.log("Error while updating Contact!!!\n" + JSON.stringify(error));
        })
      } else {
        new AddressBookService().addContact(contactObject)
        .then(responseDTO => {
          let responseText = responseDTO.data;
          alert("Contact Added Successfully!!!\n" + JSON.stringify(responseText.data));
          this.reset();
          this.props.history.push("/home");
        }).catch(error => {
          console.log("Error while adding Contact!!!\n" + JSON.stringify(error));
        });
        this.reset();
      }
    }
  }

  reset = () => {
    this.setState({...initialState});
  }

  render () {
    return (
      <div className="body">
        <header className="headerContainer header">
            <div className="logoContainer">
                <img src={logo} alt="" />
                <div>
                    <span className="address-text">ADDRESS</span><br />
                    <span className="address-text book-text">BOOK</span>
                </div>
            </div>
        </header>
        <div className="form-content">
            <form className="form" action="#" onSubmit={this.save} onReset={this.reset}>
                <div className="form-head">
                    <div className="form-text">Person Address Form</div>
                    <div>
                        <Link to=''><img className="cancel-img" src={cross} alt="" /></Link>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="full-name" className="label text">Full Name</label>
                    <div className="validity-check">
                        <input className="input" value={this.state.fullName} onChange={this.nameChangeHandler} type="text" id="full-name" name="full-name" required />
                        <valid-message className="valid-full-name" htmlFor="full-name">{this.state.valid.fullName}</valid-message>
                        <error-output className="full-name-error" htmlFor="full-name">{this.state.error.fullName}</error-output>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="tel" className="label text">Phone Number</label>
                    <div className="validity-check">
                        <input className="input" value={this.state.phoneNumber} onChange={this.phoneNumberChangeHandler} type="tel" id="tel" name="tel" />
                        <valid-message className="valid-tel" htmlFor="tel">{this.state.valid.phoneNumber}</valid-message>
                        <error-output className="tel-error" htmlFor="tel">{this.state.error.phoneNumber}</error-output>
                    </div>
                </div>
                <div className="row-content">
                    <label htmlFor="address" className="label text">Address</label>
                    <div className="validity-check">
                        <textarea className="input text" value={this.state.address} onChange={this.addressChangeHandler} name="address" id="address" style={{height: "100px"}} ></textarea>
                        <valid-message className="valid-address" htmlFor="address">{this.state.valid.address}</valid-message>
                        <error-output className="address-error" htmlFor="address">{this.state.error.address}</error-output>
                    </div>
                </div>
                <div className="select-elements">
                    <div name="select-city" id="select-city" className="select-div">
                        <label htmlFor="city" className="label text">City</label>
                        <div className="validity-check">
                          <select name="city" id="city" value={this.state.city} onChange={this.cityChangeHandler}>
                            <option value="" hidden>Select City</option>
                             <option value="Jammu">Jammu</option>
                        <option value="Srinagar">Srinagar</option>
                        <option value="Leh">Leh</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Amritsar">Amritsar</option>
                        <option value="Ludhiana">Ludhiana</option>
                        <option value="Jalandhar">Jalandhar</option>
                        <option value="Pathankot">Pathankot</option>
                        <option value="Shimla">Shimla</option>
                        <option value="Manali">Manali</option>
                        <option value="Dharamshala">Dharamshala</option>
                        <option value="Haridwar">Haridwar</option>
                        <option value="Rishikesh">Rishikesh</option>
                        <option value="Rudraprayag">Rudraprayag</option>
                        <option value="Chamoli">Chamoli</option>
                        <option value="Dehradun">Dehradun</option>
                        <option value="Almora">Almora</option>
                        <option value="Ranikhet">Ranikhet</option>
                        <option value="Rohtak">Rohtak</option>
                        <option value="Sonipat">Sonipat</option>
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Faridabad">Faridabad</option>
                        <option value="Ambala">Ambala</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Karnal">Karnal</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Aligarh">Aligarh</option>
                        <option value="Noida">Noida</option>
                        <option value="Ghaziabad">Ghaziabad</option>
                        <option value="Agra">Agra</option>
                        <option value="Lucknow">Lucknow</option>
                        <option value="Allahabad">Allahabad</option>
                        <option value="Kanpur">Kanpur</option>
                        <option value="Merrut">Merrut</option>
                        <option value="Patna">Patna</option>
                        <option value="Vaishali">Vaishali</option>
                        <option value="Darbhanga">Darbhanga</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Alwar">Alwar</option>
                        <option value="Kota">Kota</option>
                        <option value="Jodhpur">Jodhpur</option>
                        <option value="Jaisalmer">Jaisalmer</option>
                        <option value="Bikaner">Bikaner</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                        <option value="Gandhinagar">Gandhinagar</option>
                        <option value="Vadodra">Vadodra</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Raipur">Raipur</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Murshidabad">Murshidabad</option>
                        <option value="Hooghly">Hooghly</option>
                        <option value="Asansol">Asansol</option>
                        <option value="Durgapur">Durgapur</option>
                        <option value="Bardhman">Bardhman</option>
                        <option value="Dhanbad">Dhanbad</option>
                        <option value="Ranchi">Ranchi</option>
                        <option value="Jamshedpur">Jamshedpur</option>
                        <option value="Puri">Puri</option>
                        <option value="Paradip">Paradip</option>
                        <option value="Bhubhneshwar">Bhubhneshwar</option>
                        <option value="Gangtok">Gangtok</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Amravati">Amravati</option>
                        <option value="Vishakapatnam">Vishakapatnam</option>
                        <option value="Itanagar">Itanagar</option>
                        <option value="Guwahati">Guwahati</option>
                        <option value="Dispur">Dispur</option>
                        <option value="Kazringa">Kazringa</option>
                        <option value="Panaji">Panaji</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Surathkal">Surathkal</option>
                        <option value="Mangalore">Mangalore</option>
                        <option value="Kochi">Kochi</option>
                        <option value="Thiruvanthapuram">Thiruvanthapuram</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Nagpur">Nagpur</option>
                        <option value="Pune">Pune</option>
                        <option value="Nasik">Nasik</option>
                        <option value="Thane">Thane</option>
                        <option value="Imphal">Imphal</option>
                        <option value="Shillong">Shillong</option>
                        <option value="Aizwal">Aizwal</option>
                        <option value="Kohima">Kohima</option>
                        <option value="Dimapur">Dimapur</option>
                        <option value="Agartala">Agartala</option>
                        <option value="Port Blair">Port Blair</option>
                        <option value="Kargil">Kargil</option>
                        <option value="Kavaratti">Kavaratti</option>
                        <option value="Pondicherry">Pondicherry</option>
                          </select>
                          <valid-message className="valid-city" htmlFor="city">{this.state.valid.city}</valid-message>
                          <error-output className="city-error" htmlFor="city">{this.state.error.city}</error-output>
                        </div>
                    </div>
                    <div name="select-state" id="select-state" className="select-div">
                        <label htmlFor="state" className="label text">State</label>
                        <div className="validity-check">
                          <select name="state" id="state" value={this.state.state} onChange={this.stateChangeHandler}>
                            <option value="" hidden>Select State</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Daman and Diu">Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                          </select>
                          <valid-message className="valid-state" htmlFor="state">{this.state.valid.state}</valid-message>
                          <error-output className="state-error" htmlFor="state">{this.state.error.state}</error-output>
                        </div>
                    </div>
                    <div name="select-zip" id="select-zip" className="select-div">
                        <label htmlFor="zip" className="label text">Zip Code</label>
                        <div className="validity-check">
                          <input className="input" type="postal" id="zip"  value={this.state.zip} onChange={this.zipChangeHandler} />                          
                          <valid-message className="valid-zip" htmlFor="zip">{this.state.valid.zip}</valid-message>
                          <error-output className="zip-error" htmlFor="zip">{this.state.error.zip}</error-output>
                        </div>
                    </div>
                </div>
                <div className="buttonParent">
                    <div className="submit-reset">
                        <button type="submit" className="button submitButton">{this.state.isUpdate ? 'Update' : 'Add'}</button>
                        <button type="reset" className="resetButton button">Reset</button>
                    </div>
                </div>
            </form>
        </div>
      </div>
    );
  }
}

export default withRouter(AddressBookForm);