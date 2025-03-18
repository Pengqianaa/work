import React from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "../../CSS/common.scss";
import styled from "styled-components";

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column; /* Changed from 'flex-wrap: wrap;' to 'flex-direction: column;' for vertical layout */
  gap: 8px; /* Added gap for spacing between items */
`;

const ProfileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ProfileLabel = styled.div`
  width: 30%; /* Adjusted width to be a fixed percentage */
  text-align: right;
  padding-right: 8px; /* Added padding-right for spacing */
`;

const ProfileValue = styled.div`
  width: 70%; /* Adjusted width to be a fixed percentage */
`;

const UserProfile = (props) => {
  let user = useSelector((state) => state.user.user); // userStore.getData().user
  let computerNames = useSelector((state) => state.user.computerNames);
  computerNames = !!computerNames ? computerNames.join(", ") : "--";

  return (
    <Dialog
      open={props.show}
      onClose={() => {
        props.toggleFunc(false);
      }}
      fullWidth
      maxWidth="sm"
      paperProps={{ style: { backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } }}
    >
      <DialogTitle>
        <FormattedMessage id={"userProfile.title"} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <ProfileWrapper>
            <ProfileItem>
              <ProfileLabel>
                <FormattedMessage id={"userProfile.name"} /> :{" "}
              </ProfileLabel>
              <ProfileValue>{user.userName}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FormattedMessage id={"userProfile.organization"} /> :{" "}
              </ProfileLabel>
              <ProfileValue>{user.department}</ProfileValue>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FormattedMessage id={"userProfile.phone"} /> :{" "}
              </ProfileLabel>
            </ProfileItem>
            <ProfileItem>
              <ProfileLabel>
                <FormattedMessage id={"userProfile.computer"} /> :{" "}
              </ProfileLabel>
              <ProfileValue>{computerNames}</ProfileValue>
            </ProfileItem>
          </ProfileWrapper>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.toggleFunc(false);
          }}
          color="primary"
          variant="text"
        >
          <FormattedMessage id={"userProfile.close"} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfile;