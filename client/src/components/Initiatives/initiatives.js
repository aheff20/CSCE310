import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Form, Button, Container, Table, Spinner, Row, Col, Card, Modal } from "react-bootstrap";
import classnames from "classnames";
import axios from "axios";
import React from "react";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";


function Initiatives(props) {
  const history = useHistory();
  const [allClassData, setClassData] = useState([]);
  const [allInternshipData, setInternshipData] = useState([]);
  const [allCertificateData, setCertificateData] = useState([]);
  const [allUserClassData, setUserClassData] = useState([]);
  const [allUserInternshipData, setUserInternshipData] = useState([]);
  const [allUserCertificateData, setUserCertificateData] = useState([]);
  const [allProgramData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal info
  const [initiativeType, setInitiativeType] = useState("Choose Type");
  const [showInitiative, setShowInitiative] = useState(false);
  const [isNew, setIsNew] = useState("Select Option"); // "Select Existing" or "Create New"
  const [error, setError] = useState({});
  // general body info
  const [initiativeID, setInitiativeID] = useState(-1);
  const [initiativeName, setInitiativeName] = useState("");
  const [initiativeDesc, setInitiativeDesc] = useState("");
  const [initiativeOptions, setInitiativeOptions] = useState([<option value={-1}>Choose Option</option>]);
  const [selectOption, setSelectOption] = useState(-1);
  // specific init info
  const [classType, setClassType] = useState("");
  const [internshipIsGov, setIsGov] = useState("Select Option"); // "yes" or "no"
  const [internshipLocation, setLocation] = useState("");
  const [certLevel, setCertLevel] = useState("");
  // general application info
  const [isApplying, setIsApplying] = useState(false);
  const [initiativeNum, setInitiativeNum] = useState(-1);
  const [UIN, setUIN] = useState(props.auth.user.uin);
  const [appStatus, setAppStatus] = useState("");
  const [appYear, setAppYear] = useState(new Date().getFullYear());
  // specific application info
  const [appSemester, setAppSemester] = useState("Select Option");
  const [certAppTraining, setCertAppTraining] = useState("");
  const [certAppProgramNum, setCertAppProgramNum] = useState(-1);
  const [certProgramOptions, setCertProgramOptions] = useState([<option value={-1}>Choose Option</option>]);
  
  // edit modal specifics???
  const [showEdit, setShowEdit] = useState(false);
  const [appNum, setAppNum] = useState(-1);


  useEffect(() => {
    /*
    if (props.auth.user.user_type == "Admin") {
      history.replace("/");
    }
    */
    axios.get("/initiatives/getAllClassData")
      .then((res) => {
        setClassData(res.data);
        //console.log(res.data);
    
    axios.get("/initiatives/getAllUserClassData")
      .then((res) => {
        setUserClassData(res.data);
        //console.log(res.data);

    axios.get("/initiatives/getAllInternshipData")
      .then((res) => {
        setInternshipData(res.data);
        //console.log(res.data);
    
    axios.get("/initiatives/getAllUserInternshipData")
      .then((res) => {
        setUserInternshipData(res.data);
        //console.log(res.data);

    axios.get("/initiatives/getAllCertificateData")
      .then((res) => {
        setCertificateData(res.data);
        //console.log(res.data);
        setLoading(false);
    
    axios.get("/initiatives/getAllUserCertificateData")
      .then((res) => {
        setUserCertificateData(res.data);
        //console.log(res.data);

    axios.get("/programs/getAllProgramData")
      .then((res) => {
        updateProgramOptionsHandler(res.data);
      })
      })
      })
      })
      })
      })
      })

  }, []);

  /**
   * Function open the main initiative modal
   */
  const openInitiativeHandler = (applyStatus) => {
    setIsApplying(applyStatus);
    if (!applyStatus) {
      setIsNew("Create New");
    }
    setShowInitiative(true);
  }

  /**
   * Function get reset initiative values (mainly for closing modals)
   */
  const resetModalValues = () => {
    setInitiativeType("Choose Type");
    setIsNew("Select Option");

    setInitiativeID(-1);
    setInitiativeName("");
    setInitiativeDesc("");
    setInitiativeOptions([<option value={-1}>Choose Option</option>]);
    setSelectOption(-1);

    setClassType("");
    setIsGov("");
    setCertLevel("");

    setIsApplying(false);
    setInitiativeNum(-1);
    setUIN(props.auth.user.uin);
    setAppStatus("");
    setAppYear(new Date().getFullYear());
    
    setAppSemester("Select Option");
    setCertAppTraining("");
    setCertAppProgramNum(-1);

    setAppNum(-1);

    setShowInitiative(false);
    setShowEdit(false);
  }

  /**
   * Function to handle behavior when changing the type of the initiative (in creation)
   */
  const changeInitiativeTypeHandler = (type) => {
    setInitiativeType(type);
    let opts = [];
    //console.log(opts);
    if (type == "Class" && allClassData.length > 0) opts = allClassData.map((Class) => (
      <option value={Class.class_id}>{Class.class_name}</option>
    ));
    else if (type == "Internship" && allInternshipData.length > 0) opts = allInternshipData.map((Internship) => (
      <option value={Internship.intern_id}>{Internship.company_name}</option>
    ));
    else if (type == "Certificate" && allCertificateData.length > 0) opts = allCertificateData.map((Certificate) => (
      <option value={Certificate.cert_id}>{Certificate.cert_name}</option>
    ));
    opts.unshift(
      <option value={-1}>Choose Option</option>
    );
    console.log(opts);
    setInitiativeOptions(opts);
  }

  /**
   * Function to load the options for program options (for certification)
   */
  const updateProgramOptionsHandler = (data) => {
    let dataf = data.filter((program) => (program.active));
    setProgramData(dataf);

    let opts = [];
    if (dataf.length > 0) opts = dataf.map((program) => (
      <option value={program.program_num}>{program.program_name}</option>
    ))
    opts.unshift(
      <option value={-1}>Choose Option</option>
    );

    setCertProgramOptions(opts);
  }

  /**
   * Function automatically fill in info when bringing in an existing initiative
   */
  const updateSelectionHandler = (id) => {
    setSelectOption(id);
    setInitiativeNum(id);
    if (id < 0) {
      setInitiativeName("");
      setInitiativeDesc("");
      setClassType("");
      setIsGov("Select Option");
      setCertLevel("");
      return;
    }

    if (initiativeType==="Class") {
      let Class = allClassData.filter((Class) => (Class.class_id))[0];
      if (Class) {
        console.log(Class);
        setInitiativeName(Class.class_name);
        setInitiativeDesc(Class.class_description);
        setClassType(Class.class_type);
      }
    }

    if (initiativeType==="Internship") {
      let Internship = allInternshipData.filter((Internship) => (Internship.intern_id))[0];
      if (Internship) {
        console.log(Internship);
        setInitiativeName(Internship.company_name);
        setInitiativeDesc(Internship.intern_description);
        setIsGov(Internship.is_gov ? "Yes" : "No");
        setLocation(Internship.location);
      }
    }

    if (initiativeType==="Certificate") {
      let Cert = allCertificateData.filter((Cert) => (Cert.cert_id))[0];
      if (Cert) {
        console.log(Cert);
        setInitiativeName(Cert.cert_name);
        setInitiativeDesc(Cert.cert_description);
        setCertLevel(Cert.cert_level);
      }
    }
    
  }

  /**
   * Function for creating an initiative (and application) [on button submission]
   */
  const createInitiativeHandler = () => {
    //changeInitiativeTypeHandler("Choose Type");
    if (initiativeType === "Choose Type") {
      alert("Please select the type of initiative");
      return;
    }
    
    if (isNew === "Select Option") {
      alert("Please select method of creation");
      return;
    }

    if (isNew === "Select Existing" && selectOption < 0) {
      alert("Please select a valid initiative");
      return;
    }

    const isNameFilled = (initiativeName.trim().length > 0);
    if (!isNameFilled) {
      alert("Please insert a name");
      return;
    }

    const isGovFilled = (initiativeType !== "Internship" || internshipIsGov !== "Select Option");
    if (!isGovFilled) {
      alert("Please select a government affiliation option");
    }

    if (isApplying) {
      if (!appYear) {
        alert("Please insert an application year");
        return;
      }

      if (initiativeType !== "Internship" && appSemester === "Select Option") {
        alert("Please select a semester");
        return;
      }

      if (initiativeType === "Certificate" && certAppProgramNum < 0) {
        alert("Please select a program");
        return;
      }
    }

    // create
    if (!isApplying && isNew !== "Create New") {
      alert("ERROR: expected to create new initiative, but option is not selected");
      return;
    }

    console.log("creating...");
    if (isNew === "Create New") {
      // class
      if (initiativeType === "Class") {
        axios.post("initiatives/createClass", {
          name : initiativeName,
          description : initiativeDesc,
          classType : classType
        })
        .then((res) => {
          if (isApplying) {
            console.log("created initiative");
            axios.get("initiatives/lastClassMatch", {
              params: {
                  class_name: initiativeName
              }}).then((res) => {
                let initID = res.data.class_id;
                console.log(initID);
                axios.post("initiatives/createClassEnrollment", {
                  uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
                  class_id : initID,
                  class_status : appStatus,
                  semester : appSemester,
                  year: appYear
                }).then((res) => {
                  history.go(0);
                  setLoading(true);
                })
              })
          } else {
            history.go(0);
            setLoading(true);
          }
        })
      }
      // internship
      if (initiativeType === "Internship") {
        console.log(initiativeName, initiativeDesc, internshipIsGov, location);
        axios.post("initiatives/createInternship", {
          name : initiativeName,
          description : initiativeDesc,
          isGov : internshipIsGov,
          location : internshipLocation
        })
        .then((res) => {
          if (isApplying) {
            console.log("created initiative");
            axios.get("initiatives/lastInternshipMatch", {
              params: {
                  internship_name: initiativeName
              }}).then((res) => {
                let initID = res.data.intern_id;
                console.log(initID);
                //
                axios.post("initiatives/createInternshipApplication", {
                  uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
                  intern_id : initID,
                  intern_status : appStatus,
                  year: appYear
                }).then((res) => {
                  history.go(0);
                  setLoading(true);
                })
                //
              })
          } else {
            history.go(0);
            setLoading(true);
          }
        })
      }
      // certificate
      if (initiativeType === "Certificate") {
        axios.post("initiatives/createCertification", {
          name : initiativeName,
          description : initiativeDesc,
          certLevel : certLevel
        })
        .then((res) => {
          if (isApplying) {
            console.log("created initiative");
            axios.get("initiatives/lastCertificateMatch", {
              params: {
                  cert_name: initiativeName
              }}).then((res) => {
                let initID = res.data.cert_id;
                console.log(initID);
                //
                axios.post("initiatives/createCertificationEnrollment", {
                  uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
                  cert_id : initID,
                  cert_status : appStatus,
                  training_status : certAppTraining,
                  program_num : certAppProgramNum,
                  semester : appSemester,
                  year: appYear
                }).then((res) => {
                  history.go(0);
                  setLoading(true);
                })
                //
              })
          } else {
            history.go(0);
            setLoading(true);
          }
        })
      }
    } else if (isApplying) {
      // class
      if (initiativeType === "Class") {
        axios.post("initiatives/createClassEnrollment", {
          uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
          class_id : initiativeNum,
          class_status : appStatus,
          semester : appSemester,
          year: appYear
        }).then((res) => {
          history.go(0);
          setLoading(true);
        })
      }
      // internship
      if (initiativeType === "Internship") {
        axios.post("initiatives/createInternshipApplication", {
          uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
          intern_id : initiativeNum,
          intern_status : appStatus,
          year: appYear
        }).then((res) => {
          history.go(0);
          setLoading(true);
        })
      }
      // certification
      if (initiativeType === "Certificate") {
        console.log(props.auth.user.uin, initiativeNum, appStatus, certAppTraining, certAppProgramNum, appYear);
        axios.post("initiatives/createCertificationEnrollment", {
          uin : props.auth.user.user_type === "Admin" ? UIN : props.auth.user.uin,
          cert_id : initiativeNum,
          cert_status : appStatus,
          training_status : certAppTraining,
          program_num : certAppProgramNum,
          semester : appSemester,
          year: appYear
        }).then((res) => {
          history.go(0);
          setLoading(true);
        })
      }
    }

  }

  /**
   * Function to setup class information editing
   */
  const editClassHandler = (ID, applyStatus) => {
    //console.log(ID);
    setInitiativeType("Class");
    setIsApplying(applyStatus);
    if(applyStatus) {
      setAppNum(ID);
      axios.get("/initiatives/getClassEnrollment", {
        params: {
          ce_num : ID
        }
      }).then((res) => {
        console.log(res.data);
        setInitiativeID(res.data.class_id);
        setUIN(res.data.uin);
        setAppStatus(res.data.class_status);
        setAppYear(res.data.yr);
        setAppSemester(res.data.semester);
        setShowEdit(true);
      })
    } else {
      setInitiativeID(ID);
      axios.get("/initiatives/getClass", {
        params: {
          class_id : ID
        }
      }).then((res) => {
        //console.log(res.data);
        setInitiativeName(res.data.class_name);
        setInitiativeDesc(res.data.class_description);
        setClassType(res.data.class_type);
        setShowEdit(true);
      })
    }
  }

  /**
   * Function to setup internship information editing
   */
  const editInternshipHandler = (ID, applyStatus) => {
    //console.log(ID);
    setInitiativeType("Internship");
    setIsApplying(applyStatus);
    if(applyStatus) {
      setAppNum(ID);
      axios.get("/initiatives/getInternshipApplication", {
        params: {
          ia_num : ID
        }
      }).then((res) => {
        setInitiativeID(res.data.intern_id);
        setUIN(res.data.uin);
        setAppStatus(res.data.intern_status);
        setAppYear(res.data.yr);
        setShowEdit(true);
      })
    } else {
      setInitiativeID(ID);
      axios.get("/initiatives/getInternship", {
        params: {
          intern_id : ID
        }
      }).then((res) => {
        //console.log(res.data);
        setInitiativeName(res.data.company_name);
        setInitiativeDesc(res.data.intern_description);
        setIsGov(res.data.is_gov);
        setLocation(res.data.location);
        setShowEdit(true);
      })
    }
  }

  /**
   * Function to setup certification information editing
   */
  const editCertificateHandler = (ID, applyStatus) => {
    ///
    //console.log(ID);
    setInitiativeType("Certificate");
    setIsApplying(applyStatus);
    if(applyStatus) {
      setAppNum(ID);
      axios.get("/initiatives/getCertificationEnrollment", {
        params: {
          certe_num : ID
        }
      }).then((res) => {
        console.log(res.data);
        setInitiativeID(res.data.cert_id);
        setUIN(res.data.uin);
        setAppStatus(res.data.cert_status);
        setCertAppTraining(res.data.training_status);
        setCertAppProgramNum(res.data.program_num);
        setAppSemester(res.data.semester);
        setAppYear(res.data.yr);
        setShowEdit(true);
      })
    } else {
      setInitiativeID(ID);
      axios.get("/initiatives/getCertification", {
        params: {
          cert_id : ID
        }
      }).then((res) => {
        //console.log(res.data);
        setInitiativeName(res.data.cert_name);
        setInitiativeDesc(res.data.cert_description);
        setCertLevel(res.data.cert_level);
        setShowEdit(true);
      })
    }
  }

  /**
   * Function to handle updating initiative data
   */
  const confirmEditHandler = () => {
    if (isApplying) {
      // apps/enrollments
      if (initiativeType==="Class") {
        axios.post("/initiatives/updateClassEnrollment", {
          ce_num: appNum,
          uin: UIN,
          class_id: initiativeID,
          status: appStatus,
          semester: appSemester,
          year: appYear
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
      if (initiativeType==="Internship") {
        //console.log(appNum, UIN, initiativeID, appStatus, appYear);
        axios.post("/initiatives/updateInternshipApplication", {
          ia_num: appNum,
          uin: UIN,
          intern_id: initiativeID,
          status: appStatus,
          year: appYear
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
      if (initiativeType==="Certificate") {
        axios.post("/initiatives/updateCertificationEnrollment", {
          certe_num: appNum,
          uin: UIN,
          cert_id: initiativeID,
          status: appStatus,
          training_status: certAppTraining,
          program_num: certAppProgramNum,
          semester: appSemester,
          year: appYear
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
    } else {
      // main objects
      if (initiativeType==="Class") {
        //console.log(initiativeID, initiativeName, initiativeDesc, classType);
        axios.post("/initiatives/updateClass", {
          ID: initiativeID,
          name: initiativeName,
          description: initiativeDesc,
          classType: classType
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
      if (initiativeType==="Internship") {
        //console.log(initiativeID, initiativeName, initiativeDesc, internshipIsGov, internshipLocation);
        axios.post("/initiatives/updateInternship", {
          ID: initiativeID,
          name: initiativeName,
          description: initiativeDesc,
          isGov: internshipIsGov,
          location: internshipLocation
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
      if (initiativeType==="Certificate") {
        axios.post("/initiatives/updateCertification", {
          ID: initiativeID,
          name: initiativeName,
          description: initiativeDesc,
          certLevel: certLevel
        }).then((res) => {
          if (res.status === 201) {
            console.log(res.data);
            setError(res.data);
          } else {
            setShowEdit(false);
            setLoading(true);
            history.go(0);
          }
        })
      }
    }
  }

  /**
   * Function to remove initiative data
   */
  const deletionHandler = () => {

  }

  /**
   * Function get table formats for classes
   */
  const getClassTable = (data, showUser, showEnroll) => {
    const list = [];
    for(let k = 0; k < data.length; k++) {
      let Class = data[k];
      // class_status   | semester |  yr

      const temp = <tr key={k}>
                      {showUser && 
                        <React.Fragment>
                          <td>{Class.uin}</td>
                          <td>{Class.first_name} {Class.m_initial} {Class.last_name}</td>
                        </React.Fragment>
                      }
                      <td>{Class.class_name}</td>
                      <td>{Class.class_description}</td>
                      <td>{Class.class_type}</td>
                      {showEnroll &&
                        <React.Fragment>
                          <td>{Class.class_status}</td>
                          <td>{Class.semester}</td>
                          <td>{Class.yr}</td>
                        </React.Fragment>
                      }
                      <td>
                        <Button variant="success btn-sm" onClick={() => {editClassHandler(showEnroll ? Class.ce_num : Class.class_id, showEnroll)}}>
                          Edit
                        </Button>
                      </td>
                   </tr>
      list.push(temp);
    }
    return list;
  }

  /**
   * Function get table formats for internships
   */
  const getInternshipTable = (data, showUser, showEnroll) => {
    const list = [];
    for(let k = 0; k < data.length; k++) {
      let Internship = data[k];

      const temp = <tr key={k}>
                      {showUser && 
                        <React.Fragment>
                          <td>{Internship.uin}</td>
                          <td>{Internship.first_name} {Internship.m_initial} {Internship.last_name}</td>
                        </React.Fragment>
                      }
                      <td>{Internship.company_name}</td>
                      <td>{Internship.intern_description}</td>
                      <td>{Internship.is_gov ? "Yes" : "No"}</td>
                      <td>{Internship.location}</td>
                      {showEnroll &&
                        <React.Fragment>
                          <td>{Internship.intern_status}</td>
                          <td>{Internship.yr}</td>
                        </React.Fragment>
                      }
                      <td>
                        <Button variant="success btn-sm" onClick={() => {editInternshipHandler(showEnroll ? Internship.ia_num : Internship.intern_id, showEnroll)}}>
                          Edit
                        </Button>
                      </td>
                   </tr>
      list.push(temp);
    }
    return list;
  }

  /**
   * Function get table formats for certifications
   */
  const getCertificationTable = (data, showUser, showEnroll) => {
    //cert_level |    cert_name     | cert_description
    //cert_status | training_status | program_num | semester | yr
    const list = [];
    for(let k = 0; k < data.length; k++) {
      let Cert = data[k];
      // class_status   | semester |  yr
      //console.log("Filtered...");
      let progName = allProgramData.filter((Program) => (Program.program_num === Cert.program_num))[0];
      if (progName === undefined) {
        progName = Cert.program_num;
      }
      else progName = progName.program_name;
      //console.log(progName);

      const temp = <tr key={k}>
                      {showUser && 
                        <React.Fragment>
                          <td>{Cert.uin}</td>
                          <td>{Cert.first_name} {Cert.m_initial} {Cert.last_name}</td>
                        </React.Fragment>
                      }
                      <td>{Cert.cert_name}</td>
                      <td>{Cert.cert_description}</td>
                      <td>{Cert.cert_level}</td>
                      {showEnroll &&
                        <React.Fragment>
                          <td>{Cert.cert_status}</td>
                          <td>{Cert.training_status}</td>
                          <td>{progName}</td>
                          <td>{Cert.semester}</td>
                          <td>{Cert.yr}</td>
                        </React.Fragment>
                      }
                      <td>
                        <Button variant="success btn-sm" onClick={() => {editCertificateHandler(showEnroll ? Cert.certe_num : Cert.cert_id, showEnroll)}}>
                          Edit
                        </Button>
                      </td>
                   </tr>
      list.push(temp);
    }
    return list;
  }

  return (
    <div className="Profile">
      {
        /*
         * CREATION MODAL
         */
      }
      <Modal show={showInitiative} onHide={resetModalValues}>
        <Modal.Header closeButton>
          <Modal.Title>
            Creating a New Initiative
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={4}>
              <b>Initiative Type:</b>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Select
                aria-label="Initiative Type"
                value={initiativeType}
                isInvalid={!!error.gender}
                onChange={(e) => {
                  {
                    changeInitiativeTypeHandler(e.target.value);
                    updateSelectionHandler(-1);
                  }
                }}
                >
                  <option>Choose Type</option>
                  <option>Class</option>
                  <option>Internship</option>
                  <option>Certificate</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {props.auth.user.user_type === "Admin" &&
            <Row>
              <Col sm={4}>
                <b>Apply a student</b>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="isApplying"
                    defaultChecked={isApplying}
                    onChange={(e) => {
                      if(isApplying) setIsNew("Create New");
                      setIsApplying(!isApplying);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          }
          {isApplying && 
            <React.Fragment>
              {props.auth.user.user_type === "Admin" && 
                <Row>
                  <Col sm={4}>
                    <b>Student UIN: </b>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Control
                      value={UIN}
                      isInvalid={!!error.UIN}
                      onChange={(e) => {
                        setUIN(e.target.value);
                      }}
                      required
                      id="Student UIN"
                      type="number"
                      min="0"
                      >
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              }
              <Row>
                <Col sm={4}>
                  <b>Select Existing or Create New</b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                    aria-label="Select Existing or Create New"
                    value={isNew}
                    isInvalid={!!error.isNew}
                    onChange={(e) => {
                      {
                        setIsNew(e.target.value);
                        updateSelectionHandler(-1);
                      }
                    }}
                    >
                      <option>Select Option</option>
                      <option>Select Existing</option>
                      <option>Create New</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </React.Fragment>
          }
          {isNew === "Select Existing" &&
            <React.Fragment>
              <Row>
                <Col sm={4}>
                  <b>Selection Options: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Select
                    aria-label="Selection Options"
                    value={selectOption}
                    isInvalid={!!error.isNew}
                    onChange={(e) => {
                      updateSelectionHandler(e.target.value);
                    }}
                    >
                      {initiativeOptions}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </React.Fragment>
          }
          
          {initiativeType !== "Choose Type" && isNew !== "Select Option" &&
            <React.Fragment>
              <hr />
              <Row>
                <Col sm={4}>
                  <b>Name: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeName}
                    isInvalid={!!error.initiativeName}
                    onChange={(e) => {
                      setInitiativeName(e.target.value);
                    }}
                    required
                    id="Initiative Name"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <b>Description: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeDesc}
                    isInvalid={!!error.initiativeDesc}
                    onChange={(e) => {
                      setInitiativeDesc(e.target.value);
                    }}
                    id="Initiative Description"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {initiativeType==="Class" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Class Type: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={classType}
                        isInvalid={!!error.classType}
                        onChange={(e) => {
                          setClassType(e.target.value);
                        }}
                        id="Class Type"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Internship" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Is Gov: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Select
                        aria-label="Is Gov"
                        value={internshipIsGov}
                        isInvalid={!!error.internshipIsGov}
                        disabled = {isNew === "Select Existing"}
                        onChange={(e) => {
                          setIsGov(e.target.value);
                        }}
                        >
                          <option>Select Option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <b>Location: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={internshipLocation}
                        isInvalid={!!error.internshipLocation}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        id="Internship Location"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Certificate" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Certificate Level: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={certLevel}
                        isInvalid={!!error.certLevel}
                        onChange={(e) => {
                          setCertLevel(e.target.value);
                        }}
                        id="Certificate Level"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              
              {isApplying && 
                <React.Fragment>
                  <hr/>
                  <Row>
                    <Col sm={4}>
                      <b>Application Status: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appStatus}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppStatus(e.target.value);
                        }}
                        required
                        id="Application Status"
                        type="text"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <b>Application Year: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appYear}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppYear(e.target.value);
                        }}
                        required
                        id="Application Year"
                        type="number"
                        min="0"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {(initiativeType==="Class" || initiativeType=="Certificate") && 
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Semester: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Application Semester"
                            value={appSemester}
                            isInvalid={!!error.appSemester}
                            onChange={(e) => {
                              setAppSemester(e.target.value);
                            }}
                            >
                              <option>Select Option</option>
                              <option>Spring</option>
                              <option>Summer</option>
                              <option>Fall</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
                  {initiativeType=="Certificate" &&
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Training Status: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Control
                            value={certAppTraining}
                            isInvalid={!!error.certAppTraining}
                            onChange={(e) => {
                              setCertAppTraining(e.target.value);
                            }}
                            required
                            id="Certification Training Status"
                            type="text"
                            >
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>
                          <b>Program: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Program Options"
                            value={certAppProgramNum}
                            isInvalid={!!error.certAppProgramNum}
                            onChange={(e) => {
                              setCertAppProgramNum(e.target.value);
                            }}
                            >
                              {certProgramOptions}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
                </React.Fragment>
              }

            </React.Fragment>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetModalValues}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createInitiativeHandler}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      {
        /*
         * EDITING MODAL
         */
      }
      <Modal show={showEdit} onHide={resetModalValues}>
        <Modal.Header closeButton>
          <Modal.Title>
            Editing Initiative
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isApplying ? (
            <React.Fragment>
              {props.auth.user.user_type === "Admin" && 
                <Row>
                  <Col sm={4}>
                    <b>Student UIN: </b>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Control
                      value={UIN}
                      isInvalid={!!error.UIN}
                      onChange={(e) => {
                        setUIN(e.target.value);
                      }}
                      required
                      id="Student UIN"
                      type="number"
                      min="0"
                      >
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              }
              <Row>
                    <Col sm={4}>
                      <b>Application Status: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appStatus}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppStatus(e.target.value);
                        }}
                        required
                        id="Application Status"
                        type="text"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <b>Application Year: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={appYear}
                        isInvalid={!!error.appStatus}
                        onChange={(e) => {
                          setAppYear(e.target.value);
                        }}
                        required
                        id="Application Year"
                        type="number"
                        min="0"
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  {(initiativeType==="Class" || initiativeType=="Certificate") && 
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Semester: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Application Semester"
                            value={appSemester}
                            isInvalid={!!error.appSemester}
                            onChange={(e) => {
                              setAppSemester(e.target.value);
                            }}
                            >
                              <option>Select Option</option>
                              <option>Spring</option>
                              <option>Summer</option>
                              <option>Fall</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
                  {initiativeType=="Certificate" &&
                    <React.Fragment>
                      <Row>
                        <Col sm={4}>
                          <b>Training Status: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Control
                            value={certAppTraining}
                            isInvalid={!!error.certAppTraining}
                            onChange={(e) => {
                              setCertAppTraining(e.target.value);
                            }}
                            required
                            id="Certification Training Status"
                            type="text"
                            >
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>
                          <b>Program: </b>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Select
                            aria-label="Program Options"
                            value={certAppProgramNum}
                            isInvalid={!!error.certAppProgramNum}
                            onChange={(e) => {
                              setCertAppProgramNum(e.target.value);
                            }}
                            >
                              {certProgramOptions}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </React.Fragment>
                  }
            </React.Fragment>
          ):(
            <React.Fragment>
              <Row>
                <Col sm={4}>
                  <b>Name: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeName}
                    isInvalid={!!error.initiativeName}
                    onChange={(e) => {
                      setInitiativeName(e.target.value);
                    }}
                    required
                    id="Initiative Name"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <b>Description: </b>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Control
                    value={initiativeDesc}
                    isInvalid={!!error.initiativeDesc}
                    onChange={(e) => {
                      setInitiativeDesc(e.target.value);
                    }}
                    id="Initiative Description"
                    type="text"
                    disabled = {isNew === "Select Existing"}
                    >
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              {initiativeType==="Class" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Class Type: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={classType}
                        isInvalid={!!error.classType}
                        onChange={(e) => {
                          setClassType(e.target.value);
                        }}
                        id="Class Type"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Internship" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Is Gov: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Select
                        aria-label="Is Gov"
                        value={internshipIsGov}
                        isInvalid={!!error.internshipIsGov}
                        disabled = {isNew === "Select Existing"}
                        onChange={(e) => {
                          setIsGov(e.target.value);
                        }}
                        >
                          <option>Select Option</option>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <b>Location: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={internshipLocation}
                        isInvalid={!!error.internshipLocation}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        id="Internship Location"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
              {initiativeType==="Certificate" &&
                <React.Fragment>
                  <Row>
                    <Col sm={4}>
                      <b>Certificate Level: </b>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Control
                        value={certLevel}
                        isInvalid={!!error.certLevel}
                        onChange={(e) => {
                          setCertLevel(e.target.value);
                        }}
                        id="Certificate Level"
                        type="text"
                        disabled = {isNew === "Select Existing"}
                        >
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </React.Fragment>
              }
            </React.Fragment>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={resetModalValues}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deletionHandler}>
            Delete
          </Button>
          <Button variant="primary" onClick={confirmEditHandler}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        {loading ? (
            <center>
                {" "}
                <Spinner animation="border" />{" "}
            </center>
        ):( 
          <React.Fragment>
            <br/>
            <h1 className="display-5 text-center">Initiatives</h1>
            <div className="col d-flex justify-content-center align-items-center">
              <Button variant="primary" onClick={() => openInitiativeHandler(props.auth.user.user_type === "Student")}>
                Create Initiative
              </Button>
            </div>
            <br/>
            {props.auth.user.user_type == "Admin" ? (
              <React.Fragment>
                <h2 className="display-5 text-center">Classes</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Class</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Class Type</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getClassTable(allClassData, false, false)}</tbody>
                </Table>
                <h2 className="display-5 text-center">Class Enrollments</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">UIN</th>
                      <th className="col-md-1">Name</th>
                      <th className="col-md-1">Class</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Class Type</th>
                      <th className="col-md-1">Class Status</th>
                      <th className="col-md-1">Semester</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getClassTable(allUserClassData, true, true)}</tbody>
                </Table>
                <br/>

                <h2 className="display-5 text-center">Internships</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Company</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Is Gov</th>
                      <th className="col-md-1">Location</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getInternshipTable(allInternshipData, false, false)}</tbody>
                </Table>
                <h2 className="display-5 text-center">Internship Applications</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">UIN</th>
                      <th className="col-md-1">Name</th>
                      <th className="col-md-1">Company</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Is Gov</th>
                      <th className="col-md-1">Location</th>
                      <th className="col-md-1">Status</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getInternshipTable(allUserInternshipData, true, true)}</tbody>
                </Table>
                <br/>

                <h2 className="display-5 text-center">Certificates</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Certificate</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Level</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getCertificationTable(allCertificateData, false, false)}</tbody>
                </Table>
                <h2 className="display-5 text-center">Certificate Enrollments</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">UIN</th>
                      <th className="col-md-1">Name</th>
                      <th className="col-md-1">Certificate</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Level</th>
                      <th className="col-md-1">Status</th>
                      <th className="col-md-1">Training Status</th>
                      <th className="col-md-1">Program</th>
                      <th className="col-md-1">Semester</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getCertificationTable(allUserCertificateData, true, true)}</tbody>
                </Table>
              </React.Fragment>
            ):(
              <React.Fragment>
                <h2 className="display-5 text-center">My Classes</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Class</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Class Type</th>
                      <th className="col-md-1">Class Status</th>
                      <th className="col-md-1">Semester</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getClassTable(allUserClassData.filter((Class) => (Class.uin===props.auth.user.uin)), false, true)}</tbody>
                </Table>

                <h2 className="display-5 text-center">My Internships</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Company</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Is Gov</th>
                      <th className="col-md-1">Location</th>
                      <th className="col-md-1">Status</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getInternshipTable(allUserInternshipData.filter((Internship) => (Internship.uin===props.auth.user.uin)), false, true)}</tbody>
                </Table>

                <h2 className="display-5 text-center">My Certificates</h2>
                <Table stiped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th className="col-md-1">Certificate</th>
                      <th className="col-md-1">Description</th>
                      <th className="col-md-1">Level</th>
                      <th className="col-md-1">Status</th>
                      <th className="col-md-1">Training Status</th>
                      <th className="col-md-1">Program</th>
                      <th className="col-md-1">Semester</th>
                      <th className="col-md-1">Year</th>
                      <th className="col-md-1">Edit</th>
                    </tr>
                  </thead>
                  <tbody>{getCertificationTable(allUserCertificateData.filter((Cert) => (Cert.uin===props.auth.user.uin)), false, true)}</tbody>
                </Table>

              </React.Fragment>
            )}
        </React.Fragment>
        )}
        </Container>
        </div>
      
  );
}

Initiatives.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Initiatives);
