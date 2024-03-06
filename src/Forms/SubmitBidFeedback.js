import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Button, Input, Page, setOptions } from '@mobiscroll/react';

setOptions({
  theme: 'ios',
  themeVariant: 'light'
});

function SubmitBidFeedback() {
  return (
    <Page>
      <div className="mbsc-grid mbsc-form-grid">
        <div className="mbsc-row">
          <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-4">
            <Input label="Contractor W/L" inputStyle="box" labelStyle="floating" placeholder="" />
          </div>
          <div className="mbsc-col-12 mbsc-col-lg-6">
            <Input label="Winning Contractor" inputStyle="box" labelStyle="floating" placeholder="" />
          </div>
        </div>
        <div className="mbsc-row">
          <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-3">
            <Input label="SMC W/L" inputStyle="box" labelStyle="floating" placeholder="" />
          </div>
          <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-4">
            <Input label="Winning Price" inputStyle="box" labelStyle="floating" placeholder="" />
          </div>
          <div className="mbsc-col-12 mbsc-col-md-6 mbsc-col-lg-4">
            <Input label="Additional Notes" inputStyle="box" labelStyle="floating" placeholder="" />
          </div>
        </div>
        <div className="mbsc-row">
          <div className="mbsc-col-12 mbsc-col-md-16 mbsc-col-lg-3">
            <div className="mbsc-button-group-block">
              <Button color="success">Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default SubmitBidFeedback;