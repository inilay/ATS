import React from 'react'
import Card from 'react-bootstrap/Card';
import classes from "./MyCard.module.css";


const MyCard = ({additionalCl, children, ...props}) => {

  return (
      <Card className={`${classes.cardForm} ${additionalCl}`} {...props}>
            {children}
      </Card>
  );
}

export default MyCard