import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import classes from "./MyModal.module.css";


function MyModal({children, ...props}) {
  return (
    <Modal
      {...props}
      className={classes.myModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {children}
    </Modal>
  );
}

export default MyModal