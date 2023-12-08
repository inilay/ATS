import React,   { useState, useCallback, useRef } from "react";
import MyModal from "../MyModal/MyModal";
import MyButton from "../MyButton/MyButton";
import Modal from 'react-bootstrap/Modal';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 
import { toPng, toJpeg, toSvg } from 'html-to-image'
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import classes from "./BracketWrapper.module.css";
import DownloadBracketIcon from "../../../assets/svg/DownloadBracketIcon";

const BracketWrapper = ({children}) => {
  const ref = useRef(null)
  const handleFullScreen = useFullScreenHandle();
  const [modalShow, setModalShow] = useState(false);


  const filter = (node) => {
    const exclusionClasses = ['tools', ''];
    return !exclusionClasses.some((classname) => node.classList?.contains(classname));
  }

  const onButtonClickPng = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { filter:filter, cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'bracket.png'
        link.href = dataUrl
        link.click()
        setModalShow(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  const onButtonClickJPEG = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toJpeg(ref.current, { filter:filter, cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'bracket.png'
        link.href = dataUrl
        link.click()
        setModalShow(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  const onButtonClickSVG = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toSvg(ref.current, { filter:filter, cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'bracket.png'
        link.href = dataUrl
        link.click()
        setModalShow(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])


  return (
    
      <div ref={ref}>
        <FullScreen handle={handleFullScreen}>
        <TransformWrapper performance={true}>
          <React.Fragment>
            <div className="tools">
              <button style={{border: 'none'}} data-tooltip="Download bracket" onClick={() => setModalShow(true)}> 
                <DownloadBracketIcon/>
              </button>
              {/* <button onClick={handleFullScreen.enter} style={{border: 'none', background:'inherit'}} className="px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                className="toolsSvg"
              >
                <path fill="none" d="M0 0H20V20H0z"></path>
                <path d="M7 2H2v5l1.8-1.8L6.5 8 8 6.5 5.2 3.8 7 2zm6 0l1.8 1.8L12 6.5 13.5 8l2.7-2.7L18 7V2h-5zm.5 10L12 13.5l2.7 2.7L13 18h5v-5l-1.8 1.8-2.7-2.8zm-7 0l-2.7 2.7L2 13v5h5l-1.8-1.8L8 13.5 6.5 12z"></path>
              </svg>
              </button> */}
            </div>
            <TransformComponent>

            {children}

            </TransformComponent>
            </React.Fragment>
        </TransformWrapper>
        <MyModal 
            show={modalShow}
            onHide={() => setModalShow(false)}>
            <Modal.Header className={classes.myModalHeader} closeButton >
              Download Bracket
            </Modal.Header>
            <Modal.Body className={classes.myModalBody}>
              <div className='d-grid'>
                <MyButton additionalCl={`${classes.myBracketDownloadBtn} btn-md mb-3`} onClick={onButtonClickPng}>Png</MyButton>
                <MyButton additionalCl={`${classes.myBracketDownloadBtn} btn-md mb-3`} onClick={onButtonClickJPEG}>Jpeg</MyButton>
                <MyButton additionalCl={`${classes.myBracketDownloadBtn} btn-md mb-3`} onClick={onButtonClickSVG}>SVG</MyButton>
              </div>
            </Modal.Body>
        </MyModal>
      </FullScreen>
    </div>
    
)
};
export default BracketWrapper;