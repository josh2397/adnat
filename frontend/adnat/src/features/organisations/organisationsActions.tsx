import React, { FunctionComponent, useState, useContext } from 'react';
import { Typography, Button, Card, CardContent, CardActions } from '@material-ui/core';
import { RouteComponentProps, Switch, Route } from 'react-router';
import Axios, { AxiosResponse } from 'axios';
import Cookies from '../../helpers/Cookies';
import { useEffect } from 'react';
import AuthContext, { defaultUserDetails } from '../../components/authContext';
import OrganisationsShifts from './organisationsShifts';
import OrganisationsEdit from './organisationsEdit';

const OrganisationsActions: FunctionComponent<RouteComponentProps> = ({location, history}) => {

    const authAPI = useContext(AuthContext);
    const updateUserDetails = authAPI.updateUserDetails ? authAPI.updateUserDetails : () => { console.log("updateUserDetails is undefined")};
    const userDetails = authAPI.userDetails ? authAPI.userDetails : defaultUserDetails;
    const [sessionId, setSessionId] = useState(location.state ? location.state.sessionId : Cookies.getCookieValue("sessionId"));    

    const handleGetOrganisation = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.get(
                `http://localhost:3000/organisations/${userDetails.organisationId}`,
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            if (response.status === 200) {
                const {organisationName, ...details} = userDetails;
                const updatedUserDetails = { organisationName: response.data.name, ...details};
                updateUserDetails(updatedUserDetails);
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    const handleViewShiftsClick = () => {
        history.push({
            pathname: '/organisation/actions/shifts',
            state: {
                sessionId: sessionId
            }
        });
    }
    
    const handleEditClick = () => {
        history.push({
            pathname: '/organisation/actions/edit',
            state: {
                sessionId: sessionId
            }
        })
    }

    const handleLeaveClick = async () => {
        try {
            const response: AxiosResponse<any> = await Axios.post(
                'http://localhost:3000/organisations/leave',
                {
                    userId: userDetails.id
                },
                {headers: {
                    "Authorization": sessionId,
                    "Content-Type": "application/json"
            }});

            if (response.status === 200) {
                history.push({
                    pathname: "/organisation/createjoin",
                    state: {
                        sessionId: sessionId
                    }
                })
            }
        } catch (ex) {
            console.log(ex);
        }
    }
    

    useEffect(() => {
        handleGetOrganisation();
    }, [])

    return (
        <>
            <Card style={{margin: "80px auto 0 auto", width: "80%"}}>
                <CardContent>
                    <Typography variant='h5'>
                        {userDetails.organisationName}
                    </Typography>
                </CardContent>
                
                <CardContent>
                    <Button color="secondary" onClick={handleViewShiftsClick}>View Shifts</Button>
                    <Button color="secondary" onClick={handleEditClick}>Edit</Button>
                    <Button color="secondary" onClick={handleLeaveClick}>Leave</Button>
                </CardContent>

                <CardActions>
                    <Switch>
                        <Route exact={true} component={OrganisationsShifts} path='/organisation/actions/shifts'/>
                        <Route exact={true} component={OrganisationsEdit} path='/organisation/actions/edit'/>
                    </Switch>
                </CardActions>
            </Card>

            
        </>
    );
};

export default OrganisationsActions;