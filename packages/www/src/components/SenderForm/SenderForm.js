import React from 'react';
import './SenderForm.scss'
import { Input, Button } from 'theme-ui';

const SenderForm = () => (
  <div className="sender-sub-main">
    <div className="sender-sub-inner">
      <div className="subscription-form">
        <div className="subscription-form-fields">
          <div className="subscription-form-content">
            <p>Te enviamos nuevas ideas cada semana</p>
          </div>
          <form
            id="sender-subscribe"
            className="sender-subscribe"
            action="https://app.sender.net/forms/sender_subscription/10172/b9825313"
            method="POST"
          >
            <div
              className="subscription-form-fields"
              id="subscription-form-fields"
            >
              <Input
                name="email"
                className="input email_type"
                id="email"
                data-label="Email"
                placeholder="Email"
                required
              />
            </div>
            <Button ml={3} className="submit-button" type="submit">
              Enviar
            </Button>
          </form>
        </div>
        <a
          className="sender-link"
          href="http://sender.net"
          title="Email marketing services"
        ></a>
      </div>
    </div>
  </div>
);

export default SenderForm;