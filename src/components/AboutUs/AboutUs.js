import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import styles from './AboutUs.css';
import Modal from '../../ui/Modal/Modal';
import Spinner from '../../ui/Spinner/Spinner';
import Form from '../../ui/Form/Form';
import Footer from '../Footer/Footer';
import serverReq from '../../http/serverAxios';

class AboutUs extends Component {

  state = {
    showContactForm : false,
    showMessage : false,
    submitting : false
  }

  showContactForm = () => {
    this.setState({showContactForm: true});
  }

  hideContactForm = () => {
    this.setState({showContactForm: false});
  }

  hideMessage = () => {
    this.setState({showMessage: false});
  }

  formSubmit = (formFields) => {
    this.setState({submitting: true});
    const data = {
      inquiry           : formFields.inquiry.value,
      name              : formFields.name.value,
      affiliation       : formFields.affiliation.value,
      email             : formFields.email.value,
      contactNo         : formFields.contactNo.value,
      eventName         : formFields.eventName.value,
      additionalMessage : formFields.additionalMessage.value
    };
    serverReq.post('/api/inquiry/general', data, {
        headers : { 
          "Content-Type": "application/json"
        }
      })
      .then( resp => {
        this.setState({submitting: false});
        if(resp.data.status === 'error') {
          this.setState({showModal: true});
        }
        else{
          this.setState({showMessage: true});
        }
      })
      .catch( err => {
        this.setState({submitting: false});
      });
  }

  render () {
    return (
      <Aux>
        <Spinner loading={this.state.submitting} />
        <Modal title='CONTACT FORM' show={this.state.showContactForm} modalClosed={this.hideContactForm}>
          <Form onSubmit={this.formSubmit} />
        </Modal>
        <Modal title='Thanks!' show={this.state.showMessage} modalClosed={this.hideMessage}>
          <h3 style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.3em'}}>We will get back to your inquiry as soon as possible.</h3>
          <p style={{textAlign:'center', color:'rgba(0,0,0,0.8)', margin:'20px 0', fontFamily:'inherit', fontSize:'1.0em'}}>For immediate concerns, you may contact Gino Villame directly at gino@itemhound.com or +639178144466.</p>
        </Modal>
        
        <div style={{textAlign:'center', width:'100%'}}>
          <button className={styles.Button} onClick={this.showContactForm}>CONTACT US</button>
        </div>
        <div className={styles.AboutUs}>
          <h1>Keep track of all your race results and discover your race photos on MyRunTime!</h1>
          <p><a href="/signup">Sign up</a> and be connected to the community.</p>
          <h3>Organizing an event? Let us help you enrich experience of your participants! Here are what we offer:</h3>
          
          <br/>
          <h3>Timing Services (Running, Cycling, Multisport)</h3>
          <p>- No matter what size your event is, we have a package that fits the need</p>
          <p>- Whether Running, Cycling, or Multisport event, we offer solutions to make sure we capture every participant's performance</p>
        
          <br/>
          <h3>Online Registration (starts at Php20 per successful registrant)</h3>
          <p>- Simplify your participant's registration process by providing 24/7 registration option through our platform</p>
          <p>- Allow for multiple payment options -- credit card, bank deposit, or even through other payment outlets (e.g. LBC, 7-Eleven, Bayad Center, etc.)</p>
          <p>- Allow for delivery option straight to participant's address</p>
          <p>- Option to upsell event merchandise / products upon registration</p>
          <p>- We provide real-time access to race organizers for easy monitoring</p>
          <p>- Get billed based on successful registrants only</p>

          <br/>
          <h3>Race Kit Packing and Delivery Services (starts at Php10 per race kit)</h3>
          <p>- We offer race kit packing and race kit delivery services to help organizers manage order fulfillment</p>
          <p>- Inclusive of label stickers (for quick identification)</p>
          <p>- Inclusive of delivery to race kit pick-up site</p>

          <br/>
          <h3>Photo Services (starts at Php3500/event)</h3>
          <p>- We capture action shots of participants (check our photos here: <a href="https://www.facebook.com/pg/myruntime/photos">MyRunTime Facebook albums</a>)</p>
          <p>- Increase brand visibility through logo placements on all photos</p>
          <p>- Service is inclusive of editing and uploading</p>
          <p>- We make sure photos are easily discoverable through our website search function</p>

          <br/>
          <h3>Customized Website (starts at Php40,000)</h3>
          <p>- Have a lot to share to your participants? Highlight everything on your own website!</p>
          <p>- Inclusive of your own registration portal</p>
          <p>- Option to upsell merchandise / products on your website</p>

          <br/>
          <br/>

          <h3>Interested to collaborate with us? Send us a message at <a href="mailto:feedback@itemhound.com">feedback@itemhound.com</a></h3>

        </div>
        <Footer />
      </Aux>
    );
  }
};

export default AboutUs;