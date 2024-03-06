import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { RiMailSendLine } from 'react-icons/ri'
import Card from 'react-bootstrap/Card'
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListingPhoto from "./ListingPhoto"; 
import Button from 'react-bootstrap/Button';
import "./listingcard.scss"
const API = 'http://localhost:3000'




export default function ListingCard ({ isLoading, setIsLoading, user, currUser, setUser, listing, setListing, singlelisting, token, userList, loadingRequest, setLoadingRequest, setErrors }){
    const [messageModalShow, setMessageModalShow] = React.useState(false);
    const [showMore, setShowMore] = useState(`${singlelisting.desc.slice(0,50)}...`)
    const [showMoreToggle, setShowMoreToggle] = useState("more")
    const [inquiry, setInquiry] = useState("")
    let newHeader


    function handleShowMore () {
        if (showMoreToggle === "more") {
          setShowMore(`${singlelisting.desc}`)
          setShowMoreToggle("(less)")
        } else {
          setShowMore(`${singlelisting.desc.slice(0,50)}...`)
          setShowMoreToggle("more")
        }
    }

    function handleListInquire(){
        setIsLoading(true)
        fetch(`${API}/conversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                header: listing.title,
                user_id: currUser.id,
                user2_id: listing.user_id,
            })
        })
        .then((r) => {
            if (r.ok){
                r.json().then((inquiry) => {
                    setInquiry(inquiry)
                    setLoadingRequest(loadingRequest+1)
                })
            } else {
                r.json((err) => setErrors(err));
            }
        })
        setTimeout(() => setMessageModalShow(true), 200);
    }

    function SuccessModal(props) {
        return (
            <Modal
                {...props}
                size="m"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   Inquiry Sent!
                </Modal.Title>
            </Modal.Header>
            </Modal>
        );
    }    


    const findPoster = userList.filter((pb) => {
        if (pb.id == singlelisting.user_id) {
            return true
        }
    })

    const foundPoster = findPoster.map((p) => (
        <Card.Text key={p.id}><b>Posted By: </b> {p.username}</Card.Text>
    ))

    return (
        <div className="listing-card-container">
            <Card style={{width: '20rem', height: '28rem' }}>
                <ListingPhoto
                    className="listing-image-wrapper"
                    isLoading={isLoading} 
                    setIsLoading={setIsLoading} 
                    token={token} 
                    singlelisting={singlelisting}/>
                <Card.Body>
                    <Card.Title className="listing-title"><b>{singlelisting.title}</b></Card.Title>
                    <Row>
                        {foundPoster}
                    </Row>
                    <Row>
                        <Card.Text><b>Category:</b> {singlelisting.category}</Card.Text>
                    </Row>
                    <Row>
                        <Card.Text><b>Charge:</b> ${singlelisting.price} /hr</Card.Text>
                    </Row>
                    <Row>
                        <Card.Text><b>Location:</b> {singlelisting.location}</Card.Text>
                    </Row>
                    <Row>
                        <Card.Text><b>Description: </b>
                            {showMore}
                            <b onClick={handleShowMore}>{showMoreToggle}</b>
                        </Card.Text>
                    </Row>
                    <button 
                    className="contact-btn"
                    onClick={() => {
                        setIsLoading(true);
                        handleListInquire();
                    }} 
                    ><RiMailSendLine style={{ width: '3rem', height: '1rem' }}/></button>
                </Card.Body>
            </Card>
            <SuccessModal
                show={messageModalShow}
                onHide={() => setMessageModalShow(false)}
             />
        </div>
    )
}